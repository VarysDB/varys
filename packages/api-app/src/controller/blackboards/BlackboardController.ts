import Router, { RouterContext } from '@koa/router';
import { CREATED } from 'http-status-codes';
import { BlackboardRoute } from '@varys/api-model';
import { Controller } from '../../service/Controller';
import { NamespacesController } from './namespaces/NamespacesController';
import { BlackboardService } from '../../service/BlackboardService';
import { validateParams } from '../../service/RequestValidator';
import { NamespaceService } from '../../service/NamespaceService';
import { FactService } from '../../service/FactService';

export class BlackboardController implements Controller {

    constructor(
        private readonly blackboardService: BlackboardService,
        private readonly namespaceService: NamespaceService,
        private readonly factService: FactService
    ) {
    }

    rootPath(): string {
        return BlackboardRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new NamespacesController(this.namespaceService, this.factService)
        ];
    }

    mount(router: Router): void {
        router.all('/', validateParams(BlackboardRoute.Params));
        router.post('/', this.create.bind(this));
    }

    async create({ request, response, params }: RouterContext) {

        const { blackboard } = params as BlackboardRoute.Params;

        await this.blackboardService.create({
            name: blackboard
        });

        response.status = CREATED;
        response.body = {};
    }
}
