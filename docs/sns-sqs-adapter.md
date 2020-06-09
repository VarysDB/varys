# The SNS_SQS PubSub Adapter

The SNS_SQS Adapter handles publishing facts to SNS and handles SQS subscriptions to the Varys fact SNS topic.

## Initial Configuration

```
{
  "pubsub": {
    "adapter": "SNS_SQS",
    "config": {
      // the global topic of facts to publish data to
      "facsTopic": String
    }
  }
}
```

## How it works

When a new fact is discovered, the Adapter will push to the topic a message with the body being the fact. In the message attributes, the Adapter will add an entry called `VARYS_FACT_IDENTIFIER`, with a value constructed as: `${NAMESPACE}:${REFERENCE}:${TYPE}`.

For example: assume we have a namespace called `user_data`, and we discover a new fact with type `name` for user id `123`.
We can then discover the new fact using the "Discover Fact" API call.

After successfully persisting the new fact under the namespace, Varys will use the SNS_SQS adapter to push the following SNS message to the configured SNS topic:

```json
{
  "MessageAttributes": [{
    "Name": "VARYS_FACT_IDENTIFIER",
    "Value": "user_data:123:name"
  }],
  "Message": "{\"fact_namespace\": \"user_data\", \"reference\": \"123\", \"fact\": {\"type\": \"name\",\"data\": \"new user name!\"}}"
}
```

The `SNS_SQS` PubSub Adapter uses SNS for "pub" and SQS for "sub". It is up to the application registering the listener to ensure that a SQS Queue exists. Varys will handle all the subscription parts through the Adapter.

This means that listening to the `user_data:123:name` fact can be done with the following payload to the "Subscribe to Fact" API call:

```
{
  "topic": "user_data:123:name",
  "config": {
    "target": "my_sqs_queue_arn"
  }
}
```

The `target` value specifies which SQS Queue Varys should deliver the message in `topic` to. This operation is idempotent: Varys doesn't allow multiple subscriptions of the same SQS Queue to the same topic. This means that applications should call `POST /subscribe` once when starting. Multiple applications can call `POST /subscribe` as it is safe to do so.

This also means that limitations regarding SNS and SQS apply here as well.

In order to listen to all facts under `user_data`, Varys supports the `*` glob. Let's imagine we have `user_data:123:name` and `user_data:123:age`. You can listen to all facts unser `user_data` using the following payload for the "Subscribe to Fact" API call:

```
{
  "topic": "user_data:123:*",
  "config": {
    "target": "my_sqs_queue_arn"
  }
}
```

Varys will ensure that the `FilterPolicy` for the subscription is an exact matching in the first case, and a prefix matching up to `varys:user_data:` in the second case.
