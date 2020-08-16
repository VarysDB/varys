import { Next } from 'koa';
import Router, { RouterContext } from '@koa/router';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import morgan from 'koa-morgan';
import { PubSubAdapter } from '@varys/domain';
import { RootRoute } from '@varys/api-model';
import { Controller } from '../service/Controller';
import { BlackboardController } from './blackboards/BlackboardController';
import { SubscriptionController } from './SubscriptionController';
import { BlackboardService } from '../service/BlackboardService';
import { NamespaceService } from '../service/NamespaceService';
import { FactService } from '../service/FactService';
import { error, ok, unauthorized } from '../service/JsonResponse';

export class RootController implements Controller {

    constructor(
        private readonly blackboardService: BlackboardService,
        private readonly namespaceService: NamespaceService,
        private readonly factService: FactService,
        private readonly pubSubAdapter: PubSubAdapter,
        private readonly apiToken: string
    ) {
    }

    rootPath(): string {
        return RootRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new BlackboardController(this.blackboardService, this.namespaceService, this.factService),
            new SubscriptionController(this.pubSubAdapter)
        ];
    }

    mount(router: Router): void {
        router.use(bodyParser());
        router.use(compress());
        router.use(morgan('dev'));

        router.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                console.error('Uncaught error:', err);

                error(ctx.response, err);

                ctx.app.emit('error', err, ctx);
            }
        });

        router.get('/ping', this.ping.bind(this));

        router.use(this.apiTokenHandler.bind(this));
    }

    async apiTokenHandler({ request, response }: RouterContext, next: Next): Promise<void> {

        const apiToken = request.header[RootRoute.apiTokenHeader];

        if (apiToken !== this.apiToken) {
            unauthorized(response);
        } else {
            await next();
        }
    }

    async ping({ request, response }: RouterContext): Promise<void> {
        ok(response, {
            ping: 'pong'
        });
    }
}
