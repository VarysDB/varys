import { FactDataDTO } from '../dto';

export interface RegisterFactRequest {
    source: string;
    data: FactDataDTO;
    score: number;
    discoveryDate: Date;
}
