import { FactDTO } from './FactDTO';

export interface NamespaceDTO {
    type: string;
    reference: string;
    facts: Record<string, FactDTO>;
}
