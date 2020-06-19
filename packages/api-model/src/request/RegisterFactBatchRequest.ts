import { FactDataDTO } from '../dto';

export interface RegisterFactBatchRequest {
    source: string;
    discoveryDate: Date;
    facts: {
        type: string;
        data: FactDataDTO;
        score: number;
    }[];
}
