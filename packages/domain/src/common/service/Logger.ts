import { LogLevel } from '../LogLevel';

export declare class Logger {

    readonly level: LogLevel;

    readonly name: string;

    isLevelEnabled(otherLevel: LogLevel): boolean;

    debug(message: string, ...meta: any[]): void;

    info(message: string, ...meta: any[]): void;

    warn(message: string, ...meta: any[]): void;

    error(message: string, ...meta: any[]): void;

    fatal(message: string, ...meta: any[]): void;

    trace(message: string, ...meta: any[]): void;
}
