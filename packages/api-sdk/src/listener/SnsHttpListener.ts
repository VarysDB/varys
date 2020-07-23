import { HttpListener, MessageResult } from './HttpListener';
import { SubscriptionClient } from '../client/SubscriptionClient';
import { IncomingHttpHeaders } from 'http';
import { ListenerHandler } from './ListenerHandler';

export interface SnsSubscriptionConfirmation {
    Type: 'SubscriptionConfirmation';
    MessageId: string;
    Token: string;
    TopicArn: string;
    Message: string;
    SubscribeURL: string;
    Timestamp: Date;
    SignatureVersion: string;
    Signature: string;
    SigningCertURL: string;
}

export interface SnsNotification {
    Type: 'Notification';
    MessageId: string;
    TopicArn: string;
    Subject: string;
    Message: string;
    Timestamp: Date;
    SignatureVersion: string;
    Signature: string;
    SigningCertURL: string;
    UnsubscribeURL: string;
}

export type SnsHttpMessage = SnsSubscriptionConfirmation | SnsNotification;

const SNS_HEADER = 'x-amz-sns-message-type';

export class SnsHttpListener implements HttpListener {

    constructor(
        private readonly client: SubscriptionClient,
        private readonly topic: string,
        private readonly handleFact: ListenerHandler
    ) {
    }

    async subscribe(endpoint: string): Promise<void> {
        await this.client.subscribe({
            topic: this.topic,
            endpoint
        });
    }

    async handle(rawMessage: string, headers: IncomingHttpHeaders): Promise<MessageResult> {

        if (!headers[SNS_HEADER]) {
            throw new Error(`Invalid SNS message: could not find header ${SNS_HEADER}`);
        }

        // AWS is a joke: https://forums.aws.amazon.com/thread.jspa?threadID=69413&start=0&tstart=0
        const message: SnsHttpMessage = JSON.parse(rawMessage);

        switch (message.Type) {
            case 'SubscriptionConfirmation':
                return await this.handleConfirmation(message);
            case 'Notification':
                return await this.handleNotification(message);
            default:
                return {
                    result: null,
                    status: 400,
                    error: new Error(`Cannot handle message ${JSON.stringify(message)}`)
                };
        }
    }

    private async handleConfirmation({ Token }: SnsSubscriptionConfirmation): Promise<MessageResult> {

        await this.client.confirmSubscription({
            token: Token
        });

        return {
            result: null,
            status: 200,
            error: null
        };
    }

    private async handleNotification({ Message }: SnsNotification): Promise<MessageResult> {
        try {
            const fact = JSON.parse(Message);

            await this.handleFact(fact);

            return {
                result: null,
                status: 200,
                error: null
            };
        } catch (err) {
            return {
                result: null,
                status: 500,
                error: err
            };
        }
    }
}
