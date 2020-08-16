import { Next } from 'koa';
import Router, { RouterContext } from '@koa/router';
import * as jf from 'joiful';
import { Constructor } from 'joiful/core';
import { badRequest } from './JsonResponse';

export function validateParams(classConstructor: Constructor<any>): Router.Middleware {
    return validate(classConstructor, ctx => ctx.params, (ctx, value) => ctx.params = value);
}

export function validateBody(classConstructor: Constructor<any>): Router.Middleware {
    return validate(classConstructor, ctx => ctx.request.body, (ctx, value) => ctx.request.body = value);
}

function validate(classConstructor: Constructor<any>, getter: (ctx: RouterContext) => any, setter: (ctx: RouterContext, value: any) => void): Router.Middleware {
    return async (ctx: RouterContext, next: Next) => {

        const { error, value } = jf.validateAsClass(getter(ctx), classConstructor, {
            convert: true
        });

        if (error) {
            badRequest(ctx.response, error.message);
        } else {
            setter(ctx, value);
            await next();
        }
    };
}
