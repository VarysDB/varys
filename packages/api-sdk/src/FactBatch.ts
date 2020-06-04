import { FactDTO, FactScoreDTO } from '@varys/api-model';
import { FactDataDTO } from '@varys/api-model/lib';

export class FactBatch {

    readonly facts: FactDTO[] = [];

    constructor(
        private readonly source: string,
        private readonly discoveryDate: Date
    ) {
    }

    add(type: string, data: FactDataDTO, score: FactScoreDTO): FactBatch {
        this.facts.push({
            type,
            source: this.source,
            data,
            score,
            discoveryDate: this.discoveryDate
        });

        return this;
    }

    adminOverride(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.ADMIN_OVERRIDE);
    }

    userOverride(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.USER_OVERRIDE);
    }

    god(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.GOD);
    }

    high(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.HIGH);
    }

    medium(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.MEDIUM);
    }

    low(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.LOW);
    }

    userInitial(type: string, data: FactDataDTO): FactBatch {
        return this.add(type, data, FactScoreDTO.USER_INITIAL);
    }
}
