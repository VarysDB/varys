import Router, { RouterContext } from '@koa/router';
import { FactDTO, FactsRootRoute, RegisterFactBatchRequest } from '@varys/api-model';
import { Controller } from '../../../../service/Controller';
import { FactService } from '../../../../service/FactService';
import { FactController } from './FactController';
import { factToDTO } from '../../../../service/DtoUtils';
import { validateBody, validateParams } from '../../../../service/RequestValidator';
import { accepted, ok } from '../../../../service/JsonResponse';
import { Fact } from '@varys/domain';

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

        ok<FactDTO[]>(response, facts.map(factToDTO));
    }

    async createMany({ request, response, params }: RouterContext): Promise<void> {

        const { blackboard, namespace } = params as FactsRootRoute.Params;

        const { source, discoveryDate, facts } = request.body as RegisterFactBatchRequest;

        const indexedFacts: Fact[] = facts.map(fact => ({
            blackboard,
            namespace,
            type: fact.type,
            source,
            data: fact.data,
            score: fact.score,
            discoveryDate
        }));

        await this.factService.indexFacts(indexedFacts);

        accepted<FactDTO[]>(response, indexedFacts);
    }
}
