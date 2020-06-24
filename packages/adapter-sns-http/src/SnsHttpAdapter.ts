import { Fact, Logger, LoggerFactory, PublishResult, PubSubAdapter, SubscriptionAttributes } from '@varys/domain';
import { SNS } from 'aws-sdk';

export interface SnsHttpAdapterConfig {
    topicAttributeName: string;
    factsTopicArn: string;
    factsDLQArn: string;
    awsConfig: AWSConfig;
}

export interface AWSConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
}

export class SnsHttpAdapter implements PubSubAdapter {

    private readonly $log: Logger;

    private readonly snsClient: SNS;

    constructor(
        loggerFactory: LoggerFactory,
        private readonly config: SnsHttpAdapterConfig
    ) {
        this.$log = loggerFactory.getLogger(this);

        const { region, accessKeyId, secretAccessKey, endpoint } = config.awsConfig;

        this.snsClient = new SNS({
            apiVersion: '2010-03-31',
            region,
            accessKeyId,
            secretAccessKey,
            endpoint
        });
    }

    async publish(fact: Fact): Promise<PublishResult> {

        this.$log.debug('About to publish fact', fact);

        const { MessageId, $response } = await this.snsClient.publish({
            Message: JSON.stringify(fact),
            MessageAttributes: {
                [this.config.topicAttributeName]: {
                    DataType: 'String',
                    StringValue: `${fact.blackboard}:${fact.namespace}:${fact.type}`
                }
            },
            TopicArn: this.config.factsTopicArn
        }).promise();

        this.$log.debug('Published fact and got result %o', $response.httpResponse.body.toString());

        return {
            messageId: MessageId!
        };
    }

    async subscribe(topic: string, attributes: SubscriptionAttributes): Promise<void> {

        this.$log.debug('About to subscribe to topic %s with attributes %o', topic, attributes);

        const { $response } = await this.snsClient.subscribe({
            Protocol: 'https',
            TopicArn: this.config.factsTopicArn,
            Endpoint: attributes.endpoint,
            Attributes: {
                FilterPolicy: this.filterPolicyFor(topic),
                RedrivePolicy: this.redrivePolicy()
            }
        }).promise();

        this.$log.debug('Subscribed to topic and got result %o', $response.httpResponse.body.toString());
    }

    async confirmSubscription(token: string): Promise<void> {

        this.$log.debug('About to confirm subscription with token', token);

        const { $response } = await this.snsClient.confirmSubscription({
            TopicArn: this.config.factsTopicArn,
            Token: token
        }).promise();

        this.$log.debug('Confirmed topic subscription and got result %o', $response.httpResponse.body.toString());
    }

    private filterPolicyFor(topic: string): string {
        let filter;

        if (topic.includes('*')) {
            const astIndex = topic.indexOf('*');
            filter = [{ prefix: topic.substring(0, astIndex - 1) }];
        } else {
            filter = [topic];
        }

        return JSON.stringify({
            [this.config.topicAttributeName]: filter
        });
    }

    private redrivePolicy(): string {

        return JSON.stringify({
            deadLetterTargetArn: this.config.factsDLQArn
        });
    }
}
