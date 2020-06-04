import { FactDTO } from '@varys/api-model';

export interface FactBuilder<T> {
    asList(object: T, source: string, discoveryDate: Date): FactDTO[];
}
