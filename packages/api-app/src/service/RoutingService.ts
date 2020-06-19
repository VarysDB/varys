import { Express, Router, RouterOptions } from 'express';
import listEndpoints, { Endpoint } from 'express-list-endpoints';
import { Controller } from './Controller';

export class RoutingService {

    constructor(
        private readonly rootController: Controller,
        private readonly params: RouterOptions
    ) {
    }

    mount(app: Express): Endpoint[] {
        this.mountController(app, this.rootController);

        return listEndpoints(app);
    }

    private mountController(parentRouter: Router, controller: Controller): void {

        const router = Router(this.params);

        controller.mount(router);

        parentRouter.use(controller.rootPath(), router);

        controller.children().forEach(controller => this.mountController(router, controller));
    }
}
