import Knex from 'knex';

import { RepositoryContextFactory, ContextFunction } from '../RepositoryContextFactory';
import { RepositoryContext } from '../RepositoryContext';
import { AtomicRepositoryContext } from '../AtomicRepositoryContext';
import { AtomicPgRepositoryContext } from './AtomicPgRepositoryContext';
import { PgRepositoryContext } from './PgRepositoryContext';

export class PgRepositoryContextFactory implements RepositoryContextFactory {

    constructor(private readonly knex: Knex, private readonly schema: string) {
    }

    async newInstance(): Promise<RepositoryContext> {
        return new PgRepositoryContext(this.knex, this.schema);
    }

    async newAtomicInstance(): Promise<AtomicRepositoryContext> {

        const transaction = await this.knex.transaction();

        return new AtomicPgRepositoryContext(transaction, this.schema);
    }

    async exec<R>(fn: ContextFunction<R>): Promise<R> {
        const context = await this.newInstance();

        return await fn(context);
    }

    async atomicExec<R>(fn: ContextFunction<R>): Promise<R> {
        const context = await this.newAtomicInstance();

        try {
            const result = await fn(context);

            await context.commit();

            return result;
        } catch (err) {
            await context.rollback();

            throw err;
        }
    }
}
