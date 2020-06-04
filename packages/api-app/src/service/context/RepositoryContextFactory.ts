import { RepositoryContext } from './RepositoryContext';
import { AtomicRepositoryContext } from './AtomicRepositoryContext';

export interface RepositoryContextFactory {

    newInstance(): Promise<RepositoryContext>;

    newAtomicInstance(): Promise<AtomicRepositoryContext>;
}
