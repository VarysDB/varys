# The SNS_HTTP PubSub Adapter

The SNS_HTTP Adapter handles publishing facts to SNS and handles HTTP subscriptions to the Varys fact SNS topic.

## Initial Configuration

```
{
  "pubsub": {
    "adapter": "SNS_HTTP",
    "config": {
      // the global topic of facts to publish data to
      "factsTopicArn": String
    }
  }
}
```

## How it works

When a new fact is discovered, the Adapter will push to the topic a message with the body being the fact. In the message attributes, the Adapter will add an entry called `VARYS_FACT_IDENTIFIER`, with a value constructed as: `${NAMESPACE}:${REFERENCE}:${TYPE}`.

For example: assume we have a namespace called `user_data`, and we discover a new fact with type `name` for user id `123`.
We can then discover the new fact using the "Discover Fact" API call.

After successfully persisting the new fact under the namespace, Varys will use the SNS_HTTP adapter to push the following SNS message to the configured SNS topic:

```json
{
  "MessageAttributes": {
    "VARYS_TOPIC": {
      "DataType": "String",
      "Value": "user_data:123:name"
    }
  },
  "Message": "{\"fact_namespace\": \"user_data\", \"reference\": \"123\", \"fact\": {\"type\": \"name\",\"data\": \"new user name!\"}}"
}
```

The `SNS_HTTP` PubSub Adapter uses SNS for "pub" and HTTP for "sub". After issuing a "Subscribe to Fact" API call, Varys will invoke the `Subscribe` action in the SNS topic. The registered HTTP endpoint must then handle the "Subscription Confirmation" message.

Listening to the `user_data:123:name` fact can be done with the following payload to the "Subscribe to Fact" API call:

```
{
  "topic": "user_data:123:name",
  "attributes": {
    "endpoint": "http://my-application-url"
  }
}
```

The `endpoint` value specifies which HTTP endpoint Varys should deliver messages that arrive in `topic`.

In order to listen to all facts under `user_data`, Varys supports the `*` glob. Let's imagine we have `user_data:123:name` and `user_data:123:age`. You can listen to all facts unser `user_data` using the following payload for the "Subscribe to Fact" API call:

```
{
  "topic": "user_data:123:*",
  "attributes": {
    "endpoint": "http://my-application-url"
  }
}
```

Varys will ensure that the `FilterPolicy` for the subscription is an exact matching in the first case, and a prefix matching up to `varys:user_data:` in the second case.
