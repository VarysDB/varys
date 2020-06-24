import { SubscriptionValidation } from '../validation';

export class SubscriptionRequest {

    @SubscriptionValidation.topic()
    topic!: string;

    @SubscriptionValidation.endpoint()
    endpoint!: string;
}
