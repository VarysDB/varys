## Architecture

Varys has these capabilities:

- Discover a new fact under a namespace
- Read facts from a namespace
- Listen to new facts as they arrive from namespaces with the PubSub mechanism

You can configure Varys's PubSub mechanism using an PubSub Adapter. Currently only `SNS_SQS` is supported and enabled by default.

## PubSub Adapters

Before talking about PubSub Adapter implementations, let's discuss what are the responsibilities of the PubSub Adapter.

A PubSub Adapter has to comply with two responsibilities:

- It controls and decides how facts are published to the underlying platform
- It controls subscriptions to a given topic

## The SNS_SQS PubSub Adapter

When Varys runs, it looks for a `varys.config.json` in the current directory, or looks it up from a path inside the
`VARYS_CONFIG_PATH` environment variable.

Example `varys.config.json`:

```json
{
  "pubsub": {
    "adapter": "SNS_SQS",
    "config": {
      "topicName": "varys_dev_topic"
    }
  },
  "namespaces": {
    "user_data": {
      // namespace options...
    }
  }
}
```

When a new fact is discovered, Varys will push to the topic a message with the body being the fact. In the message attributes, Varys will add an entry called `VARYS_FACT_IDENTIFIER`, with a value constructed as: `varys:${FACT_NAMESPACE}:${FACT_TYPE}`.

For example: assume we have a namespace called `user_data`, and we discover a new fact with type `name`, like this:

```
curl -XPOST -d '{"fact_type": "name", "data": "new user name!"}' https://varys.dev/namespaces/user_data/facts
```

After successfully persisting the new fact under the namespace, Varys will use the SNS_SQS adapter to push the following SNS message to the configured topic:

```json
{
  "MessageAttributes": [{
    "Name": "VARYS_FACT_IDENTIFIER",
    "Value": "varys:user_data:name"
  }],
  "Message": "{\"fact_namespace\": \"user_data\",\"fact\": {\"type\": \"name\",\"data\": \"new user name!\"}}"
}
```

The `SNS_SQS` PubSub Adapter uses SNS for "pub" and SQS for "sub". It is up to the application registering the listener to ensure that a SQS Queue exists. Varys will handle all the subscription parts through the Adapter.

This means that listening to the `varys:user_data:name` fact can be done like this:

```
curl -XPOST -d '{"topic": "varys:user_data:name", "target": "my_sqs_queue_arn"}' https://varys.dev/subscribe
```

The `target` value specifies which SQS Queue Varys should deliver the message in `topic` to. This operation is idempotent: Varys doesn't allow multiple subscriptions of the same SQS Queue to the same topic. This means that applications should call `POST /subscribe` once when starting. Multiple applications can call `POST /subscribe` as it is safe to do so.

This also means that limitations regarding SNS and SQS apply here as well.

In order to listen to all facts under `user_data`, Varys supports the `*` glob. Let's imagine we have `user_data:name` and `user_data:age`. You can listen to all facts unser `user_data` using the following `subscribe` API call:

```
curl -XPOST -d '{"topic": "varys:user_data:*", "target": "my_sqs_queue_arn"}' https://varys.dev/subscribe
```

Varys will ensure that the `FilterPolicy` for the subscription is an exact matching in the first case, and a prefix matching up to `varys:user_data:` in the second case.

You can unsubscribe a previously subscribed queue with `POST /unsubscribe`:

```
curl -XPOST -d '{"target": "my_sqs_queue_arn"}' https://varys.dev/unsubscribe
```

This should be called on a per-need basis.