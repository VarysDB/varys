import { FactData } from 'common/model/FactData';

export interface Fact {
    blackboard: string;
    namespace: string;
    type: string;
    source: string;
    data: FactData;
    score: number;  // Score is a tiebreaker for facts within the same namespace and type
    discoveryDate: Date;
}

/**
 * 1. Fact(namespace, type, detective) is unique
 * 2. Current fact: fact where with the greatest (score, discoveryDate) among all facts within (namespace, type)
 * 3. Whenever a new fact is discovered all fact triggers within the same (namespace, type) are activated
 */
