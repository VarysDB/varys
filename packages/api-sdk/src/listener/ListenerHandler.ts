import { FactDTO } from '@varys/api-model';

export interface ListenerHandler {
    (fact: FactDTO): Promise<void>;
}
