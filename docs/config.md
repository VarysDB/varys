# Configuration

Configuration refers to mainly two layers of Varys: PubSub and Persistence.

When Varys runs, it looks for a `varys.config.json` file in the current directory, or looks it up from a path inside the
`VARYS_CONFIG_PATH` environment variable.

The configuration definition is as follows:

```
{
    "pubsub": {
        "adapter": String,
        "config": PubSubAdapterSpecificConfig
    },
    "persistence": {
        "adapter": String,
        "config": PersistenceAdapterSpecificConfig
    },
    "aws": {
        "region": String,
        "accountId": String,
        "secretKey": String
    }
}
```

Each adapter has different configuration. Refer to the built-in adapters for configuration options.
