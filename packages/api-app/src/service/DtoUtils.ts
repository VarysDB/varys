import { Fact, Namespace, NamespaceFact, Blackboard } from '@varys/domain';
import { FactDTO, NamespaceDTO, BlackboardDTO } from '@varys/api-model';

export function factToDTO(fact: Fact): FactDTO {
    return {
        type: fact.type,
        source: fact.source,
        data: fact.data,
        score: fact.score,
        discoveryDate: fact.discoveryDate
    };
}

export function namespaceToDTO(namespace: Namespace): NamespaceDTO {
    return {
        reference: namespace.reference,
        type: namespace.blackboard,
        facts: Object.entries<NamespaceFact>(namespace.facts)
            .reduce<Record<string, FactDTO>>((map, [type, fact]) => ({
                ...map,
                [type]: namespaceFactToDTO(type, fact)
            }), {})
    };
}

export function namespaceFactToDTO(type: string, fact: NamespaceFact): FactDTO {
    return {
        type,
        source: fact.source,
        data: fact.data,
        score: fact.score,
        discoveryDate: fact.discoveryDate
    };
}

export function blackboardToDTO(blackboard: Blackboard): BlackboardDTO {
    return {
        name: blackboard.name
    };
}
