import * as NamespaceRoute from './NamespaceRoute';

export const relativePath = '/facts';

export const absolutePath = `${NamespaceRoute.absolutePath}${relativePath}`;

export class Params extends NamespaceRoute.Params {
}
