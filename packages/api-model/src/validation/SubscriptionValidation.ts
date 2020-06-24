import * as jf from 'joiful';

export const topic = () => jf.string().trim().regex(/^\w+(?:\:[\w+\*]+)+$/).required();

export const endpoint = () => jf.string().uri().required();

export const confirmationToken = () => jf.string().required();
