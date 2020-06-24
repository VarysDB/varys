import { Logger, LoggerFactory } from '../../common';
import { Fact } from '../model/Fact';
import { FactRepository } from '../repository/FactRepository';
import { PubSubAdapter } from '../pubsub/PubSubAdapter';

export class FactRegistrationService {

    private readonly $log: Logger;

    constructor(
        loggerFactory: LoggerFactory,
        private readonly factRepository: FactRepository,
        private readonly pubSubAdapter: PubSubAdapter
    ) {
        this.$log = loggerFactory.getLogger(this);
    }

    // TODO: validate input
    async registerFact(fact: Fact): Promise<boolean> {

        this.$log.debug('About to register discovery of fact %o', fact);

        const isNewFact = await this.factRepository.save(fact);

        if (!isNewFact) {
            this.$log.debug('Fact already exists: %o', fact);

            return false;
        }

        this.$log.info('About to notify listeners about new fact %o', fact);

        await this.pubSubAdapter.publish(fact);

        return true;
    }

    async registerFacts(facts: Fact[]): Promise<boolean[]> {

        // TODO: batch create facts
        const results = [];

        for (const fact of facts) {
            results.push(await this.registerFact(fact));
        }

        return results;
    }
}
