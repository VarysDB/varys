import { FactTrigger } from './FactTrigger';

class FactTypeMap extends Map<string, FactTrigger[]> {
}

class NamespaceTypeMap extends Map<string, FactTypeMap> {
}

/**
 * @deprecated must be implemented again (@bruno dá o show aqui)
 */
export class FactTriggerFactory {

    private readonly triggersMap: NamespaceTypeMap;

    constructor(readonly triggers: FactTrigger[]) {

        this.triggersMap = triggers.reduce((namespaceTypeMap, trigger) => {
            if (!namespaceTypeMap.has(trigger.namespace)) {
                namespaceTypeMap.set(trigger.namespace, new FactTypeMap());
            }

            const factTypeMap = namespaceTypeMap.get(trigger.namespace)!;
            if (!factTypeMap.has(trigger.type)) {
                factTypeMap.set(trigger.type, []);
            }

            const triggersList = factTypeMap.get(trigger.type)!;

            triggersList.push(trigger);

            return namespaceTypeMap;
        }, new NamespaceTypeMap());
    }

    getTriggers(namespaceType: string, factType: string): FactTrigger[] {

        if (!this.triggersMap.has(namespaceType)) {
            return [];
        }

        const factTypeMap = this.triggersMap.get(namespaceType)!;
        if (factTypeMap.has(factType)) {
            return [];
        }

        return factTypeMap.get(factType)!;
    }
}
