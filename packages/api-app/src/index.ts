import * as domain from '@varys/domain';
import { SnsHttpAdapter } from '@varys/adapter-sns-http';

async function run() {
    const snsHttpAdapter = new SnsHttpAdapter({
        factsTopicArn: "some arn",
        factsDLQArn: "other arn",
        awsConfig: {
            region: 'us-east-1',
            accessKeyId: 'AWS_ACCESS_KEY',
            secretAccessKey: 'AWS_SECRET_ACCESS_KEY'
        }
    });
    console.log(snsHttpAdapter);
}

run();

console.log(domain);
