import { FactDataDTO } from './FactDataDTO';

export interface FactDiscoveryDTO {
    blackboard: string;
    reference: string;
    type: string;
    source: string;
    data: FactDataDTO;
    score: number;  // Score is a tiebreaker for facts within the same namespace and type
    discoveryDate: Date;
}
