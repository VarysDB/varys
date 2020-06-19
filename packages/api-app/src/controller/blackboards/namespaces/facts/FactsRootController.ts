import { Request, RequestHandler, Response, Router } from 'express';
import { LoggerFactory } from '@varys/domain';
import { FactDTO, FactsRootRoute, RegisterFactBatchRequest } from '@varys/api-model';
import { Controller } from '../../../../service/Controller';
import { RepositoryContextFactory } from '../../../../service/context/RepositoryContextFactory';
import { FactService } from '../../../../service/FactService';
import { FactController } from './FactController';

export class FactsRootController implements Controller {

    private readonly factService: FactService;

    constructor(
        private readonly loggerFactory: LoggerFactory,
        private readonly contextFactory: RepositoryContextFactory
    ) {
        this.factService = new FactService(loggerFactory, contextFactory);
    }

    rootPath(): string {
        return FactsRootRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new FactController(this.loggerFactory, this.contextFactory)
        ];
    }

    mount(router: Router): void {
        router.get('/', this.findAll.bind(this));
        router.post('/', this.createMany.bind(this));
    }

    async findAll(
        req: Request<FactsRootRoute.Params, FactDTO[], void>,
        res: Response<FactDTO[]>,
        next: RequestHandler
    ): Promise<void> {

        const { blackboard, namespace } = req.params;

        const facts = await this.factService.findAll(blackboard, namespace);

        res.status(200).json(facts);
    }

    async createMany(
        req: Request<FactsRootRoute.Params, void, RegisterFactBatchRequest>,
        res: Response<void>,
        next: RequestHandler
    ): Promise<void> {

        const { blackboard, namespace } = req.params;

        // TODO: assert provided body attributes
        const { source, discoveryDate, facts } = req.body;

        await this.factService.indexFacts(facts.map(fact => ({
            blackboard,
            namespace,
            type: fact.type,
            source,
            data: fact.data,
            score: fact.score,
            discoveryDate
        })));

        res.status(202).json();
    }
}
