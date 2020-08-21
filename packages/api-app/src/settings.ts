import { $enum } from 'ts-enum-util';
import { LogLevel } from '@varys/domain';
import { SnsHttpAdapterProtocol } from '@varys/adapter-sns-http';
import { env } from './service/Env';

export const PORT = env.int('PORT', 8000);

export const LOG_LEVEL = $enum(LogLevel).getValueOrThrow(env.string('LOG_LEVEL', 'INFO'));

export const API_TOKEN = env.string('API_TOKEN');

export const DB_CLIENT = env.string('DB_CLIENT');

export const DB_HOST = env.string('DB_HOST');

export const DB_USER = env.string('DB_USER');

export const DB_PASSWORD = env.string('DB_PASSWORD', '');

export const DB_NAME = env.string('DB_NAME');

export const DB_FACTS_SCHEMA = env.string('DB_FACTS_SCHEMA');

export const AWS_ACCESS_KEY_ID = env.string('AWS_ACCESS_KEY_ID');

export const AWS_SECRET_ACCESS_KEY = env.string('AWS_SECRET_ACCESS_KEY');

export const AWS_REGION = env.string('AWS_REGION');

export const AWS_SNS_FACTS_TOPIC_ARN = env.string('AWS_SNS_FACTS_TOPIC_ARN');

export const AWS_SNS_DLQ_ARN = env.string('AWS_SNS_DLQ_ARN');

export const AWS_SNS_TOPIC_ATTRIBUTE_NAME = env.string('AWS_SNS_TOPIC_ATTRIBUTE_NAME');

export const AWS_SNS_ENDPOINT = env.string('AWS_SNS_ENDPOINT', '');

export const AWS_SNS_SUBSCRIPTION_PROTOCOL: SnsHttpAdapterProtocol = $enum(SnsHttpAdapterProtocol).getValueOrThrow(env.string('AWS_SNS_SUBSCRIPTION_PROTOCOL', 'HTTPS').toUpperCase());
