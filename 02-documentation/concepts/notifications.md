---
description: Learn how to configure and subscribe to notifications in Squidex
---

# Notifications

## Introduction

Squidex provides a notification service that is power by Notifo. [Notifo](https://notifo.io) is an open source general purpose notification framework initally developed for Squidex to be able to subscribe to changes and get notified.

### Scenarios where notifications can be triggered

* One can get notified when there is a change in a content item
* Changes made to the schema
* Changes to contributors such as adding contributors or changing their roles.&#x20;
* Notifications can also be triggered by rules.
* Notifications are also triggered by mentions in the comment. e.g. if you add "@user" to a comment

{% hint style="info" %}
This notification service works only in Squidex Cloud (i.e. cloud.squidex.io) by default. In order to make this work in a self-hosted installation, you must separately install and run the Notifo service. Click here for installation instructions (coming soon).&#x20;
{% endhint %}

### **Working of notifications**

* Notifications can be through email or (web) push notifications.

{% hint style="info" %}
At the time of writing this article, email notifications are not operational.
{% endhint %}

* Person subscribing to a change won't see any notifications if the changes are made by him/her. A notification is created only if the change is done by someone else.

The notification icon is on the top menu bar next to the user icon. Clicking on this shows _Notifications_, _Archive_ (archived notifications) and the notification _Profile_.

<figure><img src="../../.gitbook/assets/2023-01-10_01-41.png" alt=""><figcaption><p>Notification icon</p></figcaption></figure>



## Subscribing to changes

Follow the below instructions to subscribe to changes. For this example we have considered subscribing to changes in **Settings** > **Contributors**.

1.  Navigate to **Settings** (1) and then **Contributors** (2) for your app.

    <figure><img src="../../.gitbook/assets/2023-01-04_15-32.png" alt=""><figcaption><p>Contributor settings for the app</p></figcaption></figure>
2.  Next, you subscribe to the changes. To do so click on the **bell icon** (3) and then toggle the **notification mediums of choice** (4), one can be notified by Email and/or Push Notifications. Click **Save** (5).

    <figure><img src="../../.gitbook/assets/2023-01-10_01-17.png" alt=""><figcaption><p>Subscribing to notifications</p></figcaption></figure>
3.  At this point a new contributor can be added or invited. To test the notifications you can add a contributor. \
    \
    To do so **enter the name or email** (1) address of the contributor (a drop down appears making it easy to select an existing user or enter email address if its a new user), select the role for example **Editor** (2) and click **Add Contributor** (3). \
    <mark style="color:orange;">NOTE: Subscriber will receive notification only if the change is done by another user.</mark>

    <figure><img src="../../.gitbook/assets/2023-01-10_01-23.png" alt=""><figcaption><p>Adding a contributor</p></figcaption></figure>
4. Whenever a new contributor is added, the subscribed user will be notified on the chosen notification methods (as this time only Web Push Notifications work). Below is an example of a (web) Push Notification.

## Setting the notification profile

To set the notification profile, click the **notification icon** (1) on the top bar and then select the **Profile** tab (2). You can set your notification preferences, notification email, timezone among other settings.

<figure><img src="../../.gitbook/assets/2023-01-10_01-45.png" alt=""><figcaption><p>Setting notification profile</p></figcaption></figure>
