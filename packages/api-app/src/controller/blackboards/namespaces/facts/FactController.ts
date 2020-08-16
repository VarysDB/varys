import Router, { RouterContext } from '@koa/router';
import { FactDTO, FactRoute, RegisterFactRequest } from '@varys/api-model';
import { Controller } from '../../../../service/Controller';
import { FactService } from '../../../../service/FactService';
import { factToDTO } from '../../../../service/DtoUtils';
import { validateBody, validateParams } from '../../../../service/RequestValidator';
import { accepted, notFound, ok } from '../../../../service/JsonResponse';
import { Fact } from '@varys/domain';

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
            ok<FactDTO>(response, factToDTO(fact));
        } else {
            notFound(response, `Could not find fact using params ${JSON.stringify(params)}`);
        }
    }

    async createForType({ request, response, params }: RouterContext): Promise<void> {

        const { blackboard, namespace, factType } = params as FactRoute.Params;

        const { source, data, score, discoveryDate } = request.body as RegisterFactRequest;

        const fact: Fact = {
            blackboard,
            namespace,
            type: factType,
            source,
            data,
            score,
            discoveryDate
        };

        await this.factService.indexFact(fact);

        accepted<FactDTO>(response, factToDTO(fact));
    }
}
