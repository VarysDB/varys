import { NamespaceFact } from './NamespaceFact';

export interface Namespace {
    type: string;
    reference: string;
    facts: Record<string, NamespaceFact>;
}
