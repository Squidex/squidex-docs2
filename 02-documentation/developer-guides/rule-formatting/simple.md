---
description: How to Format Rules with a Custom-Built Solution for Basic Use Cases
---

# Simple

When we started to introduce placeholders we defined limited sets of placeholders, but the system was just too inflexible for users. To make it more flexible, a new system was introduced, with 4.2.0.  This gives access to all properties.&#x20;

The syntax is very easy:

```javascript
${<TYPE>_<PROPERTYAME>} or 
${<TYPE>_<PROPERTYAME> | filters} or 
$<TYPE>_<PROPERTYNAME>
```

The `<TYPE>` is a prefix that has been used for backwards compatibility and users may use whatever they want but the best recommendation is to use prefixes that fit the type of event, for example, _content_ or _asset_. The `<PROPERTY>` is the full path to the property in the event, for example:

* `$CONTENT_TYPE`: _Created_
* `$CONTENT_SCHEMAID.NAME`: _my-schema_
* `$CONTENT_DATA.CITY.en`: _Munich_

{% hint style="info" %}
If possible, always use the first variant with the brackets ( { and } ).
{% endhint %}

## Special Placeholders

Furthermore, there are still some special placeholders for backwards compatibility or to grant access to information that is not directly part of the event.

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

<table><thead><tr><th>Event</th><th width="247.33333333333331">Description</th><th>New Alternative</th></tr></thead><tbody><tr><td><code>$MENTIONED_ID</code></td><td>The id of the mentioned user.</td><td><code>${EVENT_MENTIONEDUSER.ID}</code></td></tr><tr><td><code>$MENTIONED_NAME</code></td><td>The display name of the mentioned user.</td><td><code>${EVENT_MENTIONEDUSER.NAME}</code></td></tr><tr><td><code>$MENTIONED_EMAIL</code></td><td>The email address of the mentioned user.</td><td><code>${EVENT_MENTIONEDUSER.EMAIL}</code>S</td></tr></tbody></table>

#### Special Placeholders for Asset Events

| Event        | Description                    |
| ------------ | ------------------------------ |
| `$ASSET_URL` | The download URL of the asset. |

## Filters

This simple syntax also supports a few function filters when using the new syntax:

```
${<TYPE>_<PROPERTYAME> | filters} 
```

The following table uses:

<table><thead><tr><th width="189">Name</th><th width="277">Description</th><th>Example</th></tr></thead><tbody><tr><td><code>lower</code></td><td>Converts the input to lowercase.</td><td><p><code>Hello World</code> </p><p>=> <code>hello world</code></p></td></tr><tr><td><code>upper</code></td><td>Converts the output to uppercase.</td><td><p><code>Hello World</code> </p><p>=> <code>HELLO WORLD</code></p></td></tr><tr><td><code>escape</code></td><td>Escapes the input to a JSON string.</td><td><code>Hello "World"</code><br>=> <code>Hello \"World\"</code></td></tr><tr><td><code>slugify</code></td><td>Converts the input to a slow, which can only contain a-z0-9 and <code>-</code>.</td><td><p><code>Hello World</code> </p><p>=> <code>hello-world</code></p></td></tr><tr><td><code>trim</code></td><td>Removes whitespaces at the start and end of the input.</td><td> <code>Hello World</code> <br>=> <code>Hello World</code></td></tr><tr><td><code>timestamp</code></td><td>Parses the input as ISO8601 datetime string and converts it to a unix timestamp using milliseconds.</td><td><code>2023-01-10T10:41:32</code><br>=> <code>1673347292000</code></td></tr><tr><td><code>timestamp_sec</code></td><td>Parses the input as ISO8601 datetime string and converts it to a unix timestamp using seconds.</td><td><code>2023-01-10T10:41:32</code><br>=> <code>1673347292</code></td></tr></tbody></table>

Filters can also be combined:

```
${CONTENT_DATA.CITY.en | uppercase | escape} 
```
