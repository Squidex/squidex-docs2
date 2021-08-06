---
description: How to use scripting or placeholders to control the output of rules.
---

# Rule Formatting

This page explains the rule formatting system in detail.   
To get an understanding of the rule system read the following page:

{% page-ref page="../../concepts/rules.md" %}

## Introduction

The rule formatting is used to format your custom payloads in rule actions, for example when you use email actions and you want to use certain values from the event inside the email subject or body.

To get an understanding what we can do with the rule system we need to have a look to an event.

This example is a full content event that has been triggered when a new content item has been created.

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

The rule formatter gives us access to all properties of this events. 

At the moment there are 3 options for formatting:

{% page-ref page="simple.md" %}

{% page-ref page="script.md" %}

{% page-ref page="liquid.md" %}

The syntax is selected based on the value of the rule property.

* If a value follows the format `Liquid(<Template>)`, then `Template` is interpreted as liquid syntax.
* If a value follows the format `Script(<Script>)`, then `Script`is interpreted as Javascript.
* If none of the syntaxes above is detected, the value is interpreted as simple formatting.

In newer versions of Squidex custom input fields and text areas have been introduced, which add the correct prefix and suffix automatically:  


![Custom Editors for rules](../../../.gitbook/assets/image%20%2820%29.png)

1. Simple placeholders
2. Javascript expressions that usually return a string.

{% hint style="info" %}
The liquid syntax is the most powerful but still easy option and therefore recommended for most use cases.
{% endhint %}

### 

### Javascript Expressions

F

