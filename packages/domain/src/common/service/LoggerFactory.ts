import { Logger } from './Logger';

export type LoggerContext = string | Function | Object;

export interface LoggerFactory {
    getLogger(context: LoggerContext): Logger;
}
