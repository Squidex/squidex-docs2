---
description: Learn About Field Rules in Squidex
---

# Field Rules

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../introduction-and-use-case.md)
{% endcontent-ref %}

A Field Rule is a method of implementing automated actions on schema fields when a certain condition is met. It is made up of three components as follows:

* **Action**: This component states what should be done when the condition(s) is/are met. It has the following options:
  * Disable
  * Hide
  * Require
* **Field**: This relates to when the schema field is selected dependent upon which action should be taken.
* **Condition**: Written in Javascript, this action is triggered when the condition is met.

For our _FoodCrunch_ user case let's consider the following example to understand Field Rules. For all startups that are not in `Pre-Seed` stage, the funding value must be mentioned. It is therefore a required field.

For our use case, the rule is that anytime the value of the **Stage** field is anything other than `Pre-Seed`, then the **Funding** is a required field, otherwise it's optional.&#x20;

Let's see how to implement this:

* Ensure that the **Validation** (2) of the **Stage** (1) field is set to **Required** (3) in the settings. This is necessary to make sure that a value is always selected.&#x20;

<figure><img src="../../../.gitbook/assets/2022-11-30_17-58.png" alt=""><figcaption><p>Setting validation for a field</p></figcaption></figure>

* To create a Field Rule, go to the **Schema** (1) (i.e. in our case `startups`), select the **More** (2) tab, click **+** (3) under Field Rules and enter the selections for **Action, Field and Condition** (4). Click **Save** (5) when done.\
  \
  In our example the following values have been set:
  1. Action = `Require`
  2. Field = `funding`
  3. Condition (in Javascript) = `data.stage.iv != 'Pre-Seed'`

<figure><img src="../../../.gitbook/assets/2022-11-30_18-06.png" alt=""><figcaption><p>Creating a Field Rule</p></figcaption></figure>

* This can now be validated by trying to add content. Go to **Content** and try adding content. Immediately you will find that the stage and funding fields have a red flag.

<figure><img src="../../../.gitbook/assets/2022-11-30_18-28.png" alt=""><figcaption><p>Fields with rules</p></figcaption></figure>

* If you set **stage** as `Pre-Seed`, the red flag denoting that the **funding** value is required will disappear, which means its optional.\


<figure><img src="../../../.gitbook/assets/2022-11-30_18-29.png" alt=""><figcaption><p>Rule validation example 1</p></figcaption></figure>

* If you set **stage** as any other value, the red flag remains meaning that a value has to be entered in **funding**.\


<figure><img src="../../../.gitbook/assets/2022-11-30_18-29_1.png" alt=""><figcaption><p>Rule validation example 2</p></figcaption></figure>

