#!/bin/bash

PACKAGE=$1
VERSION=$2
S3_BUCKET=$3
USAGE="Usage: ./build-lambda.sh <PACKAGE> <VERSION> <S3_BUCKET>"

if [ -z "$PACKAGE" ]; then
  echo "Error: Missing argument PACKAGE"
  echo "$USAGE"
  exit 1
fi

if [ -z "$VERSION" ]; then
  echo "Error: Missing argument VERSION"
  echo "$USAGE"
  exit 1
fi

if [ -z "$S3_BUCKET" ]; then
  echo "Error: Missing argument S3_BUCKET"
  echo "$USAGE"
  exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  echo "Error: Missing environment variable AWS_ACCESS_KEY_ID"
  exit 1
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "Error: Missing environment variable AWS_SECRET_ACCESS_KEY"
  exit 1
fi

if [ -z "$NPM_TOKEN" ]; then
  echo "Error: Missing environment variable NPM_TOKEN"
  exit 1
fi

if [ -z "$NPM_REGISTRY" ]; then
  echo "Error: Missing environment variable NPM_REGISTRY"
  exit 1
fi

echo "Building package $PACKAGE"

docker build -t "varys/$PACKAGE" -f "packages/$PACKAGE/Dockerfile" \
  --build-arg "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
  --build-arg "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
  --build-arg "NPM_TOKEN=$NPM_TOKEN" \
  --build-arg "NPM_REGISTRY=$NPM_REGISTRY" \
  --build-arg "PACKAGE=$PACKAGE" \
  --build-arg "VERSION=$VERSION" \
  --build-arg "S3_BUCKET=$S3_BUCKET" \
  . || exit 1
