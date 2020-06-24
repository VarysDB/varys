import { FactDataDTO, FactDTO, FactScoreDTO } from '@varys/api-model';

export class AttributeEncoder {

    constructor(
        private readonly source: string,
        private readonly discoveryDate: Date
    ) {
    }

    build(type: string, data: FactDataDTO, score: FactScoreDTO): FactDTO {
        return {
            type,
            source: this.source,
            data,
            score,
            discoveryDate: this.discoveryDate
        };
    }

    encodeDate(date: Date): FactDataDTO {
        return date.toISOString();
    }

    adminOverride(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.ADMIN_OVERRIDE);
    }

    userOverride(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.USER_OVERRIDE);
    }

    god(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.GOD);
    }

    high(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.HIGH);
    }

    medium(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.MEDIUM);
    }

    low(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.LOW);
    }

    userInitial(type: string, data: FactDataDTO): FactDTO {
        return this.build(type, data, FactScoreDTO.USER_INITIAL);
    }
}
