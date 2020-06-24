import { FactValidation } from '../validation';
import * as FactsRootRoute from './FactsRootRoute';

export const relativePath = '/:type';

export const absolutePath = `${FactsRootRoute.absolutePath}${relativePath}`;

export class Params extends FactsRootRoute.Params {

    @FactValidation.type()
    type!: string;
}
