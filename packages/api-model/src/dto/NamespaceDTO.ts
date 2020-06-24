import { FactDTO } from './FactDTO';

export interface NamespaceDTO {
    blackboard: string;
    reference: string;
    facts: Record<string, FactDTO>;
}
