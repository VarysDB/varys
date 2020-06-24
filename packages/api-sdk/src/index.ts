export * from '@varys/api-model';
export * from './client';
export * from './entity';
export * from './listener';
export * from './Sdk';

import { Sdk, Settings } from './Sdk';

export default class Varys extends Sdk {

    constructor(settings: Settings) {
        super(settings);
    }

    static init(settings: Settings): Sdk {
        return new Sdk(settings);
    }
}
