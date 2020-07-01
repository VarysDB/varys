#!/bin/bash

VERSION=$1
USAGE="Usage: ./build.sh <VERSION>"

if [ -z "$VERSION" ]; then
  echo "Error: Missing argument VERSION"
  echo "$USAGE"
  exit 1
fi

PACKAGES=(
  api-app
)

for p in "${PACKAGES[@]}"; do
  TAG="varys/$p:$VERSION"
  echo "Building package $TAG"
  docker build -t "$TAG" -f "packages/$p/Dockerfile" .
done

git tag "$VERSION"
