import Router, { RouterContext } from '@koa/router';
import { ACCEPTED, OK } from 'http-status-codes';
import { FactsRootRoute, RegisterFactBatchRequest } from '@varys/api-model';
import { Controller } from '../../../../service/Controller';
import { FactService } from '../../../../service/FactService';
import { FactController } from './FactController';
import { factToDTO } from '../../../../service/DtoUtils';
import { validateBody, validateParams } from '../../../../service/RequestValidator';

export class FactsRootController implements Controller {

    constructor(
        private readonly factService: FactService
    ) {
    }

    rootPath(): string {
        return FactsRootRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new FactController(this.factService)
        ];
    }

    mount(router: Router): void {
        router.all('/', validateParams(FactsRootRoute.Params));
        router.get('/', this.findAll.bind(this));
        router.post('/', validateBody(RegisterFactBatchRequest), this.createMany.bind(this));
    }

    async findAll({ request, response, params }: RouterContext): Promise<void> {

        const { blackboard, namespace } = params as FactsRootRoute.Params;

        const facts = await this.factService.findAll(blackboard, namespace);

        response.status = OK;
        response.body = facts.map(factToDTO);
    }

    async createMany({ request, response, params }: RouterContext): Promise<void> {

        const { blackboard, namespace } = params as FactsRootRoute.Params;

        const { source, discoveryDate, facts } = request.body as RegisterFactBatchRequest;

        await this.factService.indexFacts(facts.map(fact => ({
            blackboard,
            namespace,
            type: fact.type,
            source,
            data: fact.data,
            score: fact.score,
            discoveryDate
        })));

        response.status = ACCEPTED;
        response.body = {};
    }
}
