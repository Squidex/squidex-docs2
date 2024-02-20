---
description: >-
  Subscriptions are Used to Manage the Billing and Usage Information for Squidex
  Cloud.
---

# Subscriptions

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../../../02-documentation/introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../../02-documentation/introduction-and-use-case.md)
{% endcontent-ref %}

In Squidex Cloud (i.e. cloud.squidex.io) each App has a subscription and each subscription has a quota, which is a defined number of the following:

* API Calls.
* API Traffic.
* Asset Storage Size.
* Number of Contributors.

Subscriptions can be managed in one of two ways:

* **Per App:** The user who creates the subscription owns the subscription and can make changes. The included resources are exclusive to the App.
* **Per Team:** The subscription applies to all Apps belonging to the team. All team _contributors_ own the subscription and can make changes. The included resources are shared between all the team's Apps.

## Frequently Asked Questions

### How Can I Subscribe to a Paid Plan for an App?

To subscribe to a paid plan a credit card is required. Other payment methods are currently not supported.

Follow the steps below to subscribe to a paid plan:

1. Go to the App.
2. Click **Settings**.
3. Next, select **Subscription** from settings.
4. Click the **Change** button next to the plan that meets your usage requirements.

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-05-03_20-43.png" alt=""><figcaption><p>Subscribe to a paid plan for the App</p></figcaption></figure>

</div>

### How Can I Subscribe to a Paid Plan for a Team?

You can create a team to share a subscription between Apps and allow multiple users to change the subscription.

Follow the steps below to subscribe to a paid plan for a team:

1. Click the _Apps and Teams_ drop down and select your team (1).
2. Go to **Settings**.
3. Select **Subscription**.
4. Click the **Change** button next to the plan that meets your usage requirements.

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-05-03_20-26.png" alt=""><figcaption><p>Subscribe to a paid plan for a team</p></figcaption></figure>

</div>

### Can Every Contributor Subscribe to a Paid Plan?

**Yes.** When you subscribe to a plan, a new customer is created in the billing system under your name and only the user who subscribed to the plan can cancel the subscription or move over to another plan.

### Why is an App Bound to a Single User?

Some companies manage multiple Apps. When the first version of the billing system was created, the teams' concept had not yet been introduced. Therefore, the billing system has been built in such a way that a single user is able to manage multiple subscriptions under one customer account.

### What Can I do if the Subscription Creator has Left the Company?

Only the subscription creator can delete or change a subscription. However, we can cancel the subscription for you in our Back Office. To do this, create a support ticket in the [support forum](https://support.squidex.io/) and we will cancel the subscription. **On cancelling the subscription, your App will fall back to the free plan but no data will be lost.** All contributors and assets are retained as they are, even if they exceed the limits of the free plan. However, it is possible that API might be blocked when you move beyond your monthly limit. Therefore, it is best to initiate this process at the beginning of the month.

### What Happens when I Exceed the API Limits?

The API limits include contingencies in each plan. If you exceed the API limit, you will be charged 0.2€ / 1000 API calls additionally at the end of the month, along with your last active plan.&#x20;

In addition to this, each paid plan has a maximum limit of three times the default API limit. The table below explains this:

<table><thead><tr><th width="145">Plan</th><th width="173">Included API Limit</th><th width="180">Blocking API Limit</th><th>Additional Cost</th></tr></thead><tbody><tr><td>Free</td><td>20,000</td><td>20,000</td><td>N/A</td></tr><tr><td>Basic</td><td>100,000</td><td>300,000</td><td>0.2€ / 1000 API calls after 100,000</td></tr><tr><td>Professional</td><td>500,000</td><td>1,500,000</td><td>0.2€ / 1000 API calls after 500,000</td></tr><tr><td>Business</td><td>1,500,000</td><td>4,500,000</td><td>0.2€ / 1000 API calls after 1,500,000</td></tr></tbody></table>

When this maximum limit is reached, API calls are blocked, but we will inform you if we foresee this happening.

### How Can I Change My Credit Card or Contact Information?

Squidex provides access to a billing portal for this purpose. Using this portal you can do the following:

1. View and manage all your subscriptions.
2. View and manage general account information.
3. View and change the billing address.
4. View and change payment methods.
5. View payment history and download invoices.

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-05-04_00-06.png" alt=""><figcaption><p>Billing portal</p></figcaption></figure>

</div>

To access the Billing Portal, navigate to **Subscription** in **Settings** and click the **Billing Portal** link at the bottom of the page.

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-05-03_20-56.png" alt=""><figcaption><p>Link to the billing portal</p></figcaption></figure>

</div>
