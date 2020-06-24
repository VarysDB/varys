import { SubscriptionConfirmationRequest, SubscriptionRequest, SubscriptionsRootRoute } from '@varys/api-model';
import { HttpClientResponse, HttpClient } from './HttpClient';

export class SubscriptionClient {

    constructor(
        private readonly client: HttpClient
    ) {
    }

    subscribe(payload: SubscriptionRequest): Promise<HttpClientResponse<void>> {
        return this.client.post<SubscriptionsRootRoute.Params, SubscriptionRequest, void>(SubscriptionsRootRoute.absolutePath, {}, payload);
    }

    confirmSubscription(payload: SubscriptionConfirmationRequest): Promise<HttpClientResponse<void>> {
        return this.client.put<SubscriptionsRootRoute.Params, SubscriptionConfirmationRequest, void>(SubscriptionsRootRoute.absolutePath, {}, payload);
    }
}
