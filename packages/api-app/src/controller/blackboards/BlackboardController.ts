import { Request, RequestHandler, Response, Router } from 'express';
import { BlackboardDTO, BlackboardRoute } from '@varys/api-model';
import { LoggerFactory } from '@varys/domain';
import { Controller } from '../../service/Controller';
import { RepositoryContextFactory } from '../../service/context/RepositoryContextFactory';
import { NamespacesController } from './namespaces/NamespacesController';
import { BlackboardService } from '../../service/BlackboardService';

export class BlackboardController implements Controller {

    private readonly blackboardService: BlackboardService;

    constructor(
        private readonly loggerFactory: LoggerFactory,
        private readonly contextFactory: RepositoryContextFactory
    ) {
        this.blackboardService = new BlackboardService(contextFactory);
    }

    rootPath(): string {
        return BlackboardRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new NamespacesController(this.loggerFactory, this.contextFactory)
        ];
    }

    mount(router: Router): void {
        router.post('/', this.create.bind(this));
    }

    async create(
        req: Request<BlackboardRoute.Params, BlackboardDTO, void>,
        res: Response<BlackboardDTO>,
        next: RequestHandler
    ) {
        const { blackboard } = req.params;

        await this.blackboardService.create({
            name: blackboard
        });

        res.status(201).json();
    }
}
