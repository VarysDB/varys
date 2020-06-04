import { Logger } from './Logger';

export interface LoggerFactory {
    getLogger(context: string | Function | Object): Logger;
}
