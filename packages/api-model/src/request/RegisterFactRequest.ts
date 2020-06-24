import { FactValidation } from '../validation';
import { FactDataDTO } from '../dto';

export class RegisterFactRequest {

    @FactValidation.source()
    source!: string;

    @FactValidation.data()
    data!: FactDataDTO;

    @FactValidation.score()
    score!: number;

    @FactValidation.discoveryDate()
    discoveryDate!: Date;
}
