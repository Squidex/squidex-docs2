---
description: Localization allows you to define content in multiple languages.
---

# Localization

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../introduction-and-use-case.md)
{% endcontent-ref %}

## Basic concept

Localization is defined on a per field basis. We call this system partitioning, more about that [here](localization.md#why-do-you-call-it-partitioning).&#x20;

Referring to our _FoodCrunch_ use case, the **Description** field in the _startups_ schema is a _Localizable_ field.&#x20;

{% hint style="info" %}
Localization is set when adding a field and cannot be modified later.&#x20;
{% endhint %}

<figure><img src="../../.gitbook/assets/2022-11-09_19-49.png" alt=""><figcaption><p>Setting a field as Localizable</p></figcaption></figure>

### Languages

Before you can add localized content, you must add the additional languages you wish to support and their fallback settings. This is configured in the Management UI.

To add languages click **Settings** (1) and then select **Languages** (2). **Search** (3) for the desired language, select it and click **Add Language** (4).&#x20;

<figure><img src="../../.gitbook/assets/2022-11-12_09-07.png" alt=""><figcaption><p>Adding localization/ language support </p></figcaption></figure>

### Language Settings

There are three configurable parameters for the Languages used for localization.&#x20;

To modify or set these settings click on the **gear** icon next to the respective language.

<figure><img src="../../.gitbook/assets/2022-11-12_11-28.png" alt=""><figcaption><p>Modify language settings</p></figcaption></figure>

*   **Fallback** - This setting states that whenever a value for a localizable fields is not available Squidex tries to resolve the value from the master language which is the default fallback language. You can set more than one fallback language.\
    To set a fallback, select a language from the **dropdown** (1) (list only includes enabled languages) and click **Add Language** (2).

    <figure><img src="../../.gitbook/assets/2022-11-12_11-32.png" alt=""><figcaption><p>Adding a fallback language</p></figcaption></figure>

    The final screenshot for the Swedish language in our use case looks something like below. Reorder them to set the priority. To reorder, use the ![](<../../.gitbook/assets/Screenshot 2022-11-12 at 11.41.37 AM.png>)  icon and drag it up or down.\


    <figure><img src="../../.gitbook/assets/2022-11-12_11-34 (1).png" alt=""><figcaption><p>Set multiple fallback languages</p></figcaption></figure>

{% hint style="info" %}
Master language cannot have fallback languages and it cannot be Optional.
{% endhint %}

* **Is Master** - This is used to set if a language is the master language, meaning when another language has no value it displays the content in this language. English is the master language by default.
* **Is Optional** - This means that required fields can be omitted. This is useful when you introduce a new language. You can save contents with required fields even if the field value has not been entered for the optional language.

&#x20;Remember to click **Save** when done.

{% hint style="info" %}
A master language cannot be modified or deleted unless a different language is set as a the master language.
{% endhint %}

For our FoodCrunch use case, we have added the following languages along with their settings.&#x20;

| Name        | Code | Fallback       | Optional | Description                                                                                                                                                                                                                                                                    |
| ----------- | ---- | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **English** | `en` | -              | N/A      | Our master language. Whenever a fields is not available in a language it falls back to the master language.                                                                                                                                                                    |
| **Swedish** | `sv` | Not configured | Yes      | Swedish has no fallback language configured, therefore the fallback language is always English. This is an optional language.                                                                                                                                                  |
| **Finnish** | `fi` | `sv,en`        | Yes      | Finish has Swedish configured as a fallback language. This means that whenever a value for a localizable fields is not available Squidex tries to resolve the value from Swedish first and then from the master language (English). Finish is also marked as optional.         |
| **Italian** | `it` | `en`           | Yes      | Italian is a new language and has been added after the content editors have created most of the content. Therefore most content items do not have a value available. Since no fallback language is configured, English will be the fallback language. Italian is optional too. |

The final screenshot may look similar to the screenshot below.

<figure><img src="../../.gitbook/assets/Screenshot 2022-11-12 at 11.44.25 AM.png" alt=""><figcaption><p>Languages settings for FoodCrunch app.</p></figcaption></figure>

It is easy to understand when you have a look to an content object from the API:

```javascript
{ 
    "id": "01",
    "created": "2017-02-25T19:56:35Z",
    "createdBy": "...",
    "lastModified": "2017-02-25T19:56:35Z",
    "lastModifiedBy": "...",
    "data": {
        "name": {
            "en": "Copenhagen",
            "sv": "Köpenhamn",
            "fi": "Kööpenhamina",
            "it": undefined // Not part of the API response
        },
        "population": {
            "iv": 1400000
        }
    }
}
```

Each field value is a set of values that are associated to keys. In JavaScript it is called a `object`, other programming languages call it `HashMap` or `Dictionary`. The keys must be unique. Depending whether the field is localizable or not the API accepts different keys.

* The `population` field is not localizable. Therefore the only allowed key is `iv`, which stands for "invariant".
* The `name` field is localizable. The allowed keys are the language codes for the languages you have configured.

## How to use the API

### How to retrieve the correct languages?

The rest endpoint provides two headers that can be used to query the correct language.

#### X-Languages Header

You can filter the languages with the `X-Languages` header. Other languages will be omitted. We do not use the `Accept-Language` header because we want to avoid compatibility issues. If you define a language that is not supported, this language will be ignored. For example: If you set: `X-Languages: en,sv,de` for our example above you will only retrieve English (`en`) and Swedish (`sv`).

```javascript
X-Languages: en,sv,it
{ 
    ...,
    "data": {
        "name": {
            "en": "Copenhagen",
            "it": "Copenhagen"
        },
        "population": {
            "iv": 1400000
        }
    }
}
```

If none of the specified languages is provided you will retrieve the master language only.

```javascript
X-Languages: de
{ 
    ...,
    "data": {
        "name": {
            "en": "Copenhagen"
        },
        "population": {
            "iv": 1400000
        }
    }
}
```

#### X-Flatten Header

If you add this header, fields that only have a single value will be flattened. So the example above will be transformed to:

```javascript
X-Flatten: true
{ 
    ...,
    "data": {
        "name": {
            "de": "Copenhagen",
            "sv": "Köpenhamn"
        },
        "population": 1400000
    }
}
```

Both headers can be combined. If you define a single language with the `X-Languages` header the localizable fields will contain only one value each and therefore they can be flattened as well. If you provide an unsupported language you will just get the master language.

So our example from above might look like:

```javascript
X-Languages: de, X-Flatten: true
{ 
    ...,
    "data": {
        "name": "Copenhagen",
        "population": 1400000
    }
}
```

It basically means that you can just forward the user language and Squidex will handle the rest.

{% hint style="info" %}
The headers above are not supported by the GraphQL endpoint, because in graphql the output should be defined the query only.
{% endhint %}

### How to disable fallback languages?

If you want to do the fallback handling in your API, you can disable the behavior above. Add the following header to all your to all your requests: `X-NoResolveLanguages=1`

You will get the raw data then and some fields might not have a value for a language, for example when this language is new and nobody has entered a value yet:

```javascript
X-NoResolveLanguages: 1
{ 
    ...,
    "data": {
        "name": {
            "en": "Copenhagen",
            "sv": "Köpenhamn",
            "fi": "Kööpenhamina",
        },
        "population": {
            "iv": 1400000
        }
    }
}
```

## Why do you call it partitioning?

It basically means that the a value is partitioned into multiple subvalues. When we implemented the localization feature we realized that it might be very helpful to extend this feature to other type of keys, for example you could...

* ... define your prices for different currencies.
* ... write your texts for different countries.
* ... define customer groups.

So we implemented the localization feature with the idea in mind that we might extend it in coming versions.
