---
description: This page describes the Dashboard page and how to customize it.
---

# Dashboard

Apps in Squidex have a dashboard that shows various statistics about the app along with some quick links to operations and external links.

The default view of the dashboard shows the following statistics as cards:

* API Calls
* API Performance (ms)
* API Calls Summary
* Asset Uploads
* Assets Size (MB)
* Traffic (MB)
* History

<figure><img src="../../.gitbook/assets/2023-03-10_00-46.png" alt=""><figcaption><p>Squidex App Dashboard</p></figcaption></figure>

{% hint style="info" %}
All assets are **anonymous**, hence you may see anonymous API Calls, Traffic or API Performance statistics even though there may be no anonymous access.
{% endhint %}

### Customizing the dashboard

#### Adding / Removing cards

In order to customize the dashboard, click on **settings** (gear icon) icon to the top-right of the page.

<figure><img src="../../.gitbook/assets/2023-03-10_00-48.png" alt=""><figcaption><p>Customizing the dashboard</p></figcaption></figure>

To remove a card or statistic **uncheck** it from the list. And to add a statistic **check** it.

#### Resizing cards

The individual cards can also be resized to preference. To resize move the mouse over to the bottom-right corner of the card to reveal the resize control.&#x20;

<figure><img src="../../.gitbook/assets/2023-03-08_19-21.png" alt=""><figcaption><p>Resize a card</p></figcaption></figure>

Then press and hold the pointer (mouse or touchpad) and drag it left or right to resize.

<figure><img src="../../.gitbook/assets/2023-03-08_19-24.png" alt=""><figcaption><p>Resized card</p></figcaption></figure>

#### Changing graph view&#x20;

Some statistics can be viewed in both grouped mode (default) and also in stacked mode. To toggle, click the **Stacked** check box on the card.&#x20;

<div>

<figure><img src="../../.gitbook/assets/2023-03-10_00-59.png" alt=""><figcaption><p>Grouped view</p></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/2023-03-10_00-59_1.png" alt=""><figcaption><p>Stacked view</p></figcaption></figure>

</div>

{% hint style="info" %}
Changing the view of any card to Stacked changes it for all cards.
{% endhint %}

#### Filtering

You can filter the clients from a metric. This is done by clicking the name which strikes it off and it is no longer displayed on the card.&#x20;

For example, in the following screenshot default, reader and squidex-frontend clients are disabled and only anonymous traffic size is displayed.

<figure><img src="../../.gitbook/assets/2023-03-10_01-34.png" alt=""><figcaption><p>Filter clients from a metric</p></figcaption></figure>

### Expert Mode

An **Expert Mode** is also available (choose from the settings icon) if you wish to modify it through code.

<figure><img src="../../.gitbook/assets/2023-03-08_19-29.png" alt=""><figcaption><p>Expert Mode</p></figcaption></figure>

### Downloading API Logs

One can download the API logs in a CSV format from the dashboard page too. To do so, click on the **Download Log** link on the **API Calls** card.&#x20;

<figure><img src="../../.gitbook/assets/2023-03-10_00-52.png" alt=""><figcaption><p>Download API Calls Logs</p></figcaption></figure>

Additional operations that can be done from the dashboard include:

* Navigate to Create Schema page&#x20;
* View the API documentation for the app
* Navigate to [support](https://support.squidex.io/) page for feedback and support
* Navigate to the source code on GitHub
