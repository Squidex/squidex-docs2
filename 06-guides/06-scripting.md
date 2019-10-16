# Scripting

Security and validation are difficult to solve, because there are a lot of different use cases. Scripting can be used to handle gaps in the Squidex feature set. You can create scripts that run whenever a content is created, updated, deleted, queried or when the status changes (e.g. from Draft to Published).

Scripts can be defined in the schema editor. The link can be found in the extended menu:

![Path to Editor](../images/articles/scripting/dialog-to.png)

In the editor you can define all scripts

![Editor](../images/articles/scripting/dialog.png)

Lets have a look to some use cases:

> NOTE: Query scripts are not executed when your query content in the Management UI.

## Use Cases

### Use Case #1: Don’t return sensitive information when queried by client.

```js
if (ctx.isClient) { // ctx Variable contains all Context information
    ctx.data.password.iv = '********';
    // Tell Squidex that the content should be replaced.
    replace(); 
}
```

### Use Case #2: Ensure that two fields are the same when content created.

```js
var data = ctx.data;
if (data.password.iv !== data.passwordConfirm.iv) {
    // Tell Squidex to return a 400 (Bad Request)
    reject('Passwords must be the same');
}
```

### Use Case #3: Do not allow the client to set fields.

```js
if (ctx.isClient && ctx.data.password.iv) {
    // Tell Squidex to return a 403 (Forbidden)
    disallow();
}
```

> Please Note: The Management UI logs you out, when you retrieve a 403. Use `reject()` only and `disallow()` for clients.

### Use Case #4: Compute field from other values.

```js
ctx.data.hasPassword = { iv: !!ctx.data.password.iv };
// Tell Squidex that the content should be replaced.
replace();
```

### Use Case #5: Only a specific user can publish content.

```js
if (ctx.operation === 'Published' && ctx.user.email !== 'content@master.com') {
    // Reject the call if the publisher has another email address.
    reject('You are not allowed to publish the content');
}
```

## Restrictions

There exists some restrictions:

1. You cannot include external libraries.
2. You cannot make calls to external services.
3. Scripts will timeout after 200ms.
