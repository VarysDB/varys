import Knex from 'knex';
import { Fact, FactRepository } from '@varys/domain';
import { FactPgDAO } from './dao/FactPgDAO';

export class FactPgRepository implements FactRepository {

    constructor(
        private readonly knex: Knex,
        private readonly schema: string
    ) {
    }

    private newDao(blackboard: string): FactPgDAO {
        return new FactPgDAO(this.knex, this.schema, blackboard);
    }

    async save(fact: Fact): Promise<boolean> {

        // TODO: create table if not exists?
        // const namespaceEntity = await this.namespacePgDAO.findOrCreateByReference({
        //     id: uuid(),
        //     type: fact.namespace.blackboard,
        //     namespace: fact.namespace,
        //     created_at: new Date(),
        //     updated_at: null
        // });

        const dao = this.newDao(fact.blackboard);

        const { id, fingerprint } = dao.calculateId(fact.namespace, fact.type, fact.source, fact.data);

        const factEntity = await dao.saveRevision({
            id,
            fingerprint,
            namespace: fact.namespace,
            type: fact.type,
            source: fact.source,
            data: JSON.stringify(fact.data),
            score: fact.score,
            discovery_date: fact.discoveryDate,
            created_at: new Date(),
            updated_at: new Date()
        });

        return !!factEntity;
    }

    async find(type: string, blackboard: string, namespace: string): Promise<Fact | null> {

        const dao = this.newDao(blackboard);

        const factEntity = await dao.findLatestByReference(namespace, type);
        if (!factEntity) {
            return null;
        }

        return {
            blackboard,
            namespace,
            type: factEntity.type,
            source: factEntity.source,
            data: factEntity.data,
            score: factEntity.score,
            discoveryDate: factEntity.discovery_date
        };
    }

    async findAll(blackboard: string, namespace: string): Promise<Fact[]> {

        const dao = this.newDao(blackboard);

        const factEntities = await dao.findLatestTypesByReference(namespace, null);

        return factEntities.map(entity => ({
            blackboard,
            namespace,
            type: entity.type,
            source: entity.source,
            data: entity.data,
            score: entity.score,
            discoveryDate: entity.discovery_date
        }));
    }
}
