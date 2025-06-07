---
description: Short Description Concerning the Squidex Architecture.
---

# Architecture

## Concepts

Squidex is implemented based on the following concepts:

### CQRS

CQRS stands for _Command Query Responsibility Segregation_. It's a pattern that was first described by Greg Young. At its heart is the idea that you can use a different model to update information, rather than the model you use to read information. Typically, you use event sourcing as the primarily source of truth for your data and then you subscribe to the events to create read models that can be used to query and fetch information about your entities.

Read more from [Martin Fowler](https://martinfowler.com/bliki/CQRS.html)

### Event Sourcing

We can query an application's state to find out the current state of the world, and this answers many questions. However there are times when we don't just want to see where we are, we also want to know how we got there.

Event Sourcing ensures that all changes to an application state are stored as a sequence of events. Not only are we able to query these events, but we can also use the event log to reconstruct past states and as a foundation to automatically adjust the state to cope with retroactive changes.

A traditional representation of database state can be entirely recreated by reprocessing this event log. Event sourcing's benefits include strong auditing, creation of historic state, and replaying of events for debugging and analysis. Event sourcing has been around for a while, but we think it is used much less than it should be.

Although this approach adds a lot of complexity to the system it also has a lot of advantages:

1. There's a history of all changes.
2. It's possible to consume the events to create custom storage, e.g. you can use the Elastic Search Stack for full text search or statistics.
3. Data is never deleted. Even when there are bigger bugs, it's possible to provide fixes that restore all lost content.
4. There's no need to worry about data migration when changing the read models with a new version; just run the event consumers from the beginning to populate the read store with the updated data.

## Frameworks and Tools

Squidex is based on the following frameworks and tools:

* ASP.NET Core for the backend.
* Angular for the Management UI
* MongoDB for the event Store and persistence
* Orleans as the backend technology.

Of course there are also dozens of external dependencies (because there's no need to reinvent the wheel!), but it would just be too much information to list them all here.

See slides about the current architecture (June 2019): [https://www.slideshare.net/secret/yUk1EmYlw8pLZF](https://www.slideshare.net/secret/yUk1EmYlw8pLZF)
