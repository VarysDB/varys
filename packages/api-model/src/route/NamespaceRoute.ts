import { NamespaceValidation } from '../validation';
import * as BlackboardRoute from './BlackboardRoute';

export const relativePath = '/:namespace';

export const absolutePath = `${BlackboardRoute.absolutePath}${relativePath}`;

export class Params extends BlackboardRoute.Params {

    @NamespaceValidation.reference()
    namespace!: string;
}
