import { BlackboardValidation } from '../validation';
import * as RootRoute from './RootRoute';

export const relativePath = '/blackboards/:blackboard';

export const absolutePath = `${RootRoute.absolutePath}${relativePath}`;

export class Params extends RootRoute.Params {

    @BlackboardValidation.name()
    blackboard!: string;
}
