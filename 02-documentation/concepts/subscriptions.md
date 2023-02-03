---
description: >-
  Subscriptions are used to manage the billing and usage information for Squidex
  Cloud.
---

# Subscriptions

In Squidex Cloud (i.e. cloud.squidex.io) each App has a subscription. And each subscription has a quota which is a defined number of the following:

* API Calls
* API Traffic
* Asset Storage Size
* Number of contributors

Subscriptions can be managed in one of the two ways:

* **Per App:** The user who creates the subscription owns the subscription and can make changes. The included resources are exclusive for the app.
* **Per Team:** The subscription applies to all apps of this team. All team _contributors_ own the subscription and can make changes. The included resources are shared between all the apps of the team.

## Frequently Asked Questions

### How can I subscribe to a paid plan for an App?

To subscribe to a paid plan a credit card is required. Other payment methods are currently not supported.

Follow the steps below to subscribe to a paid plan.

1. Go to the app.
2. Click **Settings**.
3. Next, select **Subscription** from the settings.
4. Click the **Change** button next to the plan that meets your usage requirements.

<figure><img src="../../.gitbook/assets/image (13).png" alt=""><figcaption><p>Subscribe to a plan</p></figcaption></figure>

### How can I subscribe to a paid plan for a Team?

You can create a team to share a subscription between apps and allow multiple users to change the subscription.

Follow the steps below to subscribe to a paid plan for a team.

1. Click the _Apps and Teams_ drop down.
2. Select your team.
3. Go to **Settings**.
4. Select **Subscription**.
5. Click the **Change** button next to the plan that meets your usage requirements.

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption><p>Subscribe to a plan</p></figcaption></figure>

### Can every contributor subscribe to a paid plan?

**Yes.** When you subscribe to a plan a new customer is created in the billing system under your name and only the user who subscribed to the plan can cancel the subscription or move to another plan.

### Why is an app bound to a single user?

Some companies manage multiple apps. When the first version of the billing system was created, the concept of teams was not yet introduced. Therefore, the billing system was built in such a way that a single user can manage multiple subscriptions under one customer account.

### What can I do if the subscription creator has left the company?

Only the subscription creator can delete or change a subscription. But we can cancel the subscription for you in our BackOffice. To do this, create a support ticket in the [support forum](https://support.squidex.io/) and we can cancel the subscription. _On cancelling the subscription, the app falls back to the free plan but no data is lost._ All contributors and assets are retained as it is, even if they exceed the limits of the free plan. But its possible that API calls get blocked when you cross over the limit for the month. Therefore it is recommended that this process be initiated at the beginning of a month.

### What happens when I exceed the API limits?

The API limits include contingencies in each plan. If you exceed the API limits, you are charged 0.2€ / 1000 API calls additionally along with your last active plan at the end of the month.&#x20;

In addition to this, each paid plan has a max limit of three times the default API limit. The below table explains this better.

| Plan         | Included API Limit | Blocking API Limit | Additional Cost                       |
| ------------ | ------------------ | ------------------ | ------------------------------------- |
| Free         | 20,000             | 20,000             | N/A                                   |
| Basic        | 100,000            | 300,000            | 0.2€ / 1000 API calls after 100,000   |
| Professional | 500,000            | 1,500,000          | 0.2€ / 1000 API calls after 500,000   |
| Business     | 1,500,000          | 4,500,000          | 0.2€ / 1000 API calls after 1,500,000 |

When this maximum limit is reached the API calls get blocked, but we will inform you when we foresee this.

### How can I change my credit card or contact information?

Squidex provides access to a billing portal for this. Using this portal you can do the following:

1. View and manage all your subscriptions.
2. View and manage general account information.
3. View and change billing address.
4. View and change payment methods.
5. View the payment history and download invoices.

![Billing portal](<../../.gitbook/assets/image (17) (1) (1) (1).png>)

To access the Billing Portal, navigate to _Subscription_ in _Settings_ and click **Billing Portal** link at the bottom of the page.

<figure><img src="../../.gitbook/assets/image (2) (1).png" alt=""><figcaption><p>Link to the billing portal</p></figcaption></figure>
