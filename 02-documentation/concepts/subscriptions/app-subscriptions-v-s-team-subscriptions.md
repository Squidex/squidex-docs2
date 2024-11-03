---
description: >-
  Common differences between app and team subscriptions, and frequently asked
  questions
---

# App Subscriptions v/s Team Subscriptions

{% hint style="info" %}
Subscriptions apply to Squidex Cloud only.
{% endhint %}

Teams were introduced to solve problems with sharing costs and changing subscription ownership. This article tries to provide differences between _App Subscriptions_ and _Teams Subscriptions_ and answer some of the frequently asked questions. &#x20;

Let's start with a table provides a difference between App Subscriptions and Team Subscriptions

<table data-full-width="false"><thead><tr><th width="375">(Single) App Subscriptions</th><th>Team Subscriptions</th></tr></thead><tbody><tr><td>Each App has its own subscription.</td><td>Multiple Apps that are part of a Team share the subscription.</td></tr><tr><td>Contributors in an App with the role "owner" are not subscription owners. Only the contributor that created the subscription is the owner.</td><td>All contributors of a team are subscription owners as well.</td></tr><tr><td>App subscription ownership cannot be transferred to another contributor</td><td>Subscription transfer issues do not apply to teams.</td></tr></tbody></table>

{% hint style="info" %}
Note that App owner and Subscription owner is not the same, especially in App settings where you can add more than one owner, these owners are App owners.&#x20;
{% endhint %}

## Frequently Asked Questions (FAQs) about _App Subscriptions_

### How can I transfer an _app subscription_ ownership to another user?

Unfortunately, **subscription ownership transfer in Apps is not possible**. You can only cancel the subscription, which does not delete any data.

### What happens when the _app subscription_ owner leaves the company?

Create a support request at [https://support.squidex.io/](https://support.squidex.io/) to get it cancelled. **On cancelling the subscription, the App will fall back to the free plan but no data will be lost.** Please remember that you cannot add new members anymore, because the limits of the free plan apply.

### What happens if there is some money left in the _app subscription_?

Start with a subscription cancellation request first. You can then subscribe to the cheapest plan and create a support request to get promotional credit for your balance. When you change your new subscription to the target plan the promotional credit will be applied and deducted from your invoice.

### Can I apply usage restrictions to an app in a shared subscription?

There is no system in place to restrict the usage for a single app. But if you go the client settings of your app you can configure a limit for the number of API calls that a single client can make. Use this setting to ensure that one app does not dry out other apps.

### Can an app be moved to a team with a different subscription plan?&#x20;

(For example app subscription is _Professional_, where as teams subscription is _Basic_)\
Unfortunately **No**. The process is to cancel the current subscription for the App first and the move the App into the Team. Otherwise the applied limits would be inconsistent and confusing.

