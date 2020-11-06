#!/bin/bash

# TODO: get npm token using https://www.npmjs.com/package/registry-auth-token

PACKAGE="lerna.json"
REGISTRY=$1
HTTPS_REGISTRY="https://$REGISTRY"
ECR_ROOT=$2
S3_BUCKET=$3

USAGE="Usage: ./publish.sh <REGISTRY> <ECR_ROOT> <S3_BUCKET>"

if [ -z "$REGISTRY" ]; then
  echo "Error: Missing argument REGISTRY"
  echo "$USAGE"
  exit 1
fi

if [ -z "$ECR_ROOT" ]; then
  echo "Error: Missing argument ECR_ROOT"
  echo "$USAGE"
  exit 1
fi

if [ -z "$S3_BUCKET" ]; then
  echo "Error: Missing argument S3_BUCKET"
  echo "$USAGE"
  exit 1
fi

lerna run build || exit 1

lerna publish --registry="$HTTPS_REGISTRY" --force-publish=\* -- --force --access restricted || exit 1

$(aws ecr get-login --no-include-email)

VERSION=$(cat "$PACKAGE" \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "Building Docker images using tag $VERSION"

PACKAGES=(
  api-app
)

for p in "${PACKAGES[@]}"; do
  NPM_REGISTRY="$REGISTRY" ./build-image.sh "$p" "$VERSION" || exit 1

  ECR_RELEASE="$ECR_ROOT/varys/$p:$VERSION"

  docker tag "varys/$p" "$ECR_RELEASE"
  docker push "$ECR_RELEASE"
done

LAMBDA=(
)

for p in "${LAMBDA[@]}"; do
  NPM_REGISTRY="$REGISTRY" ./build-lambda.sh "$p" "$VERSION" "$S3_BUCKET" || exit 1
done
