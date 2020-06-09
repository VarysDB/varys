## Architecture

Varys has these capabilities:

- Discover a new fact under a namespace
- Read facts from a namespace
- Listen to new facts as they arrive from namespaces with the PubSub mechanism

In order to support these capabilities, there are two main domain areas to Varys: Persistence and PubSub.

## Persistence

Varys supports any data store, as long as they implement a Repository. Currently, Varys ships with Repositories for the following data stores:

- Postgres

## PubSub

Varys supports any messaging broker, as long as they implement a PubSub Adapter. Currently, Varys ships with these PubSub Adapters:

- The `SNS_SQS` PubSub Adapter

## PubSub Adapters

A PubSub Adapter handles the PubSub layer of Varys.

Only one PubSub Adapter can be active and configured at any time.

A PubSub Adapter has to comply with two responsibilities:

- It controls and decides how facts are published to the underlying platform
- It controls subscriptions to a given topic

# Database Repositories

Database Repositories handle the persistence layer of Varys.

Only one Database Repository can be active and configured at any time.

A Database Repository has to comply with two responsibilities:

- It controls how facts are stored
- It controls how facts are read
