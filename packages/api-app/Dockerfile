FROM node:14.4-alpine as build
LABEL maintainer="George R. R. Martin"

WORKDIR /app

COPY .dockerignore .dockerignore
COPY lerna.json lerna.json
COPY LICENSE LICENSE
COPY package.json package.json
COPY README.md README.md
COPY tsconfig.json tsconfig.json
COPY yarn.lock yarn.lock

COPY packages/domain/ packages/domain/
COPY packages/adapter-pg/ packages/adapter-pg/
COPY packages/adapter-sns-http/ packages/adapter-sns-http/
COPY packages/api-model/ packages/api-model/
COPY packages/api-app/ packages/api-app/

RUN yarn install

RUN yarn run clean && yarn run bootstrap && yarn run build && yarn cache clean

CMD yarn run start:api-app
