import { Logger, LogLevel } from '@varys/domain';
import winston from 'winston';

export class WinstonLogger implements Logger {

    private readonly logger: winston.Logger;

    constructor(
        readonly level: LogLevel,
        readonly name: string
    ) {
        this.logger = winston.createLogger({
            level: this.winstonLevel(),
            silent: this.level === LogLevel.OFF,
            transports: [new winston.transports.Console()]
        });
    }

    private winstonLevel(): string {
        switch (this.level) {
            case LogLevel.TRACE:
                return 'silly';
            case LogLevel.DEBUG:
                return 'debug';
            case LogLevel.INFO:
                return 'info';
            case LogLevel.WARN:
                return 'warn';
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                return 'error';
            case LogLevel.OFF:
            case LogLevel.ALL:
            default:
                return 'silly';
        }
    }

    isLevelEnabled(otherLevel: LogLevel): boolean {
        return this.level >= otherLevel;
    }

    debug(message: string, ...meta: any[]): void {
        this.logger.debug(message, ...meta);
    }

    info(message: string, ...meta: any[]): void {
        this.logger.info(message, ...meta);
    }

    warn(message: string, ...meta: any[]): void {
        this.logger.warn(message, ...meta);
    }

    error(message: string, ...meta: any[]): void {
        this.logger.error(message, ...meta);
    }

    fatal(message: string, ...meta: any[]): void {
        this.logger.error(message, ...meta);
    }

    trace(message: string, ...meta: any[]): void {
        this.logger.silly(message, ...meta);
    }
}
