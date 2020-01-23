---
description: >-
  This guide will give you an introduction about the integrated backup solution
  and when to use it.
---

# How to make backups and when to use it

Squidex has an integrated backup solution, but it should not be used for all cases. To understand the reasoning when not to use it we need to have a look how it works first.

## When to use the backup system

Squidex uses the event sourcing principle. Everything that happens is saved as an event and all other states can be derived from the sequence of events. Events can never be changed and also not be deleted. Therefore your app also does not get deleted when you archive it. Another reason is that is really complicated to delete everything. All assets need to be deleted and all traces of your app need to be eliminated as well from the server. If one of these steps fails to outcome is almost unpredictable. Therefore the app is just marked as archived.

When you restore an backup you can also choose a new name for your app.

Because of this feature and the implementation behavior that has been described above the backup system is useful in the following cases:

1. When you want to move from your own installation to the cloud.
2. When you want to move from the cloud to your own installation.
3. When you want to clone your app, for example when you create a template for your customers.
4. When you want to move your app from server A to server B and server B has already some apps.

The backup system should not be used for the following use cases:

1. To move all your apps from one server to another.
2. To make regular backups of your squidex installation.
3. To make regular backups from your apps in the cloud. We do backups every day for you.

## How to make backups

Backups can only be made for a single app.

Just go the settings section of your app and to the backups overview.

![Empty backups section](../../.gitbook/assets/image%20%2828%29.png)

Click the `Start Backup` button to start a new backup. It can take a few seconds until you can see it. The screen will refresh automatically and you can follow the progress.

![Completed backups](../../.gitbook/assets/image%20%2817%29.png)

On the same screen you can also see all the backups that have been made, including their status, when they have been made and how many events they contain. This is useful to give you a hint about the size of the backup. Squidex stores up to 10 backups, old backups will be deleted automatically, but you can use the download link to save them.

## How to restore backups

When you are an administrator you can go to the admin section by clicking on your profile:

![To the admin section](../../.gitbook/assets/image%20%2810%29.png)

In the admin section you will find a menu item to restore the backup:

![Backup just started](../../.gitbook/assets/image%20%2819%29.png)

Just copy and paste the URL of your backup to the URL input field and optionally choose a new name for your backup. Submit the form and wait a few seconds. Again the screen gets automatically updated and you can follow the status here as well. The backup and restore operation is not optimized speed and it can take ta while to restore you app.

{% hint style="info" %}
Just create a [support ticket](https://support.squidex.io) if you want to restore an app to the cloud.
{% endhint %}

## How to make regular backups

If you have installed Squidex by your own and you need backups you need to care about two things:

1. The MongoDB database
2. The assets.

### Backup your MongoDB database

Usually you want to backup all your databases.

There are plenty of resources available how to make backups for MongoDB:

> [https://docs.mongodb.com/manual/core/backups/\#back-up-with-mongodump](https://docs.mongodb.com/manual/core/backups/#back-up-with-mongodump)

{% hint style="info" %}
The cloud is hosted on Google Cloud Engine. We have created a simple application that is hosted as a kubernetes job to backup our databases.

The code can be found here: [https://github.com/SebastianStehle/MongoBackup](https://github.com/SebastianStehle/MongoBackup)

Just contact us if you need help or if you want to get support for other storage provider.
{% endhint %}

### Backup your assets

The backup strategy depends on the asset store:

* `Folder`: Just create an archive with all file in the assets folder.
* `MongoDB`: Nothing to do because the MongoDB backup will also backup all assets.
* `AzureBlob`, `AmazonS3`, `GoogleCloud`: Usually the assets are save there.

