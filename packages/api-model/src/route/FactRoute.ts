import * as FactsRootRoute from './FactsRootRoute';

export const relativePath = '/:type';

export const absolutePath = `${FactsRootRoute.absolutePath}/${relativePath}`;

export interface Params extends FactsRootRoute.Params {
    type: string;
}
