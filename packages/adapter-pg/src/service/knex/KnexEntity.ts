import Knex from 'knex';

export interface KnexEntity {
    id: Knex.Value;
    created_at: Date;
    updated_at: Date | null;
}
