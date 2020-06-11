import Knex from 'knex';
import { Namespace, NamespaceFact, NamespaceRepository } from '@varys/domain';
import { FactPgDAO } from './dao/FactPgDAO';
import { FactEntity } from './entity/FactEntity';

export class NamespacePgRepository implements NamespaceRepository {

    constructor(
        private readonly knex: Knex,
        private readonly tablePrefix: string
    ) {
    }

    private newDao(namespaceType: string): FactPgDAO {
        return new FactPgDAO(this.knex, this.tablePrefix, namespaceType);
    }

    async find(type: string, reference: string): Promise<Namespace | null> {

        const dao = this.newDao(type);

        const entities = await dao.findLatestTypesByReference(reference, null);

        return this.buildFromEntities(type, reference, entities);
    }

    async findSubset(type: string, reference: string, factTypes: string[]): Promise<Namespace | null> {

        const dao = this.newDao(type);

        const entities = await dao.findLatestTypesByReference(reference, factTypes);

        return this.buildFromEntities(type, reference, entities);
    }

    private buildFromEntities(type: string, reference: string, entities: FactEntity[]): Namespace {

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
            type,
            reference,
            facts
        };
    }
}
