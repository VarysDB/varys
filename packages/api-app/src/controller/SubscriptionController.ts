import Router, { RouterContext } from '@koa/router';
import { PubSubAdapter } from '@varys/domain';
import { SubscriptionConfirmationRequest, SubscriptionRequest, SubscriptionsRootRoute } from '@varys/api-model';
import { Controller } from '../service/Controller';
import { validateBody } from '../service/RequestValidator';
import { accepted, created } from '../service/JsonResponse';

export class SubscriptionController implements Controller {

    constructor(
        private readonly pubSubAdapter: PubSubAdapter
    ) {
    }

    rootPath(): string {
        return SubscriptionsRootRoute.relativePath;
    }

    children(): Controller[] {
        return [];
    }

    mount(router: Router): void {
        router.post('/', validateBody(SubscriptionRequest), this.subscribe.bind(this));
        router.put('/', validateBody(SubscriptionConfirmationRequest), this.confirmSubscription.bind(this));
    }

    async subscribe({ request, response }: RouterContext): Promise<void> {

        const { topic, endpoint } = request.body as SubscriptionRequest;

        await this.pubSubAdapter.subscribe(topic, { endpoint });

        accepted<null>(response, null);
    }

    async confirmSubscription({ request, response }: RouterContext): Promise<void> {

        const { token } = request.body as SubscriptionConfirmationRequest;

        await this.pubSubAdapter.confirmSubscription(token);

        created<null>(response, null);
    }
}
