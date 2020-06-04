import { FactDTO } from '@varys/api-model';

export interface NamespaceMapper<T> {

    asFacts(reference: string, object: T, source: string, discoveryDate: Date): FactDTO[];

    asNamespace(reference: string, facts: FactDTO[]): T;
}
