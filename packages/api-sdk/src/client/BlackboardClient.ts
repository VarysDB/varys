import {
    BlackboardDTO,
    BlackboardRoute,
    CreateBlackboardRequest,
    FactDTO,
    FactRoute,
    FactsRootRoute,
    NamespaceDTO,
    NamespaceRoute,
    RegisterFactBatchRequest,
    RegisterFactRequest
} from '@varys/api-model';
import { HttpClientResponse, HttpClient } from './HttpClient';

export class BlackboardClient {

    constructor(
        private readonly blackboard: string,
        private readonly client: HttpClient
    ) {
    }

    registerFact(namespace: string, type: string, payload: RegisterFactRequest): Promise<HttpClientResponse<void>> {
        return this.client.post<FactRoute.Params, RegisterFactRequest, void>(FactRoute.absolutePath, {
            blackboard: this.blackboard,
            namespace,
            type
        }, payload);
    }

    registerFactsBatch(namespace: string, payload: RegisterFactBatchRequest): Promise<HttpClientResponse<void>> {
        return this.client.post<FactsRootRoute.Params, RegisterFactBatchRequest, void>(FactsRootRoute.absolutePath, {
            blackboard: this.blackboard,
            namespace
        }, payload);
    }

    findFact(namespace: string, type: string): Promise<HttpClientResponse<FactDTO>> {
        return this.client.get<FactRoute.Params, FactDTO>(FactRoute.absolutePath, {
            blackboard: this.blackboard,
            namespace,
            type
        });
    }

    findFacts(namespace: string): Promise<HttpClientResponse<FactDTO[]>> {
        return this.client.get<FactsRootRoute.Params, FactDTO[]>(FactsRootRoute.absolutePath, {
            blackboard: this.blackboard,
            namespace
        });
    }

    findNamespace(reference: string): Promise<HttpClientResponse<NamespaceDTO>> {
        return this.client.get<NamespaceRoute.Params, NamespaceDTO>(NamespaceRoute.absolutePath, {
            blackboard: this.blackboard,
            namespace: reference
        });
    }

    createBlackboard(): Promise<HttpClientResponse<BlackboardDTO>> {
        return this.client.post<BlackboardRoute.Params, CreateBlackboardRequest, BlackboardDTO>(BlackboardRoute.absolutePath, {
            blackboard: this.blackboard
        }, {});
    }
}
