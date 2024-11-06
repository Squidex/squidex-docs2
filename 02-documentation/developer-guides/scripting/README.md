---
description: Learn How to Use Scripting to Implement More Validation and Security Solutions
---

# Scripting

## Introduction

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../introduction-and-use-case.md)
{% endcontent-ref %}

## Why Scripting?

Some business rules around security and validation are hard to solve with a generic feature that works for everybody and is easy to use. The workflow system has limitations as well and you cannot write permissions that depend on the data of the content.

In general, scripting can be used to handle gaps in the Squidex feature set.

### Scripting for Content

You can create scripts that run whenever a content item is created, updated, deleted, queried or when the status changes (e.g. from Draft to Published).

Scripts can be defined in the schema editor:

1. Go to your **App** (1).
2. Go to the **Schema** (2) settings.
3. Select the schema (3) you want to write a script for, i.e `startups` in this example.
4. Select the **Scripts** (4) tab
5. Select the tab (5), depending on when you want the script to run, to work with the editor.

<figure><img src="../../../.gitbook/assets/image (4).png" alt=""><figcaption><p>Creating a script</p></figcaption></figure>

In the editor, you can define scripts for the following actions:

* **Query** script is executed whenever a content item is queried with the API, but not when queried by the Management UI.
* **Prepare Query** is called once for all content items of the current query. It can be used to precompute or prefetch data.
* **Create** script is executed before a content item is created.
* **Change** script is executed before the status of a content item is changed. When you use scheduling to change the status of a content item in the future, the script is called just before the status is changed and not when you schedule it. This can also stop your scheduling, when the script fails or it rejects the change.
* **Delete** script is executed before a content item is deleted.
* **Update** script is executed before a content item is updated.

Content creation and updates happen in the following order:

1. The content item is loaded. If it does not exist, the API responds with 404 (NotFound).
2. The data from the request is validated. The API responds with 400 (BadRequest) for invalid data.
3. **The script is executed.**
4. The data from the request is enriched with configured default values.
5. The constraints, such as unique fields are checked.

This means that you have the guarantee in your scripts, that the data is always valid and that you cannot violate constraints such as unique fields when you auto-generate or change content data.

{% hint style="info" %}
Scripts are executed for the REST endpoint as well as for the GraphQL endpoint.
{% endhint %}

### Scripting for Assets

Asset scripts can be defined in the settings:

1. Go to your App (1).
2. Go to the **Settings** (2).
3. Select the **Asset Scripts** (3) menu item.
4. Select the script type (4) you want to edit.

<figure><img src="../../../.gitbook/assets/image (3) (2) (1).png" alt=""><figcaption></figcaption></figure>

In the editor you can define scripts for the following actions:

* **Annotate** script is executed before the metadata of an asset is changed.
* **Create** script is executed before an asset is created.
* **Moved** script is executed before an asset is moved to another folder.
* **Delete** script is executed before an asset is deleted.
* **Update** script is executed before an asset is replaced with a new file.

## Execution and Variables

The scripts are executed in a Sandbox. You do not have access to the file system and only to allowed functions. Only the ES5 JavaScript syntax is implemented so far, which means you cannot use Lambda expressions, Promises or classes.

### Variables

All variables are accessible over the `ctx` (Context) variable. The following fields can be used for all scripts:

<table><thead><tr><th width="188.33333333333331">Name</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>ctx.appId</code></td><td>String</td><td>The ID of the current app.</td></tr><tr><td><code>ctx.appName</code></td><td>String</td><td>The name of the current app.</td></tr><tr><td><code>ctx.operation</code></td><td>String</td><td>The name of the operation, as it is also used in the UI. For assets: "Query", "PrepareQuery", "Annotate", "Create", "Update", "Delete", "Move". For content: "Query", "PrepareQuery", "Create", "Update", "Delete", "Change". In addition to that for content "Published" is used when the status is changed to "Published" and "Unpublished" is used when the previous status is "Published".</td></tr><tr><td><code>ctx.user</code></td><td>Object</td><td>Information about the current user. See next table.</td></tr></tbody></table>

The user object has the following structure:

| Field                 | Type    | Description                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ctx.user.id`         | String  | The ID of the user or the name of the client, if the update or query is invoked from a client.                                                                                                                                                                                                                                       |
| `ctx.user.email`      | String  | The email address of the user, if the user is not a client.                                                                                                                                                                                                                                                                          |
| `ctx.user.isClient`   | Boolean | True, if the current user is a client, false otherwise.                                                                                                                                                                                                                                                                              |
| `ctx.user.claims.xxx` | String  | Each user has a list of claims. Claim are just key-value-pairs. Such a claim could be the display name of the user or the link to the profile picture. Most of them are not interesting for scripting, but you can also go to your profile and add custom properties as claims to your account and use them in the scripts or rules. |

#### Content Script Variables

The following fields can be used for content scripts:

| Name            | Type    | Description                                                                                                                                                                                         |
| --------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx.contentId` | String  | The ID of the content item.                                                                                                                                                                         |
| `ctx.data`      | Object  | The data for the content item as it is also described in the [Use Case introduction](../../introduction-and-use-case.md).                                                                           |
| `ctx.dataOld`   | Object  | The old data of the content item as it is also described in the [Use Case introduction](../../introduction-and-use-case.md). Only for "Update" scripts. You can also use `ctx.oldData` as an alias. |
| `ctx.permanent` | Boolean | For delete operations only. True when the content should be deleted permanently.                                                                                                                    |
| `ctx.status`    | String  | The status of the content.                                                                                                                                                                          |
| `ctx.statusOld` | String  | The old status of the content item. Only for "Change" scripts. You can also use `ctx.oldStatus` as an alias.                                                                                        |

#### Asset Script Variables

The following fields can be used for Asset scripts:

<table><thead><tr><th width="300.3333333333333">Name</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>ctx.assetId</code></td><td>String</td><td>The ID of the asset.</td></tr><tr><td><code>ctx.asset</code></td><td>Object</td><td>The asset.</td></tr><tr><td><code>ctx.asset.fileHash</code> or<br><code>command.fileHash</code></td><td>String</td><td>The SHA256 hash of the file. Can be null for old files.</td></tr><tr><td><code>ctx.asset.fileName</code> or<br><code>command.fileName</code></td><td>String</td><td>The file name of the asset.</td></tr><tr><td><code>ctx.asset.fileSize</code> or<br><code>command.fileSize</code></td><td>Number</td><td>The size of the file in bytes.</td></tr><tr><td><code>ctx.asset.fileSlug</code> or<br><code>command.fileSlug</code></td><td>String</td><td>The URL slug of the asset.</td></tr><tr><td><code>ctx.asset.fileVersion</code></td><td>Number</td><td>The version of the file.</td></tr><tr><td><code>ctx.asset.isProtected</code> or<br><code>command.isProtected</code></td><td>Boolean</td><td>True, when the asset is not public.</td></tr><tr><td><code>ctx.asset.metadata</code> or<br><code>command.metadata</code></td><td>Object</td><td>The asset metadata.</td></tr><tr><td><code>ctx.asset.metadata['n']</code> or<br><code>command.metadata['n']</code></td><td>String</td><td>The asset metadata with name 'n'.</td></tr><tr><td><code>ctx.asset.mimeType</code> or<br><code>command.mimeType</code></td><td>String</td><td>The mime type.</td></tr><tr><td><code>ctx.asset.parentId</code> or<br><code>command.parentId</code></td><td>String</td><td>The ID of the parent folder. Empty for files without parent.</td></tr><tr><td><code>ctx.asset.parentPath</code> or<br><code>command.parentPath</code></td><td>Array[Object]</td><td>The full path in the folder hierarchy as array of folder infos.</td></tr><tr><td><code>ctx.command.permanent</code></td><td>Boolean</td><td>For delete operations only. True when the asset should be deleted permanently.</td></tr><tr><td><code>ctx.asset.tags</code> or<br><code>command.tags</code></td><td>String</td><td>The tags assigned to the asset.</td></tr></tbody></table>

### Methods

#### Control Methods

These methods are used to make changes to the content item or to reject changes.

<table><thead><tr><th width="235">Name</th><th>Description</th></tr></thead><tbody><tr><td><code>replace()</code></td><td>Content scripts only. Tells Squidex that you have made modifications to the <code>ctx.data</code> object and that this change should be applied to the content.</td></tr><tr><td><code>disallow()</code></td><td>Tells Squidex that this operation is not allowed and that a <code>403 (Forbidden)</code> status code should be returned. The user will see an alert in the Management UI.</td></tr><tr><td><code>reject(reason)</code></td><td>Tells Squidex that this operation is not valid and that a <code>400 (BadRequest)</code>status code should be returned. The user will see an alert in the Management UI.</td></tr><tr><td><code>complete()</code></td><td>Tells Squidex that the script should complete successfully.</td></tr></tbody></table>

#### Helper Methods

Squidex provides a set of general helper functions for scripting and rule formatting.

{% content-ref url="scripting-helper-methods.md" %}
[scripting-helper-methods.md](scripting-helper-methods.md)
{% endcontent-ref %}

In addition to that, there are also methods that are only available for scripting.

<table><thead><tr><th width="314">Name</th><th>Description</th></tr></thead><tbody><tr><td><ul><li><code>getJSON(url,</code> <br>   <code>callback, headers?)</code></li><li><code>postJSON(url, body,</code> <br>   <code>callback, headers?)</code></li><li><code>putJSON(url, body,</code> <br>   <code>callback, headers?)</code></li><li><code>patchJSON(url, body,</code><br>   <code>callback, headers?)</code></li><li><code>deleteJSON(url,</code><br>   <code>callback, headers?)</code></li></ul></td><td>Makes a request to the defined URL. If the request succeeds with a HTTP response status code (2XX) and a valid JSON response is returned the callback is invoked and the JSON response is passed to the callback as a JSON object. The script fails otherwise. You can also pass in an object with headers</td></tr><tr><td><code>getReferences(ids,</code><br>    <code>callback)</code></td><td>Queries the content items with the specified IDs and invokes the callback with the resulting content items when the request has been completed. If the current user does not have permissions to read the content items, the callback is invoked with an empty array.</td></tr><tr><td><code>getReference(id,</code><br>    <code>callback)</code></td><td>Queries the content item with the specified ID and invokes the callback with an array that includes the resulting content item when the request has been completed. If the current user does not have permissions to read the content item, the callback is invoked with an empty array.</td></tr><tr><td><code>getAssets(ids,</code><br>    <code>callback)</code></td><td>Queries the assets with the specified IDs and invokes the callback with the resulting assets when the request has been completed. If the current user does not have permissions to read assets, the script will fail.</td></tr><tr><td><code>getAsset(id,</code><br>    <code>callback)</code></td><td>Queries the asset with the specified ID and invokes the callback with an array that includes the resolved asset when the request has been completed. If the current user does not have permissions to read assets, the script will fail.</td></tr><tr><td><code>getAssetV2(id,</code><br>    <code>callback)</code></td><td>Queries the asset with the specified ID and invokes the callback with a a single asset when the request has been completed. If the current user does not have permissions to read assets, the script will fail.</td></tr><tr><td><code>getAssetText(asset,</code><br>    <code>callback)</code></td><td>Takes the specified asset and computes the text. The asset can not be larger than 4 MB, otherwise an error is returned.</td></tr><tr><td><code>getAssetBlurHash(asset,</code><br>    <code>callback)</code></td><td>Takes the specified asset and computes the blur hash. <br>Read more: <a href="https://blurha.sh/">https://blurha.sh/</a></td></tr><tr><td><code>translate(</code><br>    <code>text,</code><br>    <code>targetLanguage,</code><br>    <code>callback,</code><br>    <code>sourceLanguage?)</code></td><td>Translates a given text to the target language and invokes the callback with the translated text when completed. The source language is usually detected automatically, but can be passed in and usually provides better results.</td></tr><tr><td><code>generate(prompt,</code><br>    <code>callback)</code></td><td>Generates content described by the prompt using OpenAI or other services and invokes the callback with the generated text.</td></tr></tbody></table>

## Use Cases

### Debugging: Write the Context to a Field

If you want to understand your data structure and the context object, you can just write it to a string field.

```javascript
ctx.data.debug.iv = JSON.stringify(ctx, null, 2);
// Tell Squidex that the content should be replaced.
replace(); 
```

### Do Not Return Sensitive Information When Queried by a Client

```javascript
if (ctx.isClient) { // ctx Variable contains all Context information
    ctx.data.password.iv = '********';
    // Tell Squidex that the content should be replaced.
    replace(); 
}
```

### Do Not Allow the Client to Set Fields

```javascript
if (ctx.isClient && ctx.data.password.iv) {
    // Tell Squidex to return a 403 (Forbidden)
    disallow();
}
```

### Ensure that Two Fields Have the Same Value

```javascript
if (data.password.iv !== data.passwordConfirm.iv) {
    // Tell Squidex to return a 400 (Bad Request)
    reject('Passwords must be the same');
}
```

### Ensure that Only a Specific User can Publish Content

```javascript
if (ctx.operation === 'Published' && ctx.user.email !== 'content@master.com') {
    // Reject the call if the publisher has another email address.
    reject('You are not allowed to publish the content');
}
```

### Compute Field From Other Values

Store in a separate field if another field has a valid value:

```javascript
ctx.data.hasPassword = { iv: !!ctx.data.password.iv };
// Tell Squidex that the content should be replaced.
replace();
```

Calculate the slug for a content title automatically:

```javascript
ctx.data.slug.iv = slugify(ctx.data.title.iv);
// Tell Squidex that the content should be replaced.
replace();
```

Calculate the number of words in a Markdown field:

```javascript
ctx.data.wordCount.iv = wordCount(markdown2Text(ctx.data.html.iv)));
// Tell Squidex that the content should be replaced.
replace();
```

Calculate the number of characters in a HTML field:

```javascript
ctx.data.characterCount.iv = characterCount(html2Text(ctx.data.html.iv)));
// Tell Squidex that the content should be replaced.
replace();
```

### Enrich Your Content with Data from External Services

You can use the `getJSON` function to enrich the content with data from external services. This example is a little bit more complicated that the other examples above, but let's jump into the code first:

```javascript
var url = 'https://jsonplaceholder.typicode.com/todos/1';

var headers = {
    ApiKey: 'secret'
};

getJSON(url, function(result) {
    data.title.iv = result.title;
    // Tell Squidex that the content should be replaced.
    replace();
}, headers);

// I am done
```

When you make an asynchronous call to another service or content, the script engine cannot stop the script automatically. Therefore, it is very important to finish the script with a call to `replace()`, even if you do not make a change to the content data.

## Restrictions

There are some existing restrictions:

1. You cannot include external libraries.
2. You cannot make calls to external services, except `getJSON`.
3. Scripts will timeout after 200ms of CPU execution.
4. Scripts will timeout after 5 seconds of total execution, e.g. waiting for external services with `getJSON`.
