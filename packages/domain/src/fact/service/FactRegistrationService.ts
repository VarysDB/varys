import { Logger, LoggerFactory } from '../../common';
import { Fact } from '../model/Fact';
import { FactRepository } from '../repository/FactRepository';

export class FactRegistrationService {

    private readonly $log: Logger;

    constructor(
        loggerFactory: LoggerFactory,
        private readonly factRepository: FactRepository
    ) {
        this.$log = loggerFactory.getLogger(this);
    }

    async registerFact(fact: Fact): Promise<boolean> {

        this.$log.debug('About to register discovery of fact', fact);

        const isNewFact = await this.factRepository.save(fact);

        if (!isNewFact) {
            return false;
        }

        this.$log.info('About to run triggers for new fact', fact);

        // TODO: trigger listeners from an outer layer
        // const triggers = this.triggerFactory.getTriggers(fact.namespace.type, fact.type);
        //
        // for (const trigger of triggers) {
        //     await trigger.run(fact);
        // }

        return true;
    }

    async registerFacts(facts: Fact[]): Promise<boolean[]> {

        const results = [];

        for (const fact of facts) {
            results.push(await this.registerFact(fact));
        }

        return results;
    }
}
