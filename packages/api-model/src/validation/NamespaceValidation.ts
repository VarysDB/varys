import * as jf from 'joiful';

export const reference = () => jf.string().trim().lowercase().token().required();
