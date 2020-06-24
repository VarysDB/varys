import { FactDTO, NamespaceDTO } from '@varys/api-model';

export interface EntityMapper<T> {

    asFacts(reference: string, entity: T, source: string, discoveryDate: Date): FactDTO[];

    fromNamespace(namespace: NamespaceDTO): T;
}
