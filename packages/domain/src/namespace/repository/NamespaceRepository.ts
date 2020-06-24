import { Namespace } from '../model/Namespace';

export interface NamespaceRepository {

    find(blackboard: string, reference: string): Promise<Namespace>;

    findSubset(blackboard: string, reference: string, factTypes: string[]): Promise<Namespace>;
}
