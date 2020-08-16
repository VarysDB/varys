import * as jf from 'joiful';

// TODO: maybe also support other characters like ./$
export const reference = () => jf.string().trim().regex(/^[a-zA-Z0-9_\-]+$/).required();
