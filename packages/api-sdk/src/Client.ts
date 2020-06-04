import { FactDTO, FindFactResponse, FindNamespaceResponse, RegisterFactRequest } from '@varys/api-model';
import { NamespaceMapper } from './NamespaceMapper';

export class Client<T> {

    constructor(
        // TODO: remove
        // @ts-ignore
        private readonly namespace: string,
        // TODO: remove
        // @ts-ignore
        private readonly mapper: NamespaceMapper<T>
    ) {
    }

    // TODO: remove
    // @ts-ignore
    registerFact(reference: string, fact: FactDTO): Promise<RegisterFactRequest> {
        // TODO: send RegistrationRequest
    }

    // TODO: remove
    // @ts-ignore
    findFact(reference: string, type: string): Promise<FindFactResponse> {
        // TODO: send FindFactRequest
    }

    // TODO: remove
    // @ts-ignore
    findNamespace(reference: string): Promise<FindNamespaceResponse> {
        // TODO: send FindNamespaceRequest
    }

    // TODO: listeners
}
