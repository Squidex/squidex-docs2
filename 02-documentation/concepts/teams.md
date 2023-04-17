---
description: >-
  A Team is Used to Group Apps for Sharing a Subscription and for Easier
  Management
---

# Teams

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../introduction-and-use-case.md)
{% endcontent-ref %}

Teams are primarily beneficial for the Squidex Cloud where an organization has multiple Apps and wishes to share the subscription.

The _Teams_ capability solves the following problems:

* Generally, subscriptions are associated with the single user who creates it. So, in a situation where this it must be transferred to another user, it can be inconvenient.
* Since subscriptions are bound to a single App, it cannot be shared among multiple Apps for scenarios such as grouping and distributing the cost amongst Apps.&#x20;

### Creating a Team

To create a team, click **Apps and Team** (1) and click **Create Team** (2).

<figure><img src="../../.gitbook/assets/2023-03-17_19-23.png" alt=""><figcaption><p>Creating a Team - Step 1</p></figcaption></figure>

Next, enter a **Name** (3) for the team and click **Create** (4).

<figure><img src="../../.gitbook/assets/2023-03-17_19-24.png" alt=""><figcaption><p>Creating a Team - Step 2</p></figcaption></figure>



### Managing Subscriptions

In order to manage subscriptions for a team, navigate to **Settings** (1) and then click **Subscription** (2).

<figure><img src="../../.gitbook/assets/2023-03-20_22-42.png" alt=""><figcaption><p>Managing subscription</p></figcaption></figure>

A subscription is shared among all Apps in the team.

### Transferring an App to a Team

Once a team is created, you can move an App to the team. To do so, navigate to the App, click **Settings** (1) and then more **Settings** (2). Then, select the team from the dropdown under **Transfer to team** (3) and click **Transfer** (4).

<figure><img src="../../.gitbook/assets/2023-03-20_22-51 (2).png" alt=""><figcaption><p>Transferring an app to a team</p></figcaption></figure>

{% hint style="info" %}
Only when a user has permissions for the App and the team, can they transfer the App to the team.
{% endhint %}

At this point, you won't see a confirmation or the screen won't change. A way to verify that the App has moved to a team is to check in your Welcome dashboard or on the Team dashboard.&#x20;

In this example, we moved the _FoodCrunch_ App to the _FoodCrunch_ team.

<figure><img src="../../.gitbook/assets/2023-03-20_23-04.png" alt=""><figcaption><p>App part of a team</p></figcaption></figure>

Once an App has moved to a team, the subscription for the App can only be managed by the team.

<figure><img src="../../.gitbook/assets/2023-03-20_23-27.png" alt=""><figcaption><p>Subscription management of app</p></figcaption></figure>

### Managing Quota (for Multiple Apps)

As a Subscription is shared among all Apps that are part of the team, the quota for a subscription is also shared.&#x20;

If you wish to limit API calls for certain Apps (e.g. to protect your API contingent for other Apps that are more important), you can set the Max API Calls parameter for each client in an App.

<figure><img src="../../.gitbook/assets/2023-03-20_23-42.png" alt=""><figcaption><p>Setting API limits for clients</p></figcaption></figure>

### Team Dashboard

Every team has a dashboard similar to an App and displays the same statistics, including the Apps associated with the team.

<figure><img src="../../.gitbook/assets/2023-03-20_23-16.png" alt=""><figcaption><p>Team Dashboard</p></figcaption></figure>

### Deleting a Team

At the moment a team cannot be deleted.

### Other Important Information About Teams

* You can add contributors to a team but there is no provision for roles at the moment.&#x20;
* A team contributor can only manage the subscription of the team and does not have automatic access to associated Apps.

