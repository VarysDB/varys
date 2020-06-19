import { Namespace } from '@varys/domain';
import { RepositoryContextFactory } from './context/RepositoryContextFactory';

export class NamespaceService {

    constructor(
        private readonly contextFactory: RepositoryContextFactory
    ) {
    }

    async findByReference(reference: string, blackboard: string): Promise<Namespace> {
        return await this.contextFactory.atomicExec(({ namespaceRepository }) =>
            namespaceRepository.find(blackboard, reference)
        );
    }
}
