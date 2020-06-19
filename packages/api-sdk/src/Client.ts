import { FactDTO, FindFactResponse, FindNamespaceResponse, RegisterFactRequest } from '@varys/api-model';
import { NamespaceMapper } from './NamespaceMapper';

export class Client<T> {

    constructor(
        // TODO: remove
        // @ts-ignore
        private readonly blackboard: string,
        // TODO: remove
        // @ts-ignore
        private readonly mapper: NamespaceMapper<T>
    ) {
    }

    // TODO: remove
    // @ts-ignore
    registerFact(namespace: string, fact: FactDTO): Promise<RegisterFactRequest> {
        // TODO: send RegistrationRequest
    }

    // TODO: remove
    // @ts-ignore
    findFact(namespace: string, type: string): Promise<FindFactResponse> {
        // TODO: send FindFactRequest
    }

    // TODO: remove
    // @ts-ignore
    findNamespace(namespace: string): Promise<FindNamespaceResponse> {
        // TODO: send FindNamespaceRequest
    }

    // TODO: listeners
}
