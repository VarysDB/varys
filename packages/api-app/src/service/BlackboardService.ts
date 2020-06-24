import { Blackboard } from '@varys/domain';
import { RepositoryContextFactory } from './context/RepositoryContextFactory';

export class BlackboardService {

    constructor(
        private readonly contextFactory: RepositoryContextFactory
    ) {
    }

    async create(blackboard: Blackboard): Promise<void> {
        return await this.contextFactory.atomicExec(({ blackboardRepository }) =>
            blackboardRepository.create(blackboard)
        );
    }
}
