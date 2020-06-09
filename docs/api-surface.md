# Varys API

Here you'll find documentation regarding Varys's API.

The API is HTTP+JSON, and follows REST conventions unless otherwise noted.

The application section relates to capabilities that applications are interested in, such as:

- Discovering facts
- Subscribing to namespaces and fact types
- Unsubscribing from namespaces and fact types

# PubSub Layer

Varys acts as an opinionated broker for published facts, allowing you to fan-out facts to multiple systems. We call this process "fact discovery".

When discovering a new fact, Varys saves the fact to the configured database, and also publishes it to the configured PubSub adapter.

The naming convention for fact publishing and subscription is `${namespaceType}:${reference}:${factType}`.

For subscription rules and capabilities, refer to the documentation of the PubSub adapter of your choice.

## Create namespace

- Method: `POST`
- Path: `/namespaces`
- Request body definition:

```
{
    "type": String,
    "reference": String
}
```

- Response Status Code: `201 CREATED`
- Response body definition:

```
{
    "code": String,
    "messages": Array String,
    "data": {
        "namespace": {
            "type": String,
            "reference": String
        }
    }
}
```

## Discovering multiple facts

Fact discovering saves the facts to the configured Varys database adapter, and publishes the facts to the configured PubSub adapter following the Varys publishing naming scheme.

- Method: `POST`
- Path: `/namespaces/:namespaceType/:reference/facts`
- Request body definition:
```
Array {
    "type": String,
    "source": String,
    "data": String | Number | Object | Date | null,
    "score": Number,
    "discoveryDate": Date
}
```
- Response Status Code: `201 CREATED` | `400 BAD REQUEST`
- Response body definition:
```
{
    "code": String,
    "messages": Array String,
    "data": {
        "facts": Array {
            "type": String,
            "source": String,
            "data": String | Number | Object | Date | null,
            "score": Number,
            "discoveryDate": Date
        }
    }
}
```

## Discovering a single fact

- Method: `POST`
- Path: `/namespaces/:namespaceType/:reference/facts/:factType`
- Request body definition:
```
{
    "type": String,
    "source": String,
    "data": String | Number | Object | Date | null,
    "score": Number,
    "discoveryDate": Date
}
```
- Response Status Code `201 CREATED` | `400 BAD REQUEST`
- Response body definition:
```
{
    "code": String,
    "messages": Array String,
    "data": {
        "fact": {
            "type": String,
            "source": String,
            "data": String | Number | Object | Date | null,
            "score": Number,
            "discoveryDate": Date
        }
    }
}
```

## Reading the most up-to-date fact of a namespace

- Method: `GET`
- Path: `/namespaces/:namespaceType/:reference/facts/:factType`
- Request body definition: Not Applicable
- Response Status Code: `200 OK`
- Response body definition:
```
{
    "code": String,
    "messages": Array String,
    "data": {
        "fact": {
            "type": String,
            "source": String,
            "data": String | Number | Object | Date | null,
            "score": Number,
            "discoveryDate": Date
        }
    }
}
```

## Read all facts of a namespace

- Method: `GET`
- Path: `/namespaces/:namespaceType/:reference/facts`
- Query String definition:
  - factTypes: a comma separated value of fact types. When specified, only facts whose type is in `factTypes` is returned.
- Response Status Code: `200 OK`
- Response body definition:
```
{

    "code": String,
    "messages": Array String,
    "data": {
        "facts": Array {
            "type": String,
            "source": String,
            "data": String | Number | Object | Date | null,
            "score": Number,
            "discoveryDate": Date
        }
    }
}
```


## Subscription

Subscription is tied to the configured Varys PubSub adapter. Each adapter has different configuration.

Refer to the documentation of your PubSub adapter for the comprehensive configuration.

- Method: `POST`
- Path: `/subscribe`
- Request body definition:
```
{
    "topic": String,
    "config": VarysAdapterConfig
}
```
- Response Status Code: `200 OK` | `400 BAD REQUEST`
- Response body definition:
```
{
    "code": String,
    "messages": Array String,
    "data": {
        "subscription": {
            "handle": String
        }
    }
}
```

## Unsubscribe to fact

- Method: `DELETE`
- Path: `/subscribe/:handle`
- Response Status Code: `200 OK` | `404 NOT FOUND`
- Response body definition:
```
{
    "code": String,
    "messages": Array String
}
```