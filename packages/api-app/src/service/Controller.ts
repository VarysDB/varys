import Router from '@koa/router';

export interface Controller {

    rootPath(): string;

    children(): Controller[];

    mount(router: Router): void;
}
