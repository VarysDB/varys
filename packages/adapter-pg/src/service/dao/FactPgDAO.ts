import Knex from 'knex';
import * as uuid from 'uuid';
import objectHash from 'object-hash';
import { FactData } from '@varys/domain';
import { KnexDAO } from '../knex/KnexDAO';
import { FactEntity } from '../entity/FactEntity';

interface FactId {
    id: string;
    fingerprint: string;
}

export class FactPgDAO {

    private readonly baseDAO: KnexDAO<FactEntity>;

    constructor(
        private readonly knex: Knex,
        private readonly schema: string,
        private readonly blackboard: string
    ) {
        this.baseDAO = new KnexDAO<FactEntity>(knex, schema, blackboard);
    }

    async createTable(): Promise<void> {

        const ref = this.knex.schema.withSchema(this.schema);

        if (await ref.hasTable(this.blackboard)) {
            return;
        }

        await ref.createTable(this.blackboard, table => {
            table.uuid('id').primary();
            table.string('fingerprint').notNullable();
            table.string('namespace').notNullable().index();
            table.string('type').notNullable();
            table.string('source').notNullable();
            table.json('data').notNullable();
            table.specificType('score', 'smallint').notNullable();
            table.timestamp('discovery_date').notNullable();
            table.timestamps();
        });
    }

    calculateId(namespace: string, type: string, source: string, data: FactData, discoveryDate: Date): FactId {

        const fingerprint = `${namespace}:${type}:${source}:${objectHash.sha1(data)}:${discoveryDate.getTime()}`;

        const id = uuid.v5(fingerprint, '00000000-0000-0000-0000-000000000000');

        return { id, fingerprint };
    }

    async findLatestByReference(namespace: string, type: string): Promise<FactEntity | null> {

        const [entities] = await this.findLatestTypesByReference(namespace, [type]);

        return entities || null;
    }

    async findLatestTypesByReference(namespace: string, types: string[] | null): Promise<FactEntity[]> {
        return await this.baseDAO.ref()
            .select(this.knex.raw('DISTINCT ON ("namespace", "type") *'))
            .where('namespace', namespace)
            .where(builder => {
                if (types) {
                    builder.whereIn('type', types);
                }
            })
            .orderBy('namespace', 'asc')
            .orderBy('type', 'desc')
            .orderBy('score', 'desc')
            .orderBy('discovery_date', 'desc');
    }

    async saveRevision(entity: FactEntity): Promise<FactEntity | null> {
        return await this.baseDAO.createIgnore(entity, ['id']);
    }

    async saveRevisions(entities: FactEntity[]): Promise<(FactEntity | null)[]> {

        const revisions = [];

        // TODO: add support for a single query
        for (const entity of entities) {
            revisions.push(await this.baseDAO.createIgnore(entity, ['id']));
        }

        return revisions;
    }
}
