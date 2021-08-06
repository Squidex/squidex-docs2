---
description: How to format rules with Javascript expressions
---

# Script

You can use Javascript expressions using the following syntax:

```text
Script(<YOUR_SCRIPT>)
```

## Basic Syntax

The scripting engine supports almost all ES6 features with a [few restrictions](https://github.com/sebastienros/jint#ecmascript-2015-es6).  


Therefore it is recommended to use the [Javascript template string](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/template_strings) syntax and just reference properties directly:

```javascript
Script(`${event.appId.id}`)
Script(`${event.appId.Name}`)
Script(`${event.user.id}`)
Script(`${event.user.email}`)

// For content events
Script(`${event.schemaId.id}`)
Script(`${event.schemaId.Name}`)
Script(`${contentUrl()}`)
Script(`${contentAction()}`)
Script(`${event.data.city.de}`)
```

## Special functions

Squidex provides a set of general helper functions for scripting and and rule formatting.

A value list can be found in the documentation about scripting helper methods:

{% page-ref page="../scripting/scripting-helper-methods.md" %}

In addition to that, there are also methods which are only available for rule format.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>contentAction()</code>
      </td>
      <td style="text-align:left">
        <p>The status of the content, when the event is a content event.</p>
        <p>Otherwise <code>null</code>.</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>contentUrl()</code>
      </td>
      <td style="text-align:left">The URL to the content in the Management UI, when the event is a content
        event. Otherwise <code>null</code>.</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>assetContentUrl</code>
      </td>
      <td style="text-align:left">The URL to download the asset, when the event is an asset event.
        <br />Otherwise <code>null</code>.
        <br />This URL does not include the app name and is therefore not recommended.</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>assetContentAppUrl</code>
      </td>
      <td style="text-align:left">
        <p>The URL to download the asset by ID, when the event is an asset event.</p>
        <p>Otherwise <code>null</code>.</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>assetContentSlugUrl</code>
      </td>
      <td style="text-align:left">
        <p>The URL to download the asset by slug, when the event is an asset event.</p>
        <p>Otherwise <code>null</code>.</p>
      </td>
    </tr>
  </tbody>
</table>

## Conditional Formatting

You can use if-statements and other JavaScript language features for conditional formatting.

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

