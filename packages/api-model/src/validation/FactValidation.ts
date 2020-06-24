import * as jf from 'joiful';

export const source = () => jf.string().trim().required();

export const discoveryDate = () => jf.date().required();

export const type = () => jf.string().trim().lowercase().regex(/^[a-z_][a-z0-9_]*$/).required();

export const data = () => jf.any().required();

export const score = () => jf.number().min(-32768).max(32767).integer().required();
