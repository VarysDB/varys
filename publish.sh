#!/bin/bash

PACKAGE="lerna.json"
REGISTRY=$1
HUB_ROOT=$2

USAGE="Usage: ./build.sh <REGISTRY> <HUB_ROOT>"

if [ -z "$REGISTRY" ]; then
  echo "Error: Missing argument REGISTRY"
  echo "$USAGE"
  exit 1
fi

if [ -z "$HUB_ROOT" ]; then
  echo "Error: Missing argument HUB_ROOT"
  echo "$USAGE"
  exit 1
fi

lerna run build || exit 1

lerna publish --registry="$REGISTRY" --force-publish=\* || exit 1

VERSION=$(cat "$PACKAGE" \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

PACKAGES=(
  api-app
)

for p in "${PACKAGES[@]}"; do
  ./build.sh "$p" || exit 1

  HUB_RELEASE="$HUB_ROOT/varys/$p:$VERSION"

  docker tag "varys/$p" "$HUB_RELEASE"
  docker push "$HUB_RELEASE"
done
