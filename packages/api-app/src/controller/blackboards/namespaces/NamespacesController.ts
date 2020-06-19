import { Request, RequestHandler, Response, Router } from 'express';
import { NamespaceDTO, NamespaceRoute } from '@varys/api-model';
import { LoggerFactory } from '@varys/domain';
import { Controller } from '../../../service/Controller';
import { RepositoryContextFactory } from '../../../service/context/RepositoryContextFactory';
import { NamespaceService } from '../../../service/NamespaceService';
import { namespaceToDTO } from '../../../service/DtoUtils';
import { FactsRootController } from './facts/FactsRootController';

export class NamespacesController implements Controller {

    private readonly namespaceService: NamespaceService;

    constructor(
        private readonly loggerFactory: LoggerFactory,
        private readonly contextFactory: RepositoryContextFactory
    ) {
        this.namespaceService = new NamespaceService(contextFactory);
    }

    rootPath(): string {
        return NamespaceRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new FactsRootController(this.loggerFactory, this.contextFactory)
        ];
    }

    mount(router: Router): void {
        router.get('/', this.find.bind(this));
    }

    async find(
        req: Request<NamespaceRoute.Params, NamespaceDTO, void>,
        res: Response<NamespaceDTO>,
        next: RequestHandler
    ) {

        const { blackboard, namespace: reference } = req.params;

        const namespace = await this.namespaceService.findByReference(reference, blackboard);

        res.status(200).json(namespaceToDTO(namespace));
    }
}
