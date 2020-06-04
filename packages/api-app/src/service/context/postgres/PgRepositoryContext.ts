import Knex from 'knex';
import { FactRepository, NamespaceRepository } from '@varys/domain';
import { FactPgRepository, NamespacePgRepository } from '@varys/port-pg';
import { RepositoryContext } from '../RepositoryContext';

export class PgRepositoryContext implements RepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;

    constructor(knex: Knex) {

        this.factRepository = new FactPgRepository(knex);

        this.namespaceRepository = new NamespacePgRepository(knex);
    }
}
