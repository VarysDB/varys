import { BlackboardClient, EntityClient, HttpClient, SubscriptionClient } from './client';
import { EntityMapper } from './entity';
import { ListenerFactory, ListenerType, SubscriptionBuilder } from './listener';

export interface Settings {
    apiUrl: string;
    apiToken: string;
    listenerType: ListenerType;
}

export class Sdk {

    private readonly client: HttpClient;

    private readonly subscriptionBuilder: SubscriptionBuilder;

    constructor(settings: Settings) {

        this.client = new HttpClient({
            apiUrl: settings.apiUrl,
            apiToken: settings.apiToken
        });

        this.subscriptionBuilder = new SubscriptionBuilder(
            settings.listenerType,
            new ListenerFactory(
                new SubscriptionClient(this.client)
            )
        );
    }

    blackboard(name: string): BlackboardClient {
        return new BlackboardClient(name, this.client);
    }

    entity<T>(blackboard: string, mapper: EntityMapper<T>): EntityClient<T> {
        return new EntityClient<T>(this.blackboard(blackboard), mapper);
    }

    listener(): SubscriptionBuilder {
        return this.subscriptionBuilder;
    }
}
