import { SubscriptionConfirmationRequest, SubscriptionRequest, SubscriptionsRootRoute } from '@varys/api-model';
import { HttpClientResponse, HttpClient } from './HttpClient';

export class SubscriptionClient {

    constructor(
        private readonly client: HttpClient
    ) {
    }

    subscribe(payload: SubscriptionRequest): Promise<HttpClientResponse<null>> {
        return this.client.post<SubscriptionsRootRoute.Params, SubscriptionRequest, null>(SubscriptionsRootRoute.absolutePath, {}, payload);
    }

    confirmSubscription(payload: SubscriptionConfirmationRequest): Promise<HttpClientResponse<null>> {
        return this.client.put<SubscriptionsRootRoute.Params, SubscriptionConfirmationRequest, null>(SubscriptionsRootRoute.absolutePath, {}, payload);
    }
}
