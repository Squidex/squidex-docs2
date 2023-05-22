---
description: This Page Describes the Dashboard Page and How to Customize it
---

# Dashboard

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../introduction-and-use-case.md)
{% endcontent-ref %}

Apps in Squidex use a dashboard that displays various statistics concerning the App along with some quick links to operations, as well as some external links.

The default view of the dashboard shows the following statistics as cards:

* API Calls.
* API Performance (ms).
* API Calls Summary.
* Asset Uploads.
* Assets Size (MB).
* Traffic (MB).
* History.

<div align="left">

<figure><img src="../../.gitbook/assets/2023-03-10_00-46.png" alt=""><figcaption><p>Squidex App Dashboard</p></figcaption></figure>

</div>

{% hint style="info" %}
All assets are **anonymous**, this means you may see anonymous API Calls, Traffic or API performance statistics even though there may be no anonymous access.
{% endhint %}

### Customizing the Dashboard

#### Adding / Removing cards

In order to customize the dashboard, click on **Settings** (the gear icon) situated at the top-right of the page.

<div align="left">

<figure><img src="../../.gitbook/assets/2023-03-10_00-48.png" alt=""><figcaption><p>Customizing the dashboard</p></figcaption></figure>

</div>

To remove a card or statistic, **uncheck** it from the list. To add a statistic, **check** it.

#### Resizing cards

The individual cards can also be resized to suit personal preference. To resize, move the mouse over to the bottom-right corner of the card to reveal the resize control.&#x20;

<div align="left">

<figure><img src="../../.gitbook/assets/2023-03-08_19-21.png" alt=""><figcaption><p>Resize a card</p></figcaption></figure>

</div>

Next, press and hold the pointer (mouse or touchpad) and drag it left or right to resize.

<div align="left">

<figure><img src="../../.gitbook/assets/2023-03-08_19-24.png" alt=""><figcaption><p>Resized card</p></figcaption></figure>

</div>

#### Changing Graph View&#x20;

Some statistics can be viewed in both grouped mode (default) and in stacked mode. To toggle, click the **Stacked** check box on the card.&#x20;

<div>

<figure><img src="../../.gitbook/assets/2023-03-10_00-59.png" alt=""><figcaption><p>Grouped view</p></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/2023-03-10_00-59_1.png" alt=""><figcaption><p>Stacked view</p></figcaption></figure>

</div>

{% hint style="info" %}
Changing the view of any card to Stacked changes it for all cards.
{% endhint %}

#### Filtering

You can filter clients from a metric. This is done by clicking the name which strikes it off so it is no longer displayed on the card.&#x20;

For example, in the following screenshot default, reader and Squidex frontend clients are disabled and only anonymous traffic size is displayed.

<div align="left">

<figure><img src="../../.gitbook/assets/2023-03-10_01-34.png" alt=""><figcaption><p>Filter clients from a metric</p></figcaption></figure>

</div>

### Expert Mode

An **Expert Mode** is also available (choose from the Settings icon) if you wish to modify it through code.

<figure><img src="../../.gitbook/assets/2023-03-08_19-29.png" alt=""><figcaption><p>Expert Mode</p></figcaption></figure>

### Downloading API Logs

API logs can be downloaded in a CSV format from the dashboard page too. To do so, click on the **Download Log** link on the **API Calls** card.&#x20;

<div align="left">

<figure><img src="../../.gitbook/assets/2023-03-10_00-52.png" alt=""><figcaption><p>Download API Calls Logs</p></figcaption></figure>

</div>

Additional operations that can be completed from the dashboard include:

* Navigate to Create Schema page.&#x20;
* View the API documentation for the App.
* Navigate to [Support](https://support.squidex.io/) page for feedback and support.
* Navigate to the source code on GitHub.
