import fetch from 'node-fetch';
import assert from 'assert';
import { RootRoute } from '@varys/api-model';

export interface HttpClientConfig {
    apiUrl: string;
    apiToken: string;
}

export interface HttpClientResponse<T> {
    data: T | null;
    error: boolean;
    status: number;
    // TODO: error message
}

export class HttpClient {

    private readonly apiUrl: string;

    private readonly apiToken: string;

    constructor({ apiUrl, apiToken }: HttpClientConfig) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
    }

    async request<P extends Record<string, string>, B, R>(method: string, path: string, params: P, body?: B): Promise<HttpClientResponse<R>> {

        const interpolatedPath = path.replace(/:\w+/g, match => {
            const key = match.substr(1);
            assert(params[key], `Missing parameter ${key}`);

            return params[key];
        });

        const response = await fetch(`${this.apiUrl}${interpolatedPath}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                [RootRoute.apiTokenHeader]: this.apiToken
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (response.status >= 200 && response.status <= 299) {
            return {
                data: await response.json() as R,
                error: false,
                status: response.status
            };
        }

        return {
            data: null,
            error: true,
            status: response.status
        };
    }

    async get<P extends Record<string, string>, R>(path: string, params: P): Promise<HttpClientResponse<R>> {
        return this.request<P, {}, R>('GET', path, params);
    }

    async post<P extends Record<string, string>, B, R>(path: string, params: P, body: B): Promise<HttpClientResponse<R>> {
        return this.request<P, B, R>('POST', path, params, body);
    }

    async put<P extends Record<string, string>, B, R>(path: string, params: P, body: B): Promise<HttpClientResponse<R>> {
        return this.request<P, B, R>('PUT', path, params, body);
    }
}
