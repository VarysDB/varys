#!/bin/bash

PACKAGE=$1
VERSION=$2
USAGE="Usage: ./build-image.sh <PACKAGE> <VERSION>"

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
  --build-arg "NPM_TOKEN=$NPM_TOKEN" \
  --build-arg "NPM_REGISTRY=$NPM_REGISTRY" \
  --build-arg "PACKAGE=$PACKAGE" \
  --build-arg "VERSION=$VERSION" \
  . || exit 1
