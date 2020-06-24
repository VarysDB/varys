#!/bin/bash

SQS_ENDPOINT="http://localhost:4576"
SQS="--endpoint-url=$SQS_ENDPOINT sqs"
SNS="--endpoint-url=http://localhost:4575 sns"
PROFILE="--profile default"
REGION="--region us-east-1"

declare -a topics=(
    "varys_facts"
)

declare -a queues=(
    "varys_facts_deadletter"
)

for t in "${topics[@]}"
do
    aws $PROFILE $REGION $SNS create-topic --name "$t"
done

for q in "${queues[@]}"
do
    aws $PROFILE $REGION $SQS create-queue --queue-name "$q"
    aws $PROFILE $REGION $SQS get-queue-attributes --queue-url "$SQS_ENDPOINT/queue/$q" --attribute-names All
done

aws --endpoint-url=http://localhost:4575 sns list-topics
aws --endpoint-url=http://localhost:4575 sns subscribe \
  --topic-arn "arn:aws:sns:us-east-1:000000000000:varys_facts" \
  --protocol "https" \
  --notification-endpoint "http://localhost:4000" \
  --attributes '{"FilterPolicy":"{\"varys_facts\":[{\"prefix\":\"abc123\"}]}","RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:varys_facts_deadletter\"}"}'
