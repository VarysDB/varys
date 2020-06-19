import * as RootRoute from './RootRoute';

export const relativePath = '/blackboards/:blackboard';

export const absolutePath = `${RootRoute.absolutePath}/${relativePath}`;

export interface Params extends RootRoute.Params {
    blackboard: string;
}
