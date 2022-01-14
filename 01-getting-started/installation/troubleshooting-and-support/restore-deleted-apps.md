---
description: >-
  Sometimes it happens that you have deleted an app or something else by
  accident. Very often it is possible to restore this data and this guide tells
  you how to do that.
---

# Restore deleted apps

## When can I restore an app?

Squidex uses event sourcing to store the state of an object (an app, content, asset and so on). When an object it is deleted, a new deletion event is added to the system and the object is marked as deleted. Therefore most objects can be restored.

But with Squidex 6.0 a new flag has been introduced: `apps:deletePermanent`. When this flag is set to true, a deletion process will delete all app data in the background. In this case, it is not possible to restore the data.

## Use a backup

If you have a backup of your data, it is recommended to restore this backup. But this means to take your system offline. if this is not acceptable, you can continue with this guide.

Read more about backups in the following article:

{% content-ref url="../../../02-documentation/concepts/backups.md" %}
[backups.md](../../../02-documentation/concepts/backups.md)
{% endcontent-ref %}

## Restore process

Before you continue you need a way to connect to you MongoDB instance. I recommend a graphical management tool for that. I recommend this tool: [https://studio3t.com/](https://studio3t.com). If you database is not accessible from the outside you have to login to your server or forward a port to your system. For example I often use `kubectl` for this.

```
kubectl port-forward mongo-0 27018:27017
```

Then the remove MongoDB server is accessible under `mongodb://localhost:27018...`.

### Step 0: Make a backup

Before you continue you should make a backup of your database. If you do not have a process in place, you can do this with studio3t as well:

[https://studio3t.com/knowledge-base/articles/mongodb-export-csv-json-sql-bson/#export-mongodb-to-bson-or-mongodump](https://studio3t.com/knowledge-base/articles/mongodb-export-csv-json-sql-bson/#export-mongodb-to-bson-or-mongodump)

### Step 1: Delete the deletion event

The main data source in Squidex is a list of events. Most other states are derived from that, so you can easily restore your other states from the events.

1. Go to the Events collection.
2. Find the deletion event with the following filter: `{ "Events.Type": "AppDeletedEvent" }`
3. Delete this document.

![Delete the event](<../../../.gitbook/assets/image (73).png>)

### Step 2: Update the app document

You have two  options. Variation 1 is faster, but does not work well, if you have to undo a lot of changes.

#### Variation 1:

In this variation we are going to make the changes in the database manually. It is faster, but you can make mistakes and if you have a lot of changes it is time consuming.

You have to update the document for the app in the database:

1. Go to the States\_Apps collection.
2. Set the deleted flag to false (there are 2 fields for that).
3. Decrement the version field (there are 2 fields for that).
4. Save the document.

![Update the app document](<../../../.gitbook/assets/image (71).png>)

#### Variation 2

In this variation we use the rebuild process. This part of Squidex runs before startup and uses the events to rebuild all documents of a given type, for example all apps or all assets.

1. Stop your Squidex instance.
2. Turn on the rebuild process: [https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L553](https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L553), for example set `REBUILDER__APPS=true` as environment variable (important: it is a double underscore).
3. Start your Squidex instance and wait until the rebuild is over and your Squidex instance is available again. If you use multiple instances, set the instance count to 1 to ensure that the rebuild is not running multiple times or in parallel.
4. Stop the instance.
5. Turn off the rebuild process, for example by removing the environment variable or by setting the value to `false`.
6. Restart your instance. If you use multiple instances, remember to set the instance count to your previous value to have high availability again.

