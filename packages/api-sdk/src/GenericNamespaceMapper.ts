import assert from 'assert';
import { NamespaceDTO } from '@varys/api-model';

type NamespaceFactTypes<T> = { [K in keyof T]: string; };

// TODO: improve and fix these fucking gambiarras of hell
export class GenericNamespaceMapper<T, R extends keyof T> {

    constructor(
        private readonly referenceKey: R,
        private readonly definitions: NamespaceFactTypes<Omit<T, R>>,
        private readonly defaults: Partial<Omit<T, R>>
    ) {
    }

    asPlain(namespace: NamespaceDTO): T {

        const entries = Object.entries(this.definitions) as [keyof T, string][];

        const properties = entries.map(([key, factType]) => (
            { [key]: this.factValue(key, factType, namespace) }
        ));

        return Object.assign({
            [this.referenceKey]: namespace.reference
        }, ...properties);
    }

    private factValue(key: keyof T, factType: string, namespace: NamespaceDTO): T[keyof T] {

        if (namespace.facts[factType]) {
            // @ts-ignore
            return namespace.facts[factType].data as T[keyof T];
        }

        assert(Reflect.has(this.defaults, key), `Namespace ${namespace.reference} does not have a fact ${factType} and no default value was provided`);

        return Reflect.get(this.defaults, key);
    }
}
