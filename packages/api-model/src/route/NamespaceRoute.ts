import * as BlackboardRoute from './BlackboardRoute';

export const relativePath = '/:namespace';

export const absolutePath = `${BlackboardRoute.absolutePath}/${relativePath}`;

export interface Params extends BlackboardRoute.Params {
    namespace: string;
}
