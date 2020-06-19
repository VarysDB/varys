import { Fact } from 'fact/model/Fact';

export interface PublishResult {
    messageId: string;
}

export interface SubscriptionAttributes {
    endpoint: string;
}

export interface PubSubAdapter {

    publish(fact: Fact): Promise<PublishResult>;

    subscribe(topic: string, attributes: SubscriptionAttributes): Promise<void>;
}
