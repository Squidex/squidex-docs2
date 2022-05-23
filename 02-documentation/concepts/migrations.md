---
description: >-
  The migration is the process to bring Squidex from one major version to the
  next major version.
---

# Migrations

## How does it work?

Some updates and new features require an update to the existing data structures and therefore to the database as well. To automate this update am migration process has been introduced.

### General Process

The migration process uses a version in the database to determinate whether an update is needed.

This version is stored in the `Squidex` database (1) in the `Migration` (2) collection, where only a single document (3) exists.

The document has two relevant fields:

1. **Version:** The actual version of the database. This number has nothing to do with the production version. For example Squidex 6.6.0 has the database version 26.
2. **IsLocked**: A field that indicates whether a migration is already in process. This is useful when you have more than one Squidex server to synchronize the work between the instances.

![The migration document](<../../.gitbook/assets/image (83).png>)

When a Squidex server is started the following steps are executed:

1. The current version is queried from the database and the "IsLocked" field is set to true, if it is not locked already. This is a single atomic operation, therefore it is in general thread safe.
2. If the lock has been taken, the database version is compared with the new database version, that is part of the source code and incremented with each update of a data structure. If the two versions are different the necessary migration steps are executed. Then the lock is released.
3. If the lock has not been taken, the server waits for 5 seconds and continues with step 1. If another server is running the migration, the current server will therefore wait until the migration has been completed and it can take the lock. Usually the queried database version is then the same as the new version and the server will just release the lock for the next server.

{% hint style="info" %}
If a server crashes before it can release the lock the database is essentially locked forever and all servers would wait wait for the lock to be released. You have to release manually to solve this issue.
{% endhint %}

### Migration steps

There is no documentation which migration steps will run, but the following code file gives an idea:

{% embed url="https://github.com/Squidex/squidex/blob/master/backend/src/Migrations/MigrationPath.cs" %}
Migration steps
{% endembed %}

Usually the migration will just rebuild a database from scratch. Squidex uses event sourcing, which means that each entity - for example an asset or content item - exists as a sequence of change events and as a snapshot document in the database for complex queries. As long as we do not loose the events, we can just rebuild the snapshot documents from the events. Therefore events are never deleted or updated.

When a change is not backwards compatible anymore and when it is very likely that the target collection contains a lot of documents, the snapshots are rebuild to a new collection. This makes it easier to roll back to and old version when the migration has failed or when the new version has a critical bug.

Therefore you will see collections that contain a number, for example Assets2 (1).

![New collections](<../../.gitbook/assets/image (75) (1).png>)

## How to plan a migration

Usually the migration will complete within a few minutes but there is not table or description how long it will take to make a migration from your version to a new version. It also depends on the number of content items and assets for example, because these these are typically the largest collections in the system.

### Migration steps

In general it is not possible to make a migration without an interruption of your typical processes, but you can make the migration without a major downtime.

These are the steps you should execute.

#### Step 0: Practice your migration with a test run

If you have a staging environment it is recommended to practice your migration first to get an idea how long it will take to complete it. You can also clone your database and make a second deployment to try it out first with your production database.

#### Step 1: Put your Squidex deployment to read-only mode.

If you make a backup or run the migration you should not allow updates, because you will loose changes when these updates are executed while the migration is running. It is better to block updates. Therefore Squidex provides a setting to put your deployment to read-only mode:

{% embed url="https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L4" %}
Read-only Mode
{% endembed %}

Just set the following environment variable: `MODE_READONLY=true` and restart your deployment.

#### Step 2: Make an backup

Make a backup of your entire database with mongodump: [https://www.mongodb.com/docs/database-tools/mongodump/](https://www.mongodb.com/docs/database-tools/mongodump/)

It is not a good idea to use the backup system of Squidex itself, because it is not a complete backup of your database and slower to restore.

#### Step 3: Clone your database

Use the backup you have created to clone your database.&#x20;

#### Step 4: Deploy a new Squidex version to your cloned database

Do not change the existing database and deploy a new Squidex version to your new cloned database. Also set this deployment to read-only. The new servers will automatically migrate your new database to the newest version. In case on an error you can just delete the cloned database and the new Squidex deployment.

#### Step 5: Change your load balancer or DNS to point to the new version

If the cloned database has been updated to the version you can change the DNS entry or your load balancer to point to the new version. It is recommended to change the load balancer or your kubernetes service, because it will be faster to make the update.

Please remember that both versions are still in read-only mode. So they contain the same assets, content and settings. You can now test your new instance with your end users. In case of an error you can just change your load balancer or DNS to point to the old deployment.

Of course your end users or content editors cannot change content items or upload assets while the migration is in process, but you have no downtime.

#### Step 6: Update your new deployment to allow updates.

You can now remove the read-only flag from your new deployment and the migration is completed.

#### Step 7: Cleanup the old database and deployment

You can now cleanup old resources:

1. Delete your old deployment.
2. Delete old collections, e.g. if you see a collection like `States_Contents_All3`, delete
   1. `States_Contents_All2`
   2. `States_Contents_All1`
   3. `States_Contents_All`

### FAQ

#### Is there a migration process for assets?

No, assets are never updated or deleted. Therefore a migration processes is not necessary. You also do not have to backup your database.

#### Do I always need a second deployment for migration

No, it just reduces the risk that something goes wrong. If a migration is just a matter of a few minutes you can do it directly on the production system. Just increment the version (e.g. docker tag) and update your deployment.&#x20;

Whether a migration takes a few minutes or not can be answered with a test run.

#### Is it always recommended to use the read-only flag

Yes, because you will always looses updates when a user makes a change while a migration is running. The main problem are inconsistencies when a new event is added to the event stream but the snapshot has still the old version.

