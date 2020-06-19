import { Namespace } from '../model/Namespace';

export interface NamespaceRepository {

    find(type: string, reference: string): Promise<Namespace>;

    findSubset(type: string, reference: string, factTypes: string[]): Promise<Namespace>;
}
