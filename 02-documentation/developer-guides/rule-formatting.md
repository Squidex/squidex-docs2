---
description: How to use scripting or placeholders to control the output of rules.
---

# Rule Formatting

This page explains the rule formatting system in detail.   
To get an understanding of the rule system read the following page:

{% page-ref page="../concepts/rules.md" %}

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

## Formatting

The rule formatter gives us access to all properties of this events. Their are two ways how you can use the formatter:

1. Simple placeholders
2. Javascript expressions that usually return a string.

### Placeholders

When we started to introduce placeholders we have defined a limited set of placeholders, but this system was too inflexible for our users. Therefore we introduced a new system with 4.2.0 to give you access to all properties.

The syntax is very easy:

```javascript
${<TYPE>_<PROPERTYAME>} or $<TYPE>_<PROPERTYNAME>
```

The &lt;TYPE&gt; is a prefix that has been used for backwards compatibility and you can use whatever you want, but our recommendation is to stick with prefixes that fit to the type of event, for example _content_ or _asset_. The &lt;PROPERTY&gt; is the full path to the property in the event, for example:

* `$CONTENT_TYPE`: _Created_
* `$CONTENT_SCHEMAID.NAME`: _my-schema_
* `$CONTENT_DATA.CITY.en`: _Munich_

{% hint style="info" %}
Always use the first with the brackets \( `{` and `}` \) if possible.
{% endhint %}

Furthermore there are still some special placeholders for backwards compatibility or to give you access to information that are not directly part of the event.

| Event | Description | New Alternative |
| :--- | :--- | :--- |
| `$APP_ID` | The id of your app \(GUID\). | `${EVENT_APPID.ID}` |
| `$APP_NAME` | The name of your app. | `${EVENT_APPID.NAME}` |
| `$USER_ID` | The id of the user \(or client\). | `${EVENT_USER.ID}` |
| `$USER_NAME` | The display name of the user \(or client name\). | `${EVENT_USER.NAME}` |
| `$USER_EMAIL` | The email address of the user \(or client name\). | `${EVENT_USER.EMAIL`} |
| `$TIMESTAMP_DATE` |  The date when the event has happened \(usually different from the time when the rule is executed\) in the following format: `yyyy-MM-dd`. |  |
| `$TIMESTAMP_DATETIME` | The date when the event has happened \(usually different from the time when the rule is executed\) in the following format: `yyyy-MM-dd-hh-mm-ss`. |  |

| Event | Description | New Alternative |
| :--- | :--- | :--- |
| `$SCHEMA_ID` | The name of the schema. | `${EVENT_SCHEMAID.ID}` |
| `$SCHEMA_NAME` | The name of the schema. | `${EVENT_SCHEMAID.ID}` |
| `$CONTENT_URL` |  The URL to the content in the administration tool. |  |
| `$CONTENT_ACTION` | The content action, e.g. _CityContentCreated_. | `${EVENT_TYPE}` |

#### Special Placeholders for Comment Events

| Event | Description | New Alternative |
| :--- | :--- | :--- |
| `$MENTIONED_ID` | The id of the mentioned user. | `${EVENT_MENTIONEDUSER.ID}` |
| `$MENTIONED_NAME` | The display name of the mentioned user. | `${EVENT_MENTIONEDUSER.NAME}` |
| `$MENTIONED_EMAIL` | The email address of the mentioned user. | `${EVENT_MENTIONEDUSER.EMAIL}`S |

#### Special Placeholders for Asset Events

| Event | Description |
| :--- | :--- |
| `$ASSET_URL` | The download URL of the asset. |

### Javascript Expressions

Furthermore you can also use javascript expressions with the following syntax:

```text
Script(<YOUR_SCRIPT>)
```

[Javascript template string](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/template_strings) are very useful here. The placeholders above can be translated to the following expressions:

```javascript
Script(`${event.appId.id}`)
Script(`${event.appId.Name}`)
Script(`${event.user.id}`)
Script(`${event.user.email}`)
Script(`${formatDate(event.user.timestamp, 'yyyy-MM-dd')}`)
Script(`${formatDate(event.user.timestamp, 'yyyy-MM-dd-hh-mm-ss')}`)

// For content events
Script(`${event.schemaId.id}`)
Script(`${event.schemaId.Name}`)
Script(`${contentUrl()}`)
Script(`${contentAction()}`)
Script(`${event.data.city.de}`)
```

You can also reference any other field from the event and you can use if-statements and other JavaScript language features.

In the following example we create different payloads depending on the asset size.

```javascript
Script(
    if (event.fileSize > 100000) {
        return `I just uploaded a large image ${event.fileName}`;
    } else {
        return `I just uploaded a small image ${event.fileName}`;
    }
)
```

