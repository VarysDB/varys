import { ListenerHandler } from './ListenerHandler';
import { ListenerFactory, ListenerType } from './ListenerFactory';
import { HttpListener } from './HttpListener';

export interface SubscriptionParams {
    blackboard: string;
    endpoint: string;
    handler: ListenerHandler;
}

export class SubscriptionBuilder {

    constructor(
        private readonly type: ListenerType,
        private readonly factory: ListenerFactory
    ) {
    }

    toAll(params: SubscriptionParams): Promise<HttpListener> {
        return this.build('*', params);
    }

    toFact(factType: string, params: SubscriptionParams): Promise<HttpListener> {
        return this.build(`*:${factType}`, params);
    }

    toReference(reference: string, params: SubscriptionParams): Promise<HttpListener> {
        return this.build(`${reference}:*`, params);
    }

    toReferenceAndType(reference: string, type: string, params: SubscriptionParams): Promise<HttpListener> {
        return this.build(`${reference}:${type}`, params);
    }

    private async build(subtopic: string, { blackboard, endpoint, handler }: SubscriptionParams): Promise<HttpListener> {

        return this.factory.forType(this.type, `${blackboard}:${subtopic}`, handler);
    }
}
