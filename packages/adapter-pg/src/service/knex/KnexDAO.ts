import Knex from 'knex';
import assert from 'assert';

export type SafePartial<TRecord> = TRecord extends {} ? Partial<TRecord> : any;

export type Where<TRecord> = Knex.Raw | Knex.QueryCallback | SafePartial<TRecord> | Object;

export class KnexDAO<TRecord extends {}> {

    constructor(
        private readonly knex: Knex,
        private readonly schema: string,
        private readonly table: string
    ) {
    }

    columns(entity: TRecord, alias?: string): string[] {

        const columns = Object.getOwnPropertyNames(entity);

        return alias ? columns.map(attribute => `${alias}.${attribute} as ${alias}.${attribute}`) : columns;
    }

    unalias(aliasedEntity: TRecord, alias: string): TRecord {

        const prefix = `${alias}.`;

        return Object.entries(aliasedEntity)
            .filter(([attribute, value]) => attribute.startsWith(prefix))
            .reduce((entity: Partial<TRecord>, [attribute, value]) => {

                Reflect.set(entity, attribute.substr(prefix.length), value);

                return entity;
            }, {}) as TRecord;
    }

    ref(alias?: string): Knex.QueryBuilder {

        const aliasedTable = alias ? `${this.table} as ${alias}` : this.table;

        return this.knex(aliasedTable).withSchema(this.schema);
    }

    async findOne(where: Where<TRecord>): Promise<TRecord | null> {

        return await this.ref()
            .select()
            .where(where)
            .first();
    }

    async requireOne(where: Where<TRecord>): Promise<TRecord> {

        const entity = await this.requireOne(where);

        assert(entity, `Could not find entity from ref "${this.schema}"."${this.table}" with query ${where}`);

        return entity;
    }

    async findAll(where: Where<TRecord>): Promise<TRecord[]> {

        return await this.ref()
            .select()
            .where(where);
    }

    async create(entity: TRecord): Promise<void> {
        await this.ref().insert(entity);
    }

    async createMany(entities: TRecord[]): Promise<void> {

        if (entities.length > 0) {
            await this.ref().insert(entities);
        }
    }

    async updateWhere(entity: SafePartial<TRecord>, where: Where<TRecord>): Promise<void> {

        await this.ref()
            .where(where)
            .update(entity);
    }

    async deleteWhere(where: Where<TRecord>): Promise<void> {

        this.ref()
            .where(where)
            .del();
    }

    async createOnConflict(entity: TRecord, keys: string[], onConflict: Knex.RawBinding): Promise<TRecord[]> {

        assert(keys.length > 0, 'Must provide at least one unique key');

        const insertQuery = this.ref().insert(entity);

        const { rows } = await this.knex.raw(`? ON CONFLICT (${keys.map(() => '??').join(', ')}) DO ?`, [
            insertQuery,
            ...keys,
            onConflict
        ]);

        return rows;
    }

    async createIfNotExists(entity: TRecord, uniqueKeys: string[], returnExisting: boolean): Promise<TRecord[]> {

        assert(uniqueKeys.length > 0, 'Must provide at least one unique key');

        const selectQuery = this.ref().select().where(function () {
            for (const key of uniqueKeys) {
                this.where(key, Reflect.get(entity, key));
            }
        });

        const keys = Object.keys(entity);

        const values = keys.map(key => Reflect.get(entity, key));

        const { rows } = await this.knex.raw(`
            WITH new_row AS (
                INSERT INTO "${this.schema}"."${this.table}" (${keys.map(() => '??').join(', ')})
                SELECT ${values.map(() => '?').join(', ')}
                WHERE NOT EXISTS ?
                RETURNING *
            )
            SELECT * FROM new_row
            UNION ALL ?`, [
            ...keys,
            ...values,
            selectQuery,
            returnExisting ? selectQuery : this.knex.raw(`SELECT * FROM "${this.schema}"."${this.table}" WHERE FALSE`)
        ]);

        return rows;
    }

    async createIgnore(entity: TRecord, uniqueKeys: string[]): Promise<TRecord | null> {

        const rows = await this.createIfNotExists(entity, uniqueKeys, false);

        assert(rows.length <= 1, `Expected to create a single row but got ${rows.length} rows`);

        return rows.length === 1 ? rows[0] : null;
    }

    async findOrCreate(entity: TRecord, uniqueKeys: string[]): Promise<TRecord> {

        const rows = await this.createIfNotExists(entity, uniqueKeys, true);

        assert(rows.length === 1, `Expected to find or create a single row but got ${rows.length} rows`);

        return rows[0];
    }

    async upsertOne(entity: TRecord, keys: string[]): Promise<TRecord> {

        // Remove both `id` and `created_at` attributes from update query
        const updateKeys = Object.getOwnPropertyNames(entity).filter(key => key !== 'id' && key !== 'created_at');

        const updateColumns = updateKeys.map(key => `${key} = ?`).join(',');

        const updateValues = updateKeys.map(key => Reflect.get(entity, key));

        const updateQuery = this.knex.raw(`UPDATE SET ${updateColumns} RETURNING *`, updateValues);

        const rows = await this.createOnConflict(entity, keys, updateQuery);

        assert(rows.length === 1, `Expected to upsert a single row but got ${rows.length} rows`);

        return rows[0];
    }

    async upsertById(entity: TRecord): Promise<TRecord> {

        return await this.upsertOne(entity, ['id']);
    }
}
