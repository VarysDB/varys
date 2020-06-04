import { Fact } from '../model/Fact';
import { FactNamespace } from '../model/FactNamespace';

export interface FactRepository {

    save(fact: Fact): Promise<boolean>;

    find(type: string, namespace: FactNamespace): Promise<Fact | null>;
}
