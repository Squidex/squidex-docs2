---
description: >-
  Learn how to use scripting to implement more validation and security
  solutions.
---

# Scripting

## Introduction

This documentation is based on the FoodCrunch use case. Please follow the link and open it side by side to this page to understand the examples.

{% page-ref page="../introduction-and-use-case.md" %}

## Why scripting?

Some business rules around security and validation are hard to solve with a generic feature that works for everybody and is easy to use. The workflow system has limitations as well and you cannot write permissions that depend on the data of the content.

Scripting can be used to handle gaps in the Squidex feature set. You can create scripts that run whenever a content is created, updated, deleted, queried or when the status changes \(e.g. from Draft to Published\).

Scripts can be defined in the schema editor. The link can be found in the extended menu:

1. Go to your App.
2. Go to the schema settings.
3. Select the schema you want to write a script for.
4. Select the "Scripts" tab
5. Select the script you want to edit.

![](../../.gitbook/assets/image%20%2847%29.png)

In the editor you can define all scripts for the following actions:

* **Query** scripts are executed whenever a content item is queried in the API, but not when queried by the Management UI.
* **Create** scripts are executed before a content item is created.
* **Change** scripts are executed before the status of a content item is changed. When you use scheduling to change the status of a content item in the future, the script is called just before the status is changed and not when you schedule it. This can also stop your scheduling, when the script fails or rejects the change.
* **Delete** scripts are executed before a content item is deleted.
* **Update** scripts are executed before a content item is updated.

{% hint style="info" %}
Scripts are executed for the REST endpoint as well as for the GraphQL endpoint.
{% endhint %}

## Execution and variables

The scripts are executed in an Sandbox. You do not have access to the file system and only allowed operations. Only the ES5 Javascript syntax is implemented so far, which means you cannot use Lambda expressions, Promises or classes.

### Variables

All variables are accessible over the `ctx` \(Context\) variable. The following fields can be used.

| Name | Type | Description |
| :--- | :--- | :--- |
| `ctx.data` | Object | The data for the content item as it is also described in the [Use Case introduction](../introduction-and-use-case.md). |
| `ctx.dataOld` | Object | The old data of the content item as it is also described in the [Use Case introduction](../introduction-and-use-case.md). Only for "Update" scripts. You can also use `ctx.oldData`. |
| `ctx.operation` | String | The name of the operation, as it is also used in the UI, e.g. "Query", "Create", "Update", "Delete", "Change".  |
| `ctx.status` | String | The status of the content. |
| `ctx.statusOld` | String | The old status of the content item. Only for "Change" scripts. You can also use  `ctx.oldStatus`. |
| `ctx.contentId` | String | The ID of the content item. |
| `ctx.appId` | String | The ID of the current app. |
| `ctx.appName` | String | The name of the current app. |
| `ctx.user` | Object | Information about the current user. See more about this later. |

The user object has the following structure.

| Field | Type | Description |
| :--- | :--- | :--- |
| `ctx.user.id` | String | The ID of the user or the name of the client, if the update or Query is invoked from a client. |
| `ctx.user.email` | String | The email address of the user, if the user is not a client. |
| `ctx.user.isClient` | Boolean | True, if the current user is a client, false otherwise. |
| `ctx.user.claims.xxx` | String | Each user a list of claims. Claim is just property of the user. Such a claim could be the display name of the user or the link to the profile picture. Most of them are not interesting for scripting, but you can also go to your profile and add custom properties to your account and use them in the scripts or rules. |

### Methods

#### Control methods

These methods are used to make changes to the content item or to reject changes.

| Name | Description |
| :--- | :--- |
| `replace()` | Tells Squidex that you have made modifications to the `ctx.data`object and that this change should be applied to the content. |
| `disallow()` | Tells Squidex that this operation is not allowed and that a `403 (Forbidden)` status code should be returned. The user will see an alert in the Management UI. |
| `reject(reason)` | Tells Squidex that this operation is not valid and that a `400 (BadRequest)`status code should be returned. The user will see an alert in the Management UI. |

#### Helper Methods

Squidex provides a few helper methods that are not part of the ES5 Javascript standard, but very helpful for a lot of use cases.

| Name | Description |
| :--- | :--- |
| `html2Text(text)` | Converts a HTML string to plain text. |
| `markdown2Text(text)` | Converts a markdown string to plain text. |
| `wordCount(text)` | Counts the number of words in a text. Useful in combination with `html2Text` or `markdown2Text`. |
| `characterCount(text)` | Counts the number of characters in a text. Useful in combination with `html2Text` or `markdown2Text`. |
| `toCamelCase(text)` | Converts a text to camelCase. |
| `toPascalCase(text)` | Converts a text to PascalCase. |
| `slugify(text)` | Calculates the slug of a text by removing all special characters and whitespaces to create a friendly term that can be used for SEO-friendly URLs. |
| `getJSON(url,callback)` | Makes a request to the defined URL. If the request succeeds with a HTTP response status code \(2XX\) and a valid JSON response is returned the callback is invoked and the JSON response is passed to the callback as a JSON object.. The script fails otherwise. |
| `getJSON(url,callback,headers)` | Makes a request to the defined URL and adds the specified headers to the request. If the request succeeds with a HTTP response status code \(2XX\) and a valid JSON response is returned the callback is invoked and the JSON response is passed to the callback as a JSON object.. The script fails otherwise. |

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

### Ensure that two fields are the same when content created.

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
ctx.data.slug.iv = slugifx(ctx.data.title.iv);
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

// Tell the script engine that we make an asynchronous call.
async = true;

getJSON(url, function(result) {
    data.title.iv = result.title;
    // Tell Squidex that the content should be replaced.
    replace();
}, headers);

// I am done
```

 When we make a request to an external service we have to tell the scripting engine that we are going to do this. In a normal script the execution is from top to bottom, just line by line. But when you make a request to an external service, the callback is executed after we have reached the last line. If we do not tell the scripting engine that we make the request, it would just stop the script after we have reached line 16. by setting `async = true` the scripting engine will wait until we call one the control methods. If you are not doing this the script will just time out after 5 seconds. Even if you are not changing the content you should just call `replace()`.

## Restrictions

There exists some restrictions:

1. You cannot include external libraries.
2. You cannot make calls to external services except `getJSON`.
3. You cannot access fields of references assets or content items. As of now the scripting engines is not able to make asynchronous requests to other data sources. Therefore this has not been implemented to ensure that the performance stays stable.
4. Scripts will timeout after 200ms of CPU execution.
5. Scripts will timeout after 5sec of total execution, e.g. waiting for external services with `getJSON`.

