import Knex from 'knex';
import assert from 'assert';

import { KnexEntity } from './KnexEntity';
import { KnexDAO, SafePartial } from './KnexDAO';

export class KnexEntityDAO<TRecord extends KnexEntity> {

    private readonly knexDAO: KnexDAO<TRecord>;

    constructor(knex: Knex, table: string, schema: string) {
        this.knexDAO = new KnexDAO<TRecord>(knex, table, schema);
    }

    async findById(id: Knex.Value): Promise<TRecord | null> {
        return await this.knexDAO.findOne({ id });
    }

    async requireById(id: Knex.Value): Promise<TRecord> {

        const entity = await this.findById(id);

        assert(entity, `Could not find entity with id ${id}`);

        return entity;
    }

    async updateById(entity: SafePartial<TRecord>): Promise<void> {
        await this.knexDAO.updateWhere(entity, { id: entity.id });
    }

    async deleteById(id: Knex.Value): Promise<void> {
        this.knexDAO.ref()
            .where({ id })
            .del();
    }
}
