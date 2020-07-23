import { IncomingHttpHeaders } from 'http';

export interface MessageResult {
    result: any;
    status: number;
    error: Error | null;
}

export interface HttpListener {

    subscribe(endpoint: string): Promise<void>;

    handle(message: string, headers: IncomingHttpHeaders): Promise<MessageResult>;
}
