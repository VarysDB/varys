import { HttpListener } from './HttpListener';
import { SubscriptionClient } from '../client';
import { SnsHttpListener } from './SnsHttpListener';
import { ListenerHandler } from './ListenerHandler';

export type ListenerType = 'sns';

export class ListenerFactory {

    constructor(private readonly client: SubscriptionClient) {
    }

    forType(type: ListenerType, handler: ListenerHandler): HttpListener {
        switch (type) {
            case 'sns':
                return new SnsHttpListener(this.client, handler);
            default:
                throw new Error(`HTTP listener ${type} is not available`);
        }
    }
}
