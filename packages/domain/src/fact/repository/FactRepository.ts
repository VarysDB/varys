import { Fact } from '../model/Fact';

export interface FactRepository {

    save(fact: Fact): Promise<boolean>;

    find(type: string, blackboard: string, namespace: string): Promise<Fact | null>;

    findAll(blackboard: string, namespace: string): Promise<Fact[]>;
}
