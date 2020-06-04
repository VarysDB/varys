import { Fact } from '../../fact/model/Fact';

/**
 * @deprecated must be implemented again (@bruno dá o show aqui)
 */
export interface FactTrigger {

    readonly namespace: string;

    readonly type: string;

    run(fact: Fact): Promise<void>;
}
