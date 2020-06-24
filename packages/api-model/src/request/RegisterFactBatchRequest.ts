import * as jf from 'joiful';
import { FactValidation } from '../validation';
import { FactDataDTO } from '../dto';

export class RegisterFactBatchRequest {

    @FactValidation.source()
    source!: string;

    @FactValidation.discoveryDate()
    discoveryDate!: Date;

    @jf.array().min(1).required()
    facts!: RegisterFactBatchRequestFact[];
}

class RegisterFactBatchRequestFact {

    @FactValidation.type()
    type!: string;

    @FactValidation.data()
    data!: FactDataDTO;

    @FactValidation.score()
    score!: number;
}
