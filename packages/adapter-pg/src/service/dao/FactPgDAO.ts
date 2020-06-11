import Knex from 'knex';
import uuid from 'uuid';
import objectHash from 'object-hash';
import { FactData } from '@varys/domain';
import { KnexDAO } from '../knex/KnexDAO';
import { FactEntity } from '../entity/FactEntity';

interface FactId {
    id: string;
    fingerprint: string;
}

export class FactPgDAO {

    private readonly baseDAO: KnexDAO<FactEntity>;

    constructor(private readonly knex: Knex, tablePrefix: string, namespaceType: string) {

        // FIXME: use schemas instead
        this.baseDAO = new KnexDAO<FactEntity>(knex, `${tablePrefix}_${namespaceType}`);
    }

    calculateId(reference: string, type: string, source: string, data: FactData): FactId {

        const fingerprint = `${reference}:${type}:${source}:${objectHash.sha1(data)}`;

        const id = uuid.v5(fingerprint, '00000000-0000-0000-0000-000000000000');

        return { id, fingerprint };
    }

    async findLatestByReference(reference: string, type: string): Promise<FactEntity | null> {

        const [namespace] = await this.findLatestTypesByReference(reference, [type]);

        return namespace || null;
    }

    async findLatestTypesByReference(reference: string, types: string[] | null): Promise<FactEntity[]> {
        return await this.baseDAO.ref()
            .select(this.knex.raw('DISTINCT ON ("reference", "type") *'))
            .where('reference', reference)
            .where(builder => {
                if (types) {
                    builder.whereIn('type', types);
                }
            })
            .orderBy('reference', 'asc')
            .orderBy('type', 'desc')
            .orderBy('score', 'desc')
            .orderBy('discovery_date', 'desc');
    }

    async saveRevision(entity: FactEntity): Promise<FactEntity | null> {
        return await this.baseDAO.createIgnore(entity, ['id']);
    }

    async saveRevisions(entities: FactEntity[]): Promise<(FactEntity | null)[]> {

        const revisions = [];

        // TODO: add support for a single query
        for (const entity of entities) {
            revisions.push(await this.baseDAO.createIgnore(entity, ['id']));
        }

        return revisions;
    }
}
