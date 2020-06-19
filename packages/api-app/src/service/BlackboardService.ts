import { RepositoryContextFactory } from './context/RepositoryContextFactory';
import { Blackboard } from '@varys/domain/lib/blackboard';

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
