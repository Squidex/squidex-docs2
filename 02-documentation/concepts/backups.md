---
description: Backups store all your app content and is useful for a few scenarios.
---

# Backups

## What is a backup?

A backup is an ZIP archive file that stores all your data for one app. It contains several files of these types:

1. One file per each event that has happened in your system, for example `AppCreated` or `ContentDeleted`event. These files are named in a consecutive order by the order they have happened in your application.
2. One file per asset in your app.
3. Metadata files, for example all users in your system as a pairs of user id and email addresses. When the backup is restored these users are created in target system if they do not exist yet.

## How to create and restore backups?

### How to create backups

If you are the owner of your app, go to "Settings" \(1\) and then to "Backups" \(2\). You can create a new backup there by pressing the "Start Backup" \(3\) button. The screen will not update immediately and it can take a few seconds until you see the status of your backup.

![Your backup](../../.gitbook/assets/image%20%2811%29.png)

Squidex only allows 10 backups per App. If you have reached this limit you have to deleted an old backup. Each backup item has a download link \(5\) that you need to restore the backup and also shows the number of events and assets in your backup \(4\). When you restore the backup it will print the number of restored events and you can compare this with the total number of events in your backup to get an understanding how long the backup operation might take. We do not show a progress indicator because it almost never works properly \(see Microsoft Windows\).

### How to restore a backup

If you are hosting Squidex yourself you are very likely the administrator and you will see a link to the Administration section when you click your profile. This option is not available for you in the Cloud.

1. Go to "Administration" \(1\) and "Restore" \(2\)
2. Copy the URL from your backup and add it the the first input field \(3\)
3. Presse the "Restore Backup" button to restore your backup \(4\). If you have restored a backup before you will still see the logs as shown in the following screenshot.
4. If an app with the same name already exists you to either delete this app first or define a new name for your restored app \(5\).

![Restore an backup](../../.gitbook/assets/image%20%2820%29.png)

### How to restore the backup in the Cloud?

Backups are critical paths for Squidex and do not provide the same security mechanisms as normal API calls, therefore we have to prove first that your backup does not cause any harm to our system. Create a backup of your local or cloud app and send us the URL in personal message in the [support forum](https://support.squidex.io).

If you want to restore a backup please do the following things:

1. Provide a download link directly to the backup. If you need to delete your app \(see point 4\) you have to upload your backup first. Please ensure that an anonymous user can download your backup. Do not use Google Drive, because it causes issue when downloading the backup.
2. Provide the number of events and assets, so that we can have an understanding how long it might take to restore the backup.
3. If you want to change the name of the app, provide a new name please.
4. If you want to keep the name you have to delete your app first. Please do that. The download link for your backup becomes invalid, so you have to upload your backup first \(see point 1\).
5. Do not share your backup link in a public post, use personal messages for that.

{% hint style="info" %}
Just click the profile picture of the user you want to write a personal message.
{% endhint %}

### How does the restore process work?

 The restore process executes the following steps:

1. The name of the app is reserved.
2. All events from the backup are inserted into the system. If the event is an asset event, the corresponding asset is added to the system.
3. All indices are restored based on the inserted events.
4. Contents and assets are created from the events and added to the database.
5. The app name reservation is either taken if the restore operation was successful or released when the operation has failed.

{% hint style="info" %}
The backup cannot use an existing app and creates a new app to avoid conflicts.
{% endhint %}

## Usages for the backup system

The backup has a few implications that are important to understand.

### When to use the backup system?

1. The backup system is useful if you want to clone your app with the full history to either the same installation or another installation. You can define a new app name for your backup and create as many independent copies as you want.
2. The backup system can be used to migrate from the cloud to a self hosted installation or from self hosting to the cloud. In first case you can just restore the backup yourself. In the second case you have to create a support ticket as described above.

### When not to use the backup system?

1. The backup system is not as fast as MongoDB backup and can only secure your app information. Therefore it is not recommended to use the backup system for system backups. Have a look the official documentation about [Back Up and Restore with MongoDB Tools](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/#back-up-and-restore-with-mongodb-tools) to understand the different backup options for MongoDB. If you use a cloud provider like Mongo Atlas, it is typically built in.
2. The backup system creates a new app all the time and old apps are not deleted from the system and only marked as deleted. Therefore you should not use the backup system to make syncs between different environments. It is much more efficient to use the synchronization features of the CLI for that. If you use the backup system for this use case you create a lot of zombie apps in your system.

{% page-ref page="../developer-guides/automation-tools.md" %}



