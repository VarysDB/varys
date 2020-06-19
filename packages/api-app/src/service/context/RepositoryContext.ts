import { FactRepository, NamespaceRepository, BlackboardRepository } from '@varys/domain';

export interface RepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;

    readonly blackboardRepository: BlackboardRepository;
}
