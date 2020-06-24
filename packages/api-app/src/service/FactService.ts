import { Fact, FactIndexingService, FactRegistrationService, LoggerFactory, PubSubAdapter } from '@varys/domain';
import { RepositoryContextFactory } from './context/RepositoryContextFactory';

export class FactService {

    constructor(
        private readonly loggerFactory: LoggerFactory,
        private readonly contextFactory: RepositoryContextFactory,
        private readonly pubSubAdapter: PubSubAdapter
    ) {
    }

    async indexFact(fact: Fact): Promise<void> {
        await this.contextFactory.atomicExec(({ factRepository }) => {

            const registrationService = new FactRegistrationService(this.loggerFactory, factRepository, this.pubSubAdapter);
            const indexingService = new FactIndexingService(registrationService);

            return indexingService.indexFact(fact);
        });
    }

    async indexFacts(facts: Fact[]): Promise<void> {
        await this.contextFactory.atomicExec(({ factRepository }) => {

            const registrationService = new FactRegistrationService(this.loggerFactory, factRepository, this.pubSubAdapter);
            const indexingService = new FactIndexingService(registrationService);

            return indexingService.indexFacts(facts);
        });
    }

    async findAll(blackboard: string, namespace: string): Promise<Fact[]> {
        return await this.contextFactory.atomicExec(({ factRepository }) =>
            factRepository.findAll(blackboard, namespace)
        );
    }

    async findByType(type: string, blackboard: string, namespace: string): Promise<Fact | null> {
        return await this.contextFactory.atomicExec(({ factRepository }) =>
            factRepository.find(type, blackboard, namespace)
        );
    }
}
