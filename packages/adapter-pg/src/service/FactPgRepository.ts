import Knex from 'knex';
import { Fact, FactNamespace, FactRepository } from '@varys/domain';
import { FactPgDAO } from './dao/FactPgDAO';

export class FactPgRepository implements FactRepository {

    constructor(
        private readonly knex: Knex,
        private readonly tablePrefix: string
    ) {
    }

    private newDao(namespaceType: string): FactPgDAO {
        return new FactPgDAO(this.knex, this.tablePrefix, namespaceType);
    }

    async save(fact: Fact): Promise<boolean> {

        // TODO: create table if not exists?
        // const namespaceEntity = await this.namespacePgDAO.findOrCreateByReference({
        //     id: uuid(),
        //     type: fact.namespace.type,
        //     reference: fact.namespace.reference,
        //     created_at: new Date(),
        //     updated_at: null
        // });

        const dao = this.newDao(fact.namespace.type);

        const { id, fingerprint } = dao.calculateId(fact.namespace.reference, fact.type, fact.source, fact.data);

        const factEntity = await dao.saveRevision({
            id,
            fingerprint,
            reference: fact.namespace.reference,
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

    async find(type: string, namespace: FactNamespace): Promise<Fact | null> {

        const dao = this.newDao(namespace.type);

        const factEntity = await dao.findLatestByReference(namespace.reference, type);
        if (!factEntity) {
            return null;
        }

        return {
            namespace: {
                type: namespace.type,
                reference: namespace.reference
            },
            type: factEntity.type,
            source: factEntity.source,
            data: factEntity.data,
            score: factEntity.score,
            discoveryDate: factEntity.discovery_date
        };
    }
}
