import * as process from 'process';
import assert from 'assert';

export class Env {

    constructor(private readonly env: Record<string, string | undefined>) {
    }

    string(key: string, defaultValue?: string): string {

        const envValue = this.env[key];
        if (envValue) {
            return envValue;
        }

        return this.defaultOrFail<string>(key, defaultValue);
    }

    boolean(key: string, defaultValue?: boolean): boolean {

        const envValue = this.env[key];

        switch (envValue) {
            case 'true':
                return true;
            case 'false':
                return false;
            case '':
            case undefined:
                return this.defaultOrFail<boolean>(key, defaultValue);
            default:
                throw new assert.AssertionError({ message: `Wrong format for boolean ${envValue}` });
        }
    }

    int(key: string, defaultValue?: number): number {

        const envValue = this.env[key];
        if (envValue) {
            const intValue = parseInt(envValue, 10);
            assert(!isNaN(intValue), `Wrong format for integer ${envValue}`);

            return intValue;
        }

        return this.defaultOrFail<number>(key, defaultValue);
    }

    float(key: string, defaultValue?: number): number {

        const envValue = this.env[key];
        if (envValue) {
            const intValue = parseFloat(envValue);
            assert(!isNaN(intValue), `Wrong format for float ${envValue}`);

            return intValue;
        }

        return this.defaultOrFail<number>(key, defaultValue);
    }

    private defaultOrFail<T>(key: string, defaultValue: T | undefined): T {

        assert(typeof defaultValue !== 'undefined', `Missing environment variable ${key}`);

        return defaultValue!;
    }
}

// eslint-disable-next-line no-process-env
export const env: Env = new Env(process.env);
