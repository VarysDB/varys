import { FactRepository, NamespaceRepository } from '@varys/domain';

export interface RepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;
}
