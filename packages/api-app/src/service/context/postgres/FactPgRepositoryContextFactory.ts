import Knex from 'knex';

import { RepositoryContextFactory } from '../RepositoryContextFactory';
import { RepositoryContext } from '../RepositoryContext';
import { AtomicRepositoryContext } from '../AtomicRepositoryContext';
import { AtomicPgRepositoryContext } from './AtomicPgRepositoryContext';
import { PgRepositoryContext } from './PgRepositoryContext';

export class FactPgRepositoryContextFactory implements RepositoryContextFactory {

    constructor(private readonly knex: Knex) {
    }

    async newAtomicInstance(): Promise<AtomicRepositoryContext> {

        const transaction = await this.knex.transaction();

        return new AtomicPgRepositoryContext(transaction);
    }

    async newInstance(): Promise<RepositoryContext> {
        return new PgRepositoryContext(this.knex);
    }
}
