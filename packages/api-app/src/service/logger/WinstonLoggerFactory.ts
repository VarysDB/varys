import { Logger, LoggerContext, LoggerFactory, LogLevel } from '@varys/domain';
import { WinstonLogger } from './WinstonLogger';

export class WinstonLoggerFactory implements LoggerFactory {

    constructor(private readonly level: LogLevel) {
    }

    getLogger(context: LoggerContext): Logger {
        return new WinstonLogger(this.level, this.nameFromContext(context));
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
