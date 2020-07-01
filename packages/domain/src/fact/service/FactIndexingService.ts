import { FactRegistrationService } from './FactRegistrationService';
import { Fact } from '../model/Fact';

export class FactIndexingService {

    constructor(
        private readonly factRegistrationService: FactRegistrationService
    ) {
    }

    async indexFact(fact: Fact): Promise<void> {
        // TODO: publish to internal topic instead
        await this.factRegistrationService.registerFact(fact);
    }

    async indexFacts(facts: Fact[]): Promise<void> {
        // TODO: publish to internal topic instead
        await this.factRegistrationService.registerFacts(facts);
    }
}
