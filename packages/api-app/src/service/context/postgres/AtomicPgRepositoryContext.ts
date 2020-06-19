import Knex from 'knex';
import { BlackboardRepository, FactRepository, NamespaceRepository } from '@varys/domain';
import { BlackboardPgRepository, FactPgRepository, NamespacePgRepository } from '@varys/adapter-pg';
import { AtomicRepositoryContext } from '../AtomicRepositoryContext';

export class AtomicPgRepositoryContext implements AtomicRepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;

    readonly blackboardRepository: BlackboardRepository;

    constructor(private readonly transaction: Knex.Transaction, schema: string) {

        this.factRepository = new FactPgRepository(transaction, schema);

        this.namespaceRepository = new NamespacePgRepository(transaction, schema);

        this.blackboardRepository = new BlackboardPgRepository(transaction, schema);
    }

    async commit(): Promise<void> {
        await this.transaction.commit();
    }

    async rollback(): Promise<void> {
        await this.transaction.rollback();
    }
}
