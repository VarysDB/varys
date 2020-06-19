import { NamespaceFact } from './NamespaceFact';

export interface Namespace {
    blackboard: string;
    reference: string;
    facts: Record<string, NamespaceFact>;
}
