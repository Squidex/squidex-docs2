---
description: How to Use Scripting or Placeholders to Control the Output of Rules
---

# Rule Formatting

This Page Explains the Rule Formatting System in Detail.

To gain an understanding of the rule system, read the following page:

{% content-ref url="../../concepts/rules/" %}
[rules](../../concepts/rules/)
{% endcontent-ref %}

## Introduction

Rule formatting is used to format your custom payloads in rule actions, for example, when you use email actions and you want to use certain values from the event that's inside the email subject or body.

To gain an understanding of what can be done with the rule system let's have a look at an event.

The example below is a full content event that has been triggered following creation of a new item:

```javascript
{
    "id": "123...", // Id of the content.
    "actor": { "type": "subject", "id": "123..." }, // Id of the user
    "appId": { "name": "my-app", "id": "123..." }, // App name and id
    "created": "2018-01-01T12:00:00Z",
    "createdBy":  { "type": "subject", "id": "123..." },
    "data": { // Content data
        "city": {
            "en": "Munich",
            "de": "München"
        },
        "population": {
            "iv": 123000
        }
    },
    "lastModified": "2018-01-01T12:00:00Z",
    "lastModifiedBy": { "type": "subject", "id": "123..." },
    "schemaId": { "name": "my-schema", "id": "123..." }, // Schema id
    "status": "Draft", // Status of the content: Draft, Archived, Published
    "timestamp": "2018-01-01T12:00:00Z",
    "type": "Created", // The type of the event.
    "user": { // The user information.
        "id": "123...",
        "name": "John Doe",
        "email": "john@email.com"
    },
    "version": 1 // Version of the content, increased with any operation
}
```

## Formatting Options

The rule formatter grants access to all of this event's properties.

At the moment, there are three options for formatting:

{% content-ref url="simple.md" %}
[simple.md](simple.md)
{% endcontent-ref %}

{% content-ref url="script.md" %}
[script.md](script.md)
{% endcontent-ref %}

{% content-ref url="liquid.md" %}
[liquid.md](liquid.md)
{% endcontent-ref %}

The syntax is selected based on the value of the rule property.

* If a value follows the format `Liquid(<Template>)`, then `Template` is interpreted as a liquid syntax. It is interpreted using a template engine.
* If a value follows the format `Script(<Script>)`, then `Script` is interpreted as Javascript expression and interpreted using a scripting engine.
* If none of the syntaxes above are detected, the value is interpreted as simple formatting.  Therefore, it is interpreted using a built-in solution.

In newer versions of Squidex, the user interface has been improved and custom input fields have been introduced which allows you to select the syntax and automatically add the necessary prefix.

<div align="left">

<img src="../../../.gitbook/assets/image (68).png" alt="Custom Editors for rules">

</div>



{% hint style="info" %}
The liquid syntax is the most powerful and easiest option, which is why it is recommended for most user cases.
{% endhint %}
