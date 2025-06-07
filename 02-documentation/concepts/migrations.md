---
description: >-
  Migration is the Process that Takes Squidex From one Major Version to the Next
  Major Version.
---

# Migrations

## How Does it Work?

Some updates and new features require an update to the existing data structures and therefore to the database as well. To automate these updates, a migration process has been introduced.

### General Process

The migration process uses a version in the database to determine whether an update is needed.

This version is stored in the `Squidex` database (1) in the `Migration` (2) collection, where only a single document (3) exists.

The document has two relevant fields:

1. **Version:** The actual version of the database. This number has nothing to do with the production version. For example Squidex 6.6.0 has the database version 26.
2. **IsLocked**: This field indicates if a migration is already in process. This is useful when you have more than one Squidex server to synchronize the work between the servers.

![The migration document](<../../.gitbook/assets/image (76) (1).png>)

When a Squidex server starts up, the following steps are executed:

1. The current version is queried from the database and the "**IsLocked**" field is set to true, if it is not locked already. This is a single atomic operation, therefore it is in general, thread safe.
2. If the lock has been taken, the database version is compared with the new database version, that is part of the source code and incremented with each update of a data structure. If the two versions are different the necessary migration steps are executed. Then the lock is released.
3. If the lock has not been taken, the server waits for 5 seconds and continues with step 1. If another server is running the migration, the current server waits until the migration is complete and it can acquire a lock. Usually, the queried database version is then the same as the new version and the server will just release the lock for the next server.

{% hint style="info" %}
If a server crashes before it releases the lock, the database is essentially locked forever and all servers would have to wait for the lock to be released. In such cases, you have to release the lock manually to resolve the issue.
{% endhint %}

### Migration Steps

There is no documentation detailing how migration steps will run, but the following code file gives you some information:

{% embed url="https://github.com/Squidex/squidex/blob/master/backend/src/Migrations/MigrationPath.cs" %}
Migration steps
{% endembed %}

Usually, the migration will just rebuild a database from scratch. Squidex uses event sourcing, which means that each entity - for example an asset or content item - exists as a sequence of change events and as a snapshot document in the database for complex queries. As long as you do not lose the events, you can just rebuild the snapshot documents from the events. Therefore, events are never deleted or updated.

When a change is not backwards compatible anymore and when it is very likely that the target collection contains a lot of documents, the snapshots are rebuilt to a new collection. This makes it easier to roll back to an old version in cases where migration fails, or when the new version has a critical bug.

So, you will see collections that contain a number, for example **States\_Assets2** (1).

![New collections](<../../.gitbook/assets/image (75) (1).png>)

## How to Plan a Migration

Usually, migration completes within a few minutes but there is no table or description depicting how long migration from your version will take to a new version. Migration time also depends on the number of content items and assets you have for example.  This is because these are typically the largest collections in the system.

### Migration Steps

In general it is not possible to initialize a migration without an interruption of your typical processes, but you can initialize migration without too much downtime.

These are the steps you should execute:

#### Step 0: Practice Your Migration With a Test Run

If you have a staging environment we recommend that you practice your migration first to assess how long it will take to complete. You can also clone your database and create a second deployment to try it out first with your production database.

#### Step 1: Switch Your Squidex Deployment to Read-Only Mode.

If you create a back-up or run a migration, you shouldn't allow updates, because while the migration runs, you will lose changes when these updates are executed. It's better to block updates. Therefore, Squidex provides a setting to switch your deployment to read-only mode:

{% embed url="https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L4" %}
Read-only Mode
{% endembed %}

Just set the following environment variable: `MODE_READONLY=true` and restart your deployment.

#### Step 2: Create a Backup

Create a backup of your entire database with Mongodump: [https://www.mongodb.com/docs/database-tools/mongodump/](https://www.mongodb.com/docs/database-tools/mongodump/)

It's not recommended to use the backup system of Squidex itself, because it is not a complete backup of your database and it's slower to restore.

#### Step 3: Clone Your Database

Use the backup you've created to clone your database.

#### Step 4: Deploy a New Squidex Version to Your Cloned Database

Do not change the existing database and deploy a new Squidex version to your new cloned database. You should also set this deployment to read-only. The new servers will automatically migrate your new database to the newest version. In case of an error, you can just delete the cloned database and the new Squidex deployment.

#### Step 5: Change Your Load Balancer or DNS to Point to the New Version

If the cloned database has been updated to the newer version you can change the DNS entry or your load balancer to point to the new version. It's recommended to change the load balancer or your Kubernetes service, because your update will be faster.

Please remember that at this stage, both versions will still be in read-only mode. So, they contain the same assets, content and settings. You can now test your new instance with your end users. In cases where there's an error, you can just change your load balancer or DNS to point to the old deployment.

Of course, your end users or content editors cannot change content items or upload assets while the migration is in process, but there is no downtime.

#### Step 6: Update Your New Deployment to Allow Updates.

You can now remove the read-only flag from your new deployment and migration is complete!

#### Step 7: Clean Up the Old Database and Deployment

You can now clean up old resources:

1. Delete your old deployment.
2. Delete old collections, e.g. if you see a collection such as `States_Contents_All3`, delete
   1. `States_Contents_All2`
   2. `States_Contents_All1`
   3. `States_Contents_All`

### FAQ

#### Is there a migration process for assets?

No, assets are never updated or deleted. Therefore, a migration processes is not necessary. You also do not have to backup your database.

#### Do I always need a second deployment for migration?

No, it just reduces the risk that something might go wrong. If a migration just takes a matter of a few minutes you can do it directly on the production system. Just increment the version (e.g. Docker tag) and update your deployment.

Whether a migration takes a few minutes or not can be answered by conducting a test run.

#### Is it always recommended to use the read-only flag?

Yes, because you will always lose updates when a user makes a change while a migration is running. The main problems are inconsistencies when a new event is added to the event stream but the snapshot still has the old version.
