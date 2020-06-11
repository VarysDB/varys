import * as domain from '@varys/domain';
import { SnsHttpAdapter } from '@varys/adapter-sns-http';

async function run() {
    const snsHttpAdapter = new SnsHttpAdapter({
        factsTopicArn: "some arn",
        factsDLQArn: "other arn",
        awsConfig: {
            region: 'us-east-1',
            accessKeyId: 'AKIASIQNCKY2HFTKP6Y6',
            secretAccessKey: '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'
        }
    });
    console.log(snsHttpAdapter);
}

run();

console.log(domain);
