import { env } from './service/Env';
import debug from 'debug';
import { LogLevel } from '@varys/domain';

export const PORT = env.int('PORT', 8000);

export const LOG_LEVEL = debug('varys').enabled ? LogLevel.DEBUG : LogLevel.INFO;

export const API_TOKEN = env.string('API_TOKEN');

export const DB_CLIENT = env.string('DB_CLIENT');

export const DB_HOST = env.string('DB_HOST');

export const DB_USER = env.string('DB_USER');

export const DB_PASSWORD = env.string('DB_PASSWORD', '');

export const DB_NAME = env.string('DB_NAME');

export const DB_FACTS_SCHEMA = env.string('DB_FACTS_SCHEMA');
