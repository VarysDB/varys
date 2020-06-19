import { RepositoryContext } from './RepositoryContext';
import { AtomicRepositoryContext } from './AtomicRepositoryContext';

export interface ContextFunction<R> {
    (context: RepositoryContext): Promise<R>;
}

export interface RepositoryContextFactory {

    newInstance(): Promise<RepositoryContext>;

    newAtomicInstance(): Promise<AtomicRepositoryContext>;

    exec<R>(fn: ContextFunction<R>): Promise<R>;

    atomicExec<R>(fn: ContextFunction<R>): Promise<R>;
}
