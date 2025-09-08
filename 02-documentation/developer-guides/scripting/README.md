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

All variables are accessible over the `ctx` (Context) variable.&#x20;

The following fields can be used for all scripts:



```javascript
var ctx = {
    // The ID of the current app.
    appId: string,
    
    // The name of the current app.
    appName: string,
    
    // The name of the operation, as it is also used in the UI.
    // 
    // For assets:
    //  * Query
    //  * PrepareQuery    Once for all assets
    //  * Update
    //  * Delete
    //  * Move
    //
    // For content
    //  * Query
    //  * PrepareQuery    Once for all contents
    //  * Create
    //  * Update
    //  * Delete
    //  * Change
    //  * Published
    //  * Unpublished
    operation: string,
    
    user: {
        // The ID of the user or the name of the client,
        // if the update or query is invoked from a client.
        id: string,
        
        // The email address of the user, 
        // if the user is not a client.
        email: string,
        
        // True, if the current user is a client, false otherwise.
        isClient: boolean,
        
        // Each user has a list of claims.
        // Claim are just key-value-pairs. 
        // Such a claim could be ... 
        // * The display name of the user or
        // * The link to the profile picture.
        // 
        // Most of them are not interesting for scripting,
        // but you can also go to your profile and
        // add custom properties as claims to your account 
        // and use them in the scripts or rules.
        claims: {
            key: string
        },
    }
}
```

#### Content Script Variables

The following fields can be used for content scripts:

```javascript
var ctx = {
    ... ALL FROM ABOVE,
    
    // The ID of the content item.
    contentId: string,
    
    // The data for the content item.
    data: {
        field: {
            iv: any,
        },
        localizedField: {
            en: any,
            de: any,
        }
    },
    
    // The old data of the content item for 'Update' scripts.
    dataOld: {
        field: {
            iv: any,
        },
        localizedField: {
            en: any,
            de: any,
        }
    },
    
    // Same as dataOld,
    oldData: ...
    
    // The status of the content.
    status: string,
    
    // The old status of the content item.
    // For 'Change' scripts only.
    statusOld: string,
    
    // True when the content should be deleted permanently.
    // For 'Delete' scripts only.
    permanent: boolean,
}
```

#### Asset Script Variables

The following fields can be used for Asset scripts:

```javascript
var ctx = {
    ... ALL FROM ABOVE,
    
    // The ID of the asset.
    assetId: string,
    
    // The asset.
    asset: {
        // The SHA256 hash of the file. Can be null for old files.
        fileHash: string,
        
        // The file name of the asset, e.g. 'My File.png'
        fileName: string,
        
        // The size of the file in bytes.
        fileSize: nummber,
        
        // The URL slug of the asset, e.g. 'my-file.png'
        fileSlug: string;
        
        // True, when the asset is not public.
        isProtected: boolean,
        
        // The asset metadata.
        metadata: {
            // Example for images:
            pixelWidth: number,
            pixelHeight: number,
            
            // In general:
            key: string,
        },
        
        // The content type, e.g. 'image/png'.
        mimeType: string,
        
        // The ID of the folder.
        parentId: string,
        
        // All parent folders from the root to the current folder.
        parentPath: [{
            id: string,
            folderName: string,
        }],
        
        // True when the asset should be deleted permanently.
        // For delete operations only. 
        permanent: boolean,
        
        // The tags assigned to the asset.
        tags: [
            string,
            string
        ]
    },
};

// Contains new values, when something has been changed.
var command = {
    // SEE: ctx.asset.    
};
```

### Methods

#### Control Methods

These methods are used to make changes to the content item or to reject changes.

```javascript
/**
 * - Content scripts only.
 * - Tells Squidex that you have made modifications to the ctx.data object.
 * - This change should be applied to the content.
 */
function replace() {}

/**
 * - Tells Squidex that this operation is not allowed.
 * - A 403 (Forbidden) status code should be returned.
 * - The user will see an alert in the Management UI.
 */
function disallow() {}

/**
 * - Tells Squidex that this operation is not valid.
 * - A 400 (BadRequest) status code should be returned.
 * - The user will see an alert in the Management UI.
 */
function reject(reason) {}

/**
 * - Tells Squidex that the script should complete successfully.
 */
function complete() {}
```

#### Helper Methods

Squidex provides a set of general helper functions for scripting and rule formatting.

{% content-ref url="scripting-helper-methods.md" %}
[scripting-helper-methods.md](scripting-helper-methods.md)
{% endcontent-ref %}

In addition to that, there are also methods that are only available for scripting.

```javascript
/**
 * - Makes a request to the defined URL.
 * - If the request succeeds with a HTTP response status code (2XX) and a valid JSON response is returned
 *   the callback is invoked and the JSON response is passed to the callback as a JSON object.
 * - The script fails otherwise.
 * - You can also pass in an object with headers.
 * - If ignoreError is true, non-2XX responses return an object with the schema instead of throwing.
 *   { statusCode: number, headers: { [key: string]: string }, body: string }
 */
function getJSON(url, callback, headers?, ignoreError?) {}
function postJSON(url, body, callback, headers?, ignoreError?) {}
function putJSON(url, body, callback, headers?, ignoreError?) {}
function patchJSON(url, body, callback, headers?, ignoreError?) {}
function deleteJSON(url, callback, headers?, ignoreError?) {}

/**
 * - Queries the content items with the specified IDs.
 * - Invokes the callback with the resulting content items when the request has been completed.
 * - If the current user does not have permissions to read the content items, the callback is invoked with an empty array.
 */
function getReferences(ids, callback) {}

/**
 * - Queries the content item with the specified ID.
 * - Invokes the callback with an array that includes the resulting content item when the request has been completed.
 * - If the current user does not have permissions to read the content item, the callback is invoked with an empty array.
 */
function getReference(id, callback) {}

/**
 * - Queries the assets with the specified IDs.
 * - Invokes the callback with the resulting assets when the request has been completed.
 * - If the current user does not have permissions to read assets, the script will fail.
 */
function getAssets(ids, callback) {}

/**
 * - Queries the asset with the specified ID.
 * - Invokes the callback with an array that includes the resolved asset when the request has been completed.
 * - If the current user does not have permissions to read assets, the script will fail.
 */
function getAsset(id, callback) {}

/**
 * - Queries the asset with the specified ID.
 * - Invokes the callback with a single asset when the request has been completed.
 * - If the current user does not have permissions to read assets, the script will fail.
 */
function getAssetV2(id, callback) {}

/**
 * - Takes the specified asset and computes the text.
 * - The asset can not be larger than 4 MB, otherwise an error is returned.
 */
function getAssetText(asset, callback) {}

/**
 * - Takes the specified asset and computes the blur hash.
 * - Read more: https://blurha.sh/
 */
function getAssetBlurHash(asset, callback) {}

/**
 * - Translates a given text to the target language.
 * - Invokes the callback with the translated text when completed.
 * - The source language is usually detected automatically, but can be passed in and usually provides better results.
 */
function translate(text, targetLanguage, callback, sourceLanguage?) {}

/**
 * - Generates content described by the prompt using OpenAI or other services.
 * - Invokes the callback with the generated text.
 */
function generate(prompt, callback) {}
```

## Use Cases

### Write the Context to a Field

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
