import Router, { RouterContext } from '@koa/router';
import { ACCEPTED, NOT_FOUND, OK } from 'http-status-codes';
import { FactRoute, RegisterFactRequest } from '@varys/api-model';
import { Controller } from '../../../../service/Controller';
import { FactService } from '../../../../service/FactService';
import { factToDTO } from '../../../../service/DtoUtils';
import { validateBody, validateParams } from '../../../../service/RequestValidator';

export class FactController implements Controller {

    constructor(
        private readonly factService: FactService
    ) {
    }

    rootPath(): string {
        return FactRoute.relativePath;
    }

    children(): Controller[] {
        return [];
    }

    mount(router: Router): void {
        router.all('/', validateParams(FactRoute.Params));
        router.get('/', this.findByType.bind(this));
        router.post('/', validateBody(RegisterFactRequest), this.createForType.bind(this));
    }

    async findByType({ request, response, params }: RouterContext): Promise<void> {

        const { blackboard, namespace, factType } = params as FactRoute.Params;

        const fact = await this.factService.findByType(factType, blackboard, namespace);

        if (fact) {
            response.status = OK;
            response.body = factToDTO(fact);
        } else {
            response.status = NOT_FOUND;
            response.body = {};
        }
    }

    async createForType({ request, response, params }: RouterContext): Promise<void> {

        const { blackboard, namespace, factType } = params as FactRoute.Params;

        const { source, data, score, discoveryDate } = request.body as RegisterFactRequest;

        await this.factService.indexFact({
            blackboard,
            namespace,
            type: factType,
            source,
            data,
            score,
            discoveryDate
        });

        response.status = ACCEPTED;
        response.body = {};
    }
}
