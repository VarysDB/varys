#!/bin/bash

PACKAGE=$1
USAGE="Usage: ./build.sh <PACKAGE>"

if [ -z "$PACKAGE" ]; then
  echo "Error: Missing argument PACKAGE"
  echo "$USAGE"
  exit 1
fi

echo "Building package $PACKAGE"
docker build -t "varys/$PACKAGE" -f "packages/$PACKAGE/Dockerfile" . || exit 1

#!/bin/bash
