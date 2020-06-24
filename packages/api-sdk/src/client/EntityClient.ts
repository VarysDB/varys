import { EntityMapper } from '../entity/EntityMapper';
import { BlackboardClient } from './BlackboardClient';

export class EntityClient<T> {

    constructor(
        private readonly client: BlackboardClient,
        private readonly mapper: EntityMapper<T>
    ) {
    }

    async find(reference: string): Promise<T | null> {

        const response = await this.client.findNamespace(reference);
        if (response.error) {
            // TODO: throw specific error
            throw new Error(`Got error when trying to find namespace ${reference}: HTTP status ${response.status}`);
        }

        return this.mapper.fromNamespace(response.data!);
    }

    async save(reference: string, entity: T, source: string, discoveryDate: Date = new Date()): Promise<void> {

        const facts = this.mapper.asFacts(reference, entity, source, discoveryDate);

        const response = await this.client.registerFactsBatch(reference, {
            source,
            discoveryDate,
            facts: facts.map(fact => ({
                type: fact.type,
                data: fact.data,
                score: fact.score
            }))
        });

        if (response.error) {
            // TODO: throw specific error
            throw new Error(`Got error when trying to save namespace ${reference}: HTTP status ${response.status}`);
        }
    }
}
