import * as jf from 'joiful';

export const name = () => jf.string().trim().lowercase().regex(/^[a-z_][a-z0-9_]*$/).required();
