import { KnexEntity } from '../knex/KnexEntity';

export interface FactEntity extends KnexEntity {
    id: string;
    fingerprint: string;
    reference: string;
    type: string;
    source: string;
    data: any;
    score: number;
    discovery_date: Date;
}
