import express from 'express';
import Knex from 'knex';
import { RoutingService } from './service/RoutingService';
import { RootController } from './controller/RootController';
import { WinstonLoggerFactory } from './service/logger/WinstonLoggerFactory';
import { PgRepositoryContextFactory } from './service/context/postgres/PgRepositoryContextFactory';
import {
    API_TOKEN,
    DB_CLIENT,
    DB_FACTS_SCHEMA,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    LOG_LEVEL,
    PORT
} from './settings';

const app = express();

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

const rootController = new RootController(loggerFactory, contextFactory, API_TOKEN);

const routingService = new RoutingService(rootController, {
    caseSensitive: false,
    mergeParams: true,
    strict: false
});

const routes = routingService.mount(app)
    .flatMap(({ path, methods }) =>
        methods.map(method => `${method} ${path}`)
    )
    .join('\n');

console.info(routes);

app.listen(PORT, () => console.log(`Varys is eager to listen to your whispers at http://localhost:${PORT}`));
