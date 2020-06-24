import { Logger, LoggerContext, LoggerFactory, LogLevel } from '@varys/domain';
import debug from 'debug';
import { WinstonLogger } from './WinstonLogger';

export class WinstonLoggerFactory implements LoggerFactory {

    constructor(private readonly level: LogLevel) {
    }

    getLogger(context: LoggerContext): Logger {

        const name = this.nameFromContext(context);

        const isDebug = debug(`varys:${name}`).enabled;

        return new WinstonLogger(isDebug ? LogLevel.DEBUG : this.level, name);
    }

    private nameFromContext(context: LoggerContext): string {
        switch (typeof context) {
            case 'string':
                return context;
            case 'function':
                return context.name;
            case 'object':
                return context.constructor.name;
            default:
                return String(context);
        }
    }
}
