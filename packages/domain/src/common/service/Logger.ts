import { LogLevel } from '../LogLevel';

export declare class Logger {

    readonly level: LogLevel;

    readonly name: string;

    isLevelEnabled(otherLevel: LogLevel): boolean;

    debug(...data: any[]): Logger;

    info(...data: any[]): Logger;

    warn(...data: any[]): Logger;

    error(...data: any[]): Logger;

    fatal(...data: any[]): Logger;

    trace(...data: any[]): Logger;

    start(): Logger;

    stop(): Logger;
}
