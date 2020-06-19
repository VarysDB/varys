import { json, NextFunction, Request, Response, Router } from 'express';
import compression from 'compression';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import { LoggerFactory } from '@varys/domain';
import { RootRoute } from '@varys/api-model';
import { Controller } from '../service/Controller';
import { RepositoryContextFactory } from '../service/context/RepositoryContextFactory';
import { BlackboardController } from './blackboards/BlackboardController';

export class RootController implements Controller {

    constructor(
        private readonly loggerFactory: LoggerFactory,
        private readonly contextFactory: RepositoryContextFactory,
        private readonly apiToken: string
    ) {
    }

    rootPath(): string {
        return '';
    }

    children(): Controller[] {
        return [
            new BlackboardController(this.loggerFactory, this.contextFactory)
        ];
    }

    mount(router: Router): void {
        router.use(json());
        router.use(compression());
        router.use(morgan('tiny'));
        router.use(errorhandler({ log: true }));

        router.use(this.apiTokenMiddleware.bind(this));

        router.get('/ping', this.ping.bind(this));
    }

    apiTokenMiddleware(req: Request, res: Response, next: NextFunction): void {

        const apiToken = req.header(RootRoute.apiTokenHeader);

        if (apiToken !== this.apiToken) {
            res.status(401).send();
        } else {
            next();
        }
    }

    async ping(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.send('pong');
    }
}
