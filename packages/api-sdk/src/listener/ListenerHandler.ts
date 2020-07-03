import { FactDiscoveryDTO } from '@varys/api-model';

export interface ListenerHandler {
    (fact: FactDiscoveryDTO): Promise<void>;
}
