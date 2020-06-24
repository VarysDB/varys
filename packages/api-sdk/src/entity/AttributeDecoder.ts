import { FactDataDTO, NamespaceDTO } from '@varys/api-model';

export class AttributeDecoder {

    constructor(private readonly namespace: NamespaceDTO) {
    }

    reference(): string {
        return this.namespace.reference;
    }

    get(type: string, defaultValue?: FactDataDTO): FactDataDTO {

        const fact = this.namespace.facts[type];
        if (!fact) {
            if (defaultValue === undefined) {
                // TODO: throw specific error
                throw new Error(`Could not find fact with type ${type} and no default value was provided`);
            }

            return defaultValue;
        }

        return fact.data;
    }

    asType<T extends FactDataDTO>(data: FactDataDTO, expectedType: string): T {

        const typeCheck = (value: FactDataDTO): value is T => typeof value === expectedType;

        if (typeCheck(data)) {
            return data;
        }

        throw new Error(`Expected type ${expectedType} for ${data} but got ${typeof data} instead`);
    }

    asNullableType<T extends FactDataDTO>(data: FactDataDTO, expectedType: string): T | null {

        if (data === null) {
            return data;
        }

        return this.asType<T>(data, expectedType);
    }

    string(type: string, defaultValue?: string): string {
        const data = this.get(type, defaultValue);

        return this.asType<string>(data, typeof '');
    }

    stringOrNull(type: string, defaultValue?: string): string | null {
        const data = this.get(type, defaultValue);

        return this.asNullableType<string>(data, typeof '');
    }

    number(type: string, defaultValue?: number): number {
        const data = this.get(type, defaultValue);

        return this.asType<number>(data, typeof 0);
    }

    numberOrNull(type: string, defaultValue?: number): number | null {
        const data = this.get(type, defaultValue);

        return this.asNullableType<number>(data, typeof 0);
    }

    boolean(type: string, defaultValue?: boolean): boolean {
        const data = this.get(type, defaultValue);

        return this.asType<boolean>(data, typeof false);
    }

    booleanOrNull(type: string, defaultValue?: boolean): boolean | null {
        const data = this.get(type, defaultValue);

        return this.asNullableType<boolean>(data, typeof false);
    }

    object(type: string, defaultValue?: object): object {
        const data = this.get(type, defaultValue);

        return this.asType<object>(data, typeof {});
    }

    objectOrNull(type: string, defaultValue?: object | null): object | null {
        const data = this.get(type, defaultValue);

        return this.asNullableType<object>(data, typeof {});
    }

    date(type: string, defaultValue?: string): Date {

        const data = this.get(type, defaultValue);
        if (typeof data !== 'string' && typeof data !== 'number') {
            throw new Error(`Cannot convert data ${data} to Date`);
        }

        const date = new Date(data);

        if (isNaN(date.getTime())) {
            throw new Error(`Got 'invalid date' when trying to convert ${data} to Date`);
        }

        return date;
    }

    dateOrNull(type: string, defaultValue?: string): Date | null {

        const data = this.get(type, defaultValue);
        if (data === null) {
            return null;
        }

        return this.date(type, defaultValue);
    }
}
