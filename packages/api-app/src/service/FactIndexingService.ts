import { Fact, FactRegistrationService } from '@varys/domain';

export class FactIndexingService {

    constructor(
        private readonly factRegistrationService: FactRegistrationService
    ) {
    }

    async indexFact(fact: Fact): Promise<void> {
        // TODO: send to queue instead
        await this.factRegistrationService.registerFact(fact);
    }

    async indexFacts(facts: Fact[]): Promise<void> {
        // TODO: send to queue instead
        await this.factRegistrationService.registerFacts(facts);
    }
}
