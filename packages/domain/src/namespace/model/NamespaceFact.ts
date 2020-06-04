import { FactData } from '../../common';

export interface NamespaceFact {
    source: string;
    data: FactData;
    score: number;
    discoveryDate: Date;
}
