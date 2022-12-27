---
description: >-
  Learn how to use scripting to implement more validation and security
  solutions.
---

# Scripting

## Introduction

This documentation is based on the FoodCrunch use case. Please follow the link and open it side by side to this page to understand the examples.

{% content-ref url="../../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../introduction-and-use-case.md)
{% endcontent-ref %}

## Why scripting?

Some business rules around security and validation are hard to solve with a generic feature that works for everybody and is easy to use. The workflow system has limitations as well and you cannot write permissions that depend on the data of the content.

In general scripting can be used to handle gaps in the Squidex feature set.&#x20;

### Scripting for contents

You can create scripts that run whenever a content is created, updated, deleted, queried or when the status changes (e.g. from Draft to Published).

Scripts can be defined in the schema editor:

1. Go to your App.
2. Go to the **schema** settings.
3. Select the schema you want to write a script for.
4. Select the **Scripts** tab
5. Select the script you want to edit.

<figure><img src="../../../.gitbook/assets/image (4).png" alt=""><figcaption></figcaption></figure>

In the editor you can define scripts for the following actions:

* **Query** scripts are executed whenever a content item is queried with the API, but not when queried by the Management UI.
* **Prepare Query** is called once for all content items of the current query. It can be used to precompute or prefetch data.
* **Create** scripts are executed before a content item is created.
* **Change** scripts are executed before the status of a content item is changed. When you use scheduling to change the status of a content item in the future, the script is called just before the status is changed and not when you schedule it. This can also stop your scheduling, when the script fails or rejects the change.
* **Delete** scripts are executed before a content item is deleted.
* **Update** scripts are executed before a content item is updated.

Content creation and updates happen in the following order:

1. The content item is loaded. If it does not exists the API responds with 404 (NotFound).
2. The data from the request is validated. The API responds with 400 (BadRequest) for invalid data.
3. **The script is executed.**
4. The data from the request is enriched with configured default values.
5. The constraints like unique fields are checked.

This means that you have the guarantee in your scripts, that the data is always valid and that you cannot violate constraints like unique fields when you auto-generate or change content data.

{% hint style="info" %}
Scripts are executed for the REST endpoint as well as for the GraphQL endpoint.
{% endhint %}

### Scripting for Assets

Asset scripts can be defined in the settings:

1. Go to your App.
2. Go to the **settings**.
3. Select the **Asset Scripts** menu item.
4. Select the script you want to edit.

<figure><img src="../../../.gitbook/assets/image (3).png" alt=""><figcaption></figcaption></figure>

In the editor you can define scripts for the following actions:

* **Annotate** scripts are executed before the metadata of an asset are changed.
* **Create** scripts are executed before an asset is created.
* **Moved** scripts are executed before an asset is moved to another folder.
* **Delete** scripts are executed before an assetis deleted.
* **Update** scripts are executed before an asset is replaced with a new file.

## Execution and variables

The scripts are executed in an Sandbox. You do not have access to the file system and only to allowed functions. Only the ES5 Javascript syntax is implemented so far, which means you cannot use Lambda expressions, Promises or classes.

### Variables

All variables are accessible over the `ctx` (Context) variable. The following fields can be used.

| Name            | Type   | Description                                                                                                                                                                                                                                                     |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx.data`      | Object | The data for the content item as it is also described in the [Use Case introduction](../../introduction-and-use-case.md).                                                                                                                                       |
| `ctx.dataOld`   | Object | The old data of the content item as it is also described in the [Use Case introduction](../../introduction-and-use-case.md). Only for "Update" scripts. You can also use `ctx.oldData`as an alias.                                                              |
| `ctx.operation` | String | The name of the operation, as it is also used in the UI ("Query", "Create", "Update", "Delete", "Change"). In addition to that "Published" is used when the status is changed to "Published" and "Unpublished" is used when the previous status is "Published". |
| `ctx.status`    | String | The status of the content.                                                                                                                                                                                                                                      |
| `ctx.statusOld` | String | The old status of the content item. Only for "Change" scripts. You can also use `ctx.oldStatus`as an alias.                                                                                                                                                     |
| `ctx.contentId` | String | The ID of the content item.                                                                                                                                                                                                                                     |
| `ctx.appId`     | String | The ID of the current app.                                                                                                                                                                                                                                      |
| `ctx.appName`   | String | The name of the current app.                                                                                                                                                                                                                                    |
| `ctx.user`      | Object | Information about the current user. See next table.                                                                                                                                                                                                             |

The user object has the following structure.

| Field                 | Type    | Description                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ctx.user.id`         | String  | The ID of the user or the name of the client, if the update or query is invoked from a client.                                                                                                                                                                                                                                       |
| `ctx.user.email`      | String  | The email address of the user, if the user is not a client.                                                                                                                                                                                                                                                                          |
| `ctx.user.isClient`   | Boolean | True, if the current user is a client, false otherwise.                                                                                                                                                                                                                                                                              |
| `ctx.user.claims.xxx` | String  | Each user has a list of claims. Claim are just key-value-pairs. Such a claim could be the display name of the user or the link to the profile picture. Most of them are not interesting for scripting, but you can also go to your profile and add custom properties as claims to your account and use them in the scripts or rules. |

### Methods

#### Control methods

These methods are used to make changes to the content item or to reject changes.

| Name             | Description                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `replace()`      | Tells Squidex that you have made modifications to the `ctx.data`object and that this change should be applied to the content.                                  |
| `disallow()`     | Tells Squidex that this operation is not allowed and that a `403 (Forbidden)` status code should be returned. The user will see an alert in the Management UI. |
| `reject(reason)` | Tells Squidex that this operation is not valid and that a `400 (BadRequest)`status code should be returned. The user will see an alert in the Management UI.   |

#### Helper Methods

Squidex provides a set of general helper functions for scripting and and rule formatting.

{% content-ref url="scripting-helper-methods.md" %}
[scripting-helper-methods.md](scripting-helper-methods.md)
{% endcontent-ref %}

In addition to that, there are also methods which are only available for scripting.

| Name                            | Description                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getJSON(url,callback)`         | Makes a request to the defined URL. If the request succeeds with a HTTP response status code (2XX) and a valid JSON response is returned the callback is invoked and the JSON response is passed to the callback as a JSON object.. The script fails otherwise.                                               |
| `getJSON(url,callback,headers)` | Makes a request to the defined URL and adds the specified headers to the request. If the request succeeds with a HTTP response status code (2XX) and a valid JSON response is returned the callback is invoked and the JSON response is passed to the callback as a JSON object.. The script fails otherwise. |
| `getReferences(ids, callback)`  | Queries the content items with the specified IDs and invokes the callback with the resulting content items when the request has been completed. If the current user does not have permissions to read the content items, the callback is invoked with an empty array.                                         |
| `getReference(id, callback)`    | Queries the content item with the specified ID and invokes the callback with an array that includes the resulting content item when the request has been completed. If the current user does not have permissions to read the content item, the callback is invoked with an empty array.                      |
| `getAssets(ids, callback)`      | Queries the assets with the specified IDs and invokes the callback with the resulting assets when the request has been completed. If the current user does not have permissions to read assets, the script will fail.                                                                                         |
| `getAsset(id, callback)`        | Queries the asset with the specified ID and invokes the callback with an array that includes the resolved asset when the request has been completed. If the current user does not have permissions to read assets, the script will fail.                                                                      |

## Use Cases

### Debugging: Write the context to a field

If you want to understand your data structure and the context object, you can just write it to a string field.

```javascript
ctx.data.debug.iv = JSON.stringify(ctx, null, 2);
// Tell Squidex that the content should be replaced.
replace(); 
```

### Do not return sensitive information when queried by client.

```javascript
if (ctx.isClient) { // ctx Variable contains all Context information
    ctx.data.password.iv = '********';
    // Tell Squidex that the content should be replaced.
    replace(); 
}
```

### Do not allow the client to set fields

```javascript
if (ctx.isClient && ctx.data.password.iv) {
    // Tell Squidex to return a 403 (Forbidden)
    disallow();
}
```

### Ensure that two fields have the same value.

```javascript
if (data.password.iv !== data.passwordConfirm.iv) {
    // Tell Squidex to return a 400 (Bad Request)
    reject('Passwords must be the same');
}
```

### Ensure that only a specific user can publish content

```javascript
if (ctx.operation === 'Published' && ctx.user.email !== 'content@master.com') {
    // Reject the call if the publisher has another email address.
    reject('You are not allowed to publish the content');
}
```

### Compute field from other values

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

### Enrich your content with data from external services

We can use the `getJSON` function to enrich the content with data from external services. This example is a little bit more complicated that the other examples above, but let's jump into the code first.

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

When we make an asynchronous call to another service or content the script engine cannot stop the script automatically. Therefore it is very important to finish the script with a call to `replace()`, even if we do not make a change to the content data.

## Restrictions

There exists some restrictions:

1. You cannot include external libraries.
2. You cannot make calls to external services except `getJSON`.
3. Scripts will timeout after 200ms of CPU execution.
4. Scripts will timeout after 5sec of total execution, e.g. waiting for external services with `getJSON`.
