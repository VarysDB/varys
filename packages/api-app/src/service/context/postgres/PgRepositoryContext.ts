import Knex from 'knex';
import { BlackboardRepository, FactRepository, NamespaceRepository } from '@varys/domain';
import { BlackboardPgRepository, FactPgRepository, NamespacePgRepository } from '@varys/adapter-pg';
import { RepositoryContext } from '../RepositoryContext';

export class PgRepositoryContext implements RepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;

    readonly blackboardRepository: BlackboardRepository;

    constructor(knex: Knex, schema: string) {

        this.factRepository = new FactPgRepository(knex, schema);

        this.namespaceRepository = new NamespacePgRepository(knex, schema);

        this.blackboardRepository = new BlackboardPgRepository(knex, schema);
    }
}
