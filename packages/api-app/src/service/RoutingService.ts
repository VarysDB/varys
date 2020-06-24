import Koa from 'koa';
import Router, { RouterOptions } from '@koa/router';
import { Controller } from './Controller';

export class RoutingService {

    constructor(
        private readonly rootController: Controller,
        private readonly params: RouterOptions
    ) {
    }

    mount(app: Koa): void {
        const rootRouter = this.mountController(this.rootController);

        app.use(rootRouter.routes());
    }

    private mountController(controller: Controller): Router {

        const router = new Router(this.params);

        controller.mount(router);

        controller.children().forEach(controller => {
            router.use(controller.rootPath(), this.mountController(controller).routes());
        });

        return router;
    }
}
