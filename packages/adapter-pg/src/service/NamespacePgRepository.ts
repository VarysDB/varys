import Knex from 'knex';
import { Namespace, NamespaceFact, NamespaceRepository } from '@varys/domain';
import { FactPgDAO } from './dao/FactPgDAO';
import { FactEntity } from './entity/FactEntity';

export class NamespacePgRepository implements NamespaceRepository {

    constructor(
        private readonly knex: Knex,
        private readonly schema: string
    ) {
    }

    private newDao(blackboard: string): FactPgDAO {
        return new FactPgDAO(this.knex, this.schema, blackboard);
    }

    async find(blackboard: string, namespace: string): Promise<Namespace> {

        const dao = this.newDao(blackboard);

        const entities = await dao.findLatestTypesByReference(namespace, null);

        return this.buildFromEntities(blackboard, namespace, entities);
    }

    async findSubset(blackboard: string, reference: string, factTypes: string[]): Promise<Namespace> {

        const dao = this.newDao(blackboard);

        const entities = await dao.findLatestTypesByReference(reference, factTypes);

        return this.buildFromEntities(blackboard, reference, entities);
    }

    private buildFromEntities(blackboard: string, reference: string, entities: FactEntity[]): Namespace {

        const facts = entities.reduce<Record<string, NamespaceFact>>((map, entity) => {
            map[entity.type] = {
                source: entity.source,
                data: entity.data,
                score: entity.score,
                discoveryDate: entity.discovery_date
            };
            return map;
        }, {});

        return {
            blackboard,
            reference,
            facts
        };
    }
}
