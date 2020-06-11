import { PubSubAdapter, Fact, PublishResult, SubscriptionAttributes } from '@varys/domain';
import { SNS } from 'aws-sdk';

const TOPIC_ATTRIBUTE_NAME = 'VARYS_TOPIC';

export interface SnsHttpAdapterConfig {
    factsTopicArn: string;
    factsDLQArn: string;
    awsConfig: AWSConfig;
}

export interface AWSConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}

export class SnsHttpAdapter implements PubSubAdapter {
    private readonly snsClient: SNS;
    constructor(
        private readonly config: SnsHttpAdapterConfig
    ) {
        this.snsClient = new SNS(config.awsConfig);
    }

    async publish(fact: Fact): Promise<PublishResult> {
        const result = await this.snsClient.publish({
            Message: JSON.stringify(fact),
            MessageAttributes: {
                [TOPIC_ATTRIBUTE_NAME]: {
                    DataType: 'String',
                    StringValue: `${fact.factNamespace.type}:${fact.factNamespace.reference}:${fact.type}`
                }
            },
            TopicArn: this.config.factsTopicArn
        }).promise();
        return {
            messageId: result.MessageId!
        };
    }

    async subscribe(topic: string, subscriptionAttributes: SubscriptionAttributes): Promise<void> {
        await this.snsClient.subscribe({
            Protocol: 'http',
            TopicArn: this.config.factsTopicArn,
            Endpoint: subscriptionAttributes.endpoint,
            Attributes: {
                FilterPolicy: this.filterPolicyFor(topic),
                RedrivePolicy: this.redrivePolicy()
            }
        }).promise();
    }

    private filterPolicyFor(topic: string): string {
        let filter;
        if (topic.includes('*')) {
            const astIndex = topic.indexOf('*');
            filter = [{ prefix: topic.substring(0, astIndex-1)}]
        } else {
            filter = [topic];
        }
        return JSON.stringify({
            [TOPIC_ATTRIBUTE_NAME]: filter
        })
    }

    private redrivePolicy(): string {
        return JSON.stringify({
            deadLetterTargetArn: this.config.factsDLQArn
        })
    }
}
