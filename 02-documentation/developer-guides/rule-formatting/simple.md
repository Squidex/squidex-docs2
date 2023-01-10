---
description: How to format rules with a custom built solution for basic use cases
---

# Simple

Hello "World"Hello "World"When we started to introduce placeholders we have defined a limited set of placeholders, but this system was too inflexible for our users. Therefore we introduced a new system with 4.2.0 to give you access to all properties.

The syntax is very easy:

```javascript
${<TYPE>_<PROPERTYAME>} or 
${<TYPE>_<PROPERTYAME> | filters} or 
$<TYPE>_<PROPERTYNAME>
```

The \<TYPE> is a prefix that has been used for backwards compatibility and you can use whatever you want, but our recommendation is to stick with prefixes that fit to the type of event, for example _content_ or _asset_. The \<PROPERTY> is the full path to the property in the event, for example:

* `$CONTENT_TYPE`: _Created_
* `$CONTENT_SCHEMAID.NAME`: _my-schema_
* `$CONTENT_DATA.CITY.en`: _Munich_

{% hint style="info" %}
Always use the first variant with the brackets ( { and } ) if possible.
{% endhint %}

## Special placeholders

Furthermore there are still some special placeholders for backwards compatibility or to give you access to information that are not directly part of the event.

| Event                 | Description                                                                                                                                      | New Alternative       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `$APP_ID`             | The id of your app (GUID).                                                                                                                       | `${EVENT_APPID.ID}`   |
| `$APP_NAME`           | The name of your app.                                                                                                                            | `${EVENT_APPID.NAME}` |
| `$USER_ID`            | The id of the user (or client).                                                                                                                  | `${EVENT_USER.ID}`    |
| `$USER_NAME`          | The display name of the user (or client name).                                                                                                   | `${EVENT_USER.NAME}`  |
| `$USER_EMAIL`         | The email address of the user (or client name).                                                                                                  | `${EVENT_USER.EMAIL`} |
| `$TIMESTAMP_DATE`     | The date when the event has happened (usually different from the time when the rule is executed) in the following format: `yyyy-MM-dd`.          |                       |
| `$TIMESTAMP_DATETIME` | The date when the event has happened (usually different from the time when the rule is executed) in the following format: `yyyy-MM-dd-hh-mm-ss`. |                       |

| Event             | Description                                        | New Alternative        |
| ----------------- | -------------------------------------------------- | ---------------------- |
| `$SCHEMA_ID`      | The name of the schema.                            | `${EVENT_SCHEMAID.ID}` |
| `$SCHEMA_NAME`    | The name of the schema.                            | `${EVENT_SCHEMAID.ID}` |
| `$CONTENT_URL`    | The URL to the content in the administration tool. |                        |
| `$CONTENT_ACTION` | The content action, e.g. _CityContentCreated_.     | `${EVENT_TYPE}`        |

#### Special Placeholders for Comment Events

| Event              | Description                              | New Alternative                 |
| ------------------ | ---------------------------------------- | ------------------------------- |
| `$MENTIONED_ID`    | The id of the mentioned user.            | `${EVENT_MENTIONEDUSER.ID}`     |
| `$MENTIONED_NAME`  | The display name of the mentioned user.  | `${EVENT_MENTIONEDUSER.NAME}`   |
| `$MENTIONED_EMAIL` | The email address of the mentioned user. | `${EVENT_MENTIONEDUSER.EMAIL}`S |

#### Special Placeholders for Asset Events

| Event        | Description                    |
| ------------ | ------------------------------ |
| `$ASSET_URL` | The download URL of the asset. |

## Functions

The simple syntax also supports a few functions filters when you use the new syntax:

```
${<TYPE>_<PROPERTYAME> | filters} 
```

The following table uses&#x20;

| Name            | Description                                                                                         | Example                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `lower`         | Converts the input to lowercase.                                                                    | <p><code>Hello World</code> </p><p>=> <code>hello world</code></p>            |
| `upper`         | Converts the output to uppercase.                                                                   | <p><code>Hello World</code> </p><p>=> <code>HELLO WORLD</code></p>            |
| `escape`        | Escapes the input to a JSON string.                                                                 | <p><code>Hello "World"</code><br>=> <code>Hello \"World\"</code></p>          |
| `slugify`       | Converts the input to a slow, which can only contain a-z0-9 and `-`.                                | <p><code>Hello World</code> </p><p>=> <code>hello-world</code></p>            |
| `trim`          | Removes whitespaces at the start and end of the input.                                              | <p> <code>Hello World</code> <br><code></code>=> <code>Hello World</code></p> |
| `timestamp`     | Parses the input as ISO8601 datetime string and converts it to a unix timestamp using milliseconds. | <p><code>2023-01-10T10:41:32</code><br>=> <code>1673347292000</code></p>      |
| `timestamp_sec` | Parses the input as ISO8601 datetime string and converts it to a unix timestamp using seconds.      | <p><code>2023-01-10T10:41:32</code><br>=> <code>1673347292</code></p>         |

You can also combine filters:

```
${CONTENT_DATA.CITY.en | uppercase | escape} 
```
