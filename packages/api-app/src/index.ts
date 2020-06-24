import Koa from 'koa';
import Knex from 'knex';
import { SnsHttpAdapter } from '@varys/adapter-sns-http';
import { RoutingService } from './service/RoutingService';
import { RootController } from './controller/RootController';
import { WinstonLoggerFactory } from './service/logger/WinstonLoggerFactory';
import { PgRepositoryContextFactory } from './service/context/postgres/PgRepositoryContextFactory';
import {
    API_TOKEN,
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    AWS_SNS_DLQ_ARN,
    AWS_SNS_FACTS_TOPIC_ARN,
    AWS_SNS_TOPIC_ATTRIBUTE_NAME,
    DB_CLIENT,
    DB_FACTS_SCHEMA,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    LOG_LEVEL,
    PORT
} from './settings';
import { FactService } from './service/FactService';
import { NamespaceService } from './service/NamespaceService';
import { BlackboardService } from './service/BlackboardService';

const app = new Koa();

const loggerFactory = new WinstonLoggerFactory(LOG_LEVEL);

const knexLogger = loggerFactory.getLogger('knex');

const knex = Knex({
    client: DB_CLIENT,
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        charset: 'utf8'
    },
    pool: {
        min: 2,
        max: 10
    },
    asyncStackTraces: true,
    log: {
        warn(message) {
            return knexLogger.warn(message);
        },
        error(message) {
            return knexLogger.error(message);
        },
        deprecate(message) {
            return knexLogger.warn(message);
        },
        debug(message) {
            return knexLogger.debug(message);
        }
    }
});

const contextFactory = new PgRepositoryContextFactory(knex, DB_FACTS_SCHEMA);

const pubSubAdapter = new SnsHttpAdapter(loggerFactory, {
    topicAttributeName: AWS_SNS_TOPIC_ATTRIBUTE_NAME,
    factsTopicArn: AWS_SNS_FACTS_TOPIC_ARN,
    factsDLQArn: AWS_SNS_DLQ_ARN,
    awsConfig: {
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        // endpoint: 'http://localhost:4575'
    }
});

const blackboardService = new BlackboardService(contextFactory);
const namespaceService = new NamespaceService(contextFactory);
const factService = new FactService(loggerFactory, contextFactory, pubSubAdapter);

const rootController = new RootController(blackboardService, namespaceService, factService, pubSubAdapter, API_TOKEN);

const routingService = new RoutingService(rootController, {
    sensitive: false,
    strict: false
});

routingService.mount(app);

app.listen(PORT, () => console.info(`Varys is eager to listen to your whispers at http://localhost:${PORT}`));
