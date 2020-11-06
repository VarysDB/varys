FROM node:14.4-alpine as build
LABEL maintainer="George R. R. Martin"

ARG NPM_TOKEN
ARG NPM_REGISTRY
ARG PACKAGE
ARG VERSION

WORKDIR /app

RUN echo "$VERSION" > .version

RUN printf "registry=https://$NPM_REGISTRY\n//$NPM_REGISTRY/:_authToken=$NPM_TOKEN\n//$NPM_REGISTRY/:always-auth=true" > .npmrc

RUN npm install "@varys/$PACKAGE@$VERSION"
RUN echo "require('@varys/$PACKAGE');" > index.js

CMD node .
