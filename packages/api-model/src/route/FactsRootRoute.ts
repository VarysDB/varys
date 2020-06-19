import * as NamespaceRoute from './NamespaceRoute';

export const relativePath = '/facts';

export const absolutePath = `${NamespaceRoute.absolutePath}/${relativePath}`;

export interface Params extends NamespaceRoute.Params {
}
