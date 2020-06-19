import { RepositoryContext } from './RepositoryContext';

export interface AtomicRepositoryContext extends RepositoryContext {

    commit(): Promise<void>;

    rollback(): Promise<void>;
}
