import * as RootRoute from './RootRoute';

export const relativePath = '/subscriptions';

export const absolutePath = `${RootRoute.absolutePath}${relativePath}`;

export class Params extends RootRoute.Params {
}
