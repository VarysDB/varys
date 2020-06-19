import Knex from 'knex';
import { Blackboard, BlackboardRepository } from '@varys/domain';
import { FactPgDAO } from './dao/FactPgDAO';

export class BlackboardPgRepository implements BlackboardRepository {

    constructor(
        private readonly knex: Knex,
        private readonly schema: string
    ) {
    }

    private newDao(name: string): FactPgDAO {
        return new FactPgDAO(this.knex, this.schema, name);
    }

    async create(blackboard: Blackboard): Promise<void> {

        const dao = this.newDao(blackboard.name);

        await dao.createTable();
    }
}
