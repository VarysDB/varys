import {
    ACCEPTED,
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    NO_CONTENT,
    NOT_FOUND,
    OK,
    UNAUTHORIZED
} from 'http-status-codes';
import { Response } from 'koa';

export function ok<T = any>(response: Response, data: T): void {
    send(response, OK, data);
}

export function created<T = any>(response: Response, data: T): void {
    send(response, CREATED, data);
}

export function accepted<T = any>(response: Response, data: T): void {
    send(response, ACCEPTED, data);
}

export function noContent(response: Response): void {
    send(response, NO_CONTENT, null);
}

export function badRequest(response: Response, message: string): void {
    genericError(response, BAD_REQUEST, message);
}

export function unauthorized(response: Response): void {
    genericError(response, UNAUTHORIZED, 'Unauthorized');
}

export function notFound(response: Response, message: string): void {
    genericError(response, NOT_FOUND, message);
}

export function error(response: Response, err: Error): void {
    genericError(response, INTERNAL_SERVER_ERROR, err.message);
}

export function genericError(response: Response, status: number, message: string): void {
    send(response, status, { message });
}

export function send<T>(response: Response, status: number, body: T): void {
    response.set('Content-Type', 'application/json; charset=utf-8');
    response.body = JSON.stringify(body);
    response.status = status;
}
