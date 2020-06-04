import { FactRepository, NamespaceRepository } from '@varys/domain';

export interface AtomicRepositoryContext {

    commit(): Promise<void>;

    rollback(): Promise<void>;

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;
}
