#!/usr/bin/env bash

SQS_ENDPOINT="http://localhost:4576"

PROFILE="default"
REGION="us-east-1"

echo "configure region [$REGION]"
awslocal configure set $PROFILE.region $REGION

declare -a topics=(
    "varys_facts"
)

declare -a queues=(
    "varys_facts_deadletter"
)

for t in "${topics[@]}"
do
    awslocal sns create-topic --name "$t"
done

for q in "${queues[@]}"
do
    awslocal sqs create-queue --queue-name "$q"
done

awslocal sqs list-queues --output table
awslocal sns list-topics --output table
