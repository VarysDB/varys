import { Router } from 'express';

export interface Controller {

    rootPath(): string;

    children(): Controller[];

    mount(router: Router): void;
}
