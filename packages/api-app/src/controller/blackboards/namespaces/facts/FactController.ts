import { Request, RequestHandler, Response, Router } from 'express';
import { LoggerFactory } from '@varys/domain';
import { FactDTO, FactRoute, RegisterFactRequest } from '@varys/api-model';
import { Controller } from '../../../../service/Controller';
import { RepositoryContextFactory } from '../../../../service/context/RepositoryContextFactory';
import { FactService } from '../../../../service/FactService';
import { factToDTO } from '../../../../service/DtoUtils';

export class FactController implements Controller {

    private readonly factService: FactService;

    constructor(
        loggerFactory: LoggerFactory,
        contextFactory: RepositoryContextFactory
    ) {
        this.factService = new FactService(loggerFactory, contextFactory);
    }

    rootPath(): string {
        return FactRoute.relativePath;
    }

    children(): Controller[] {
        return [];
    }

    mount(router: Router): void {
        router.get('/', this.findByType.bind(this));
        router.post('/', this.createForType.bind(this));
    }

    async findByType(
        req: Request<FactRoute.Params, FactDTO, void>,
        res: Response<FactDTO | null>,
        next: RequestHandler
    ): Promise<void> {

        const { blackboard, namespace, factType } = req.params;

        const fact = await this.factService.findByType(factType, blackboard, namespace);

        if (fact) {
            res.status(200).json(factToDTO(fact));
        } else {
            res.status(404).json(null);
        }
    }

    async createForType(
        req: Request<FactRoute.Params, void, RegisterFactRequest>,
        res: Response<void>,
        next: RequestHandler
    ): Promise<void> {

        const { blackboard, namespace, factType } = req.params;

        // TODO: assert provided body attributes
        const { source, data, score, discoveryDate } = req.body;

        await this.factService.indexFact({
            blackboard,
            namespace,
            type: factType,
            source,
            data,
            score,
            discoveryDate
        });

        res.status(202).json();
    }
}
