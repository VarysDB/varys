import { Fact } from '@varys/domain';

export interface ListenerHandler {
    (fact: Fact): Promise<void>;
}
