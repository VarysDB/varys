import Knex from 'knex';
import { FactRepository, NamespaceRepository } from '@varys/domain';
import { FactPgRepository, NamespacePgRepository } from '@varys/adapter-pg';
import { RepositoryContext } from '../RepositoryContext';

export class PgRepositoryContext implements RepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;

    constructor(knex: Knex) {

        const factsTable = 'facts';

        this.factRepository = new FactPgRepository(knex, factsTable);

        this.namespaceRepository = new NamespacePgRepository(knex, factsTable);
    }
}
