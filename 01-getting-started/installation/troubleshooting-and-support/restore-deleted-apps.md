---
description: >-
  This guide shows how to restore an app or other objects that may have been
  accidentally deleted.
---

# Restore deleted apps

## When can I restore an app?

Squidex uses event sourcing to store the state of an object (an app, content, asset and so on). When an object is deleted, a new deletion event is added to the system and the object is marked as deleted. Therefore most objects can be restored.

But with Squidex 6.0 a new flag has been introduced: `apps:deletePermanent`. When this flag is set to true, a deletion process will delete all app data in the background. In this case, it is not possible to restore the data.

## Use a backup

If a backup of the data is available, it is recommended to restore this backup. But this will require taking the system offline. If this is not acceptable, proceed with this guide.

Read more about backups in the following article:

{% content-ref url="../../../02-documentation/concepts/backups.md" %}
[backups.md](../../../02-documentation/concepts/backups.md)
{% endcontent-ref %}

## Restore process

Before continuing you need a way to connect to the MongoDB instance. A graphical management tool such as [https://studio3t.com/](https://studio3t.com) is recommended. If the database is not accessible from outside, login to the server directly or use port forwarding.&#x20;

For example if MongoDB is running in Kubernetes, use `kubectl` to port forward.

```
kubectl port-forward mongo-0 27018:27017
```

Then the MongoDB server is accessible under `mongodb://localhost:27018...`.

### Step 0: Make a backup

Before continuing make a backup of the database. If there is not an existing process in place, it can be done with studio3t as well:

[https://studio3t.com/knowledge-base/articles/mongodb-export-csv-json-sql-bson/#export-mongodb-to-bson-or-mongodump](https://studio3t.com/knowledge-base/articles/mongodb-export-csv-json-sql-bson/#export-mongodb-to-bson-or-mongodump)

### Step 1: Delete the _deletion_ event

The main data source in Squidex is a list of events. Most other states are derived from that, so you can easily restore your other states from the events.

1. Go to the Events collection.
2. Find the deletion event with the following filter: `{ "Events.Type": "AppDeletedEvent" }`
3. Delete this document.

![Delete the event](<../../../.gitbook/assets/image (73) (1).png>)

### Step 2: Update the app document

For this, there are two options. Variation 1 is faster, but does not work well if you have to undo a lot of changes.

#### Variation 1:

In this variation, changes are made in the database manually. It is faster, but there are possibilities of mistakes. It is also time consuming if there are a lot of changes.

To update the document for the app in the database, follow the procedure below:

1. Go to the **States\_Apps** collection.
2. Set the `isDeleted` flag to **false**. There are 2 fields for that, the other is `_dl` flag, set it to **false** as well.&#x20;
3. Decrement the `version` field (there are 2 fields for that too).
4. **Save** the document.

![Update the app document](<../../../.gitbook/assets/image (71).png>)

#### Variation 2

In the second variation we use the rebuild process. This part of Squidex runs before startup and uses the events to rebuild all documents of a given type, for example all apps or all assets.

1. Stop your Squidex instance.
2. Turn on the rebuild process: [https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L553](https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L553), for example set `REBUILDER__APPS=true` as environment variable (**IMPORTANT**: it is a double underscore).
3. Start your Squidex instance and wait until the rebuild is over and your Squidex instance is available again. If you use multiple instances, set the instance count to 1 to ensure that the rebuild is not running multiple times or in parallel.
4. Stop the instance.
5. Turn off the rebuild process, for example by removing the environment variable or by setting the value to `false`.
6. Restart your instance. If you use multiple instances, remember to set the instance count to your previous value to have high availability again.
