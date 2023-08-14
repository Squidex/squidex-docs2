---
description: How to Format Rules with JavaScript Expressions
---

# Script

JavaScript expressions can be used with the following syntax:

```
Script(<YOUR_SCRIPT>)
```

{% hint style="info" %}
In newer versions of Squidex, the user interface has been improved and custom input fields have been introduced which allows selection of the syntax and adds the necessary prefix automatically.
{% endhint %}

## Basic Syntax

The scripting engine supports almost all ES6 features with a [few restrictions](https://github.com/sebastienros/jint#ecmascript-2015-es6).

Therefore, it is best to use the [Javascript template string](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/template\_strings) syntax and just reference properties directly:

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

## Special Functions

Squidex provides a set of general helper functions for scripting and rule formatting.

A value list can be found in the documentation concerning scripting helper methods here:

{% content-ref url="../scripting/scripting-helper-methods.md" %}
[scripting-helper-methods.md](../scripting/scripting-helper-methods.md)
{% endcontent-ref %}

Additionally, there are also methods which are only available for rule formatting.

<table><thead><tr><th width="252">Name</th><th>Description</th></tr></thead><tbody><tr><td><code>contentAction()</code></td><td><p>The status of the content, when the event is a content event.</p><p>Otherwise <code>null</code>.</p></td></tr><tr><td><code>contentUrl()</code></td><td>The URL to the content in the Management UI, when the event is a content event. Otherwise <code>null</code>.</td></tr><tr><td><code>assetContentUrl</code></td><td>The URL to download the asset, when the event is an asset event.<br>Otherwise <code>null</code>.<br>This URL does not include the app name and is therefore not recommended.</td></tr><tr><td><code>assetContentAppUrl</code></td><td><p>The URL to download the asset by ID, when the event is an asset event.</p><p>Otherwise <code>null</code>.</p></td></tr><tr><td><code>assetContentSlugUrl</code></td><td><p>The URL to download the asset by slug, when the event is an asset event.</p><p>Otherwise <code>null</code>.</p></td></tr><tr><td><code>complete(value)</code></td><td>If you use an asynchronous operation, just like <code>getAssets</code> you have to tell the script engine, which value should be returned. Therefore you have call <code>complete(value</code>) with the result value. If you do not call this method, the result of the last statement is used.</td></tr></tbody></table>

## Examples

### Resolve References

You can use scripting to resolve references. You must pass over an array of content IDs and a callback (that is invoked) with the resulting list of content items.

```javascript
Script(
    getReferences(data.references.iv, function (references) {
        var actual1 = `Text: ${references[0].data.field1.iv} ${references[0].data.field2.iv}`;
        var actual2 = `Text: ${references[1].data.field1.iv} ${references[1].data.field2.iv}`;

        complete(`${actual1}\n${actual2}`);
    });
)
```

Or a single reference:

```javascript
Script(
    getReference(data.references.iv[0], function (references) {
        var actual1 = `Text: ${references[0].data.field1.iv} ${references[0].data.field2.iv}`;

        complete(`${actual1}`);
    })
)
```

### Resolve References

You can use scripting to resolve assets. You have to pass over an array of asset IDs and a callback (that is invoked) with the resulting list of assets.

```javascript
Script(
    getAssets(data.assets.iv, function (assets) {
        var actual1 = `Text: ${assets[0].fileName} ${assets[0].id}`;
        var actual2 = `Text: ${assets[1].fileName} ${assets[1].id}`;

        complete(`${actual1}\n${actual2}`);
    });
)
```

Or a single asset:

<pre class="language-javascript"><code class="lang-javascript">Script(
<strong>    getAsset(data.assets.iv[0], function (assets) {
</strong><strong>        var actual1 = `Text: ${assets[0].fileName} ${assets[0].id}`;
</strong>        
        complete(`${actual1}`);
    });
)
</code></pre>

### Conditional Formatting

You can use if-statements and other JavaScript language features for conditional formatting.

In the following example, different payloads have been created, depending on the asset size:

```javascript
Script(
    if (event.fileSize > 100000) {
        return `I just uploaded a large image ${event.fileName}`;
    } else {
        return `I just uploaded a small image ${event.fileName}`;
    }
)
```
