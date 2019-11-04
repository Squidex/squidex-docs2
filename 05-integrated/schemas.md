A schema defines the structure of the content and is defined by the fields and their settings.

### Fields

Each field can have the following states:

 * **Locked**: The field cannot be updated, unlocked or deleted anymore.
 * **Hidden**: The field will not be returned by the api and only visible in the Management UI.
 * **Disabled**: The field content cannot be edited in the Management UI. Do not use it for required fields.

You have to publish your schema before you can create content.

Read more about schemas in the [Docs](../02-documentation/concepts/schemas).

---

### Scripts

Scripts can be used to implement custom workflows. In scripts all available information are available from the `ctx` (Context) variable.

For example:

 * `ctx.user` will provide user information, for example `ctx.user.id` or `ctx.user.email`.
 * `ctx.data` will provide the new data value of the content item.
 * `ctx.dataOld` will provide the current data value of the content item.
 * `ctx.status`: The new status when a content is changed or the current status otherwise.
 * `ctx.statusOld`: The current status of a content item. Undefined for new items.
 * `ctx.contentId`: The id of the content item as a string.

Possible operations are:

 * `replace()`: Replaces the content with the modified version.
 * `reject()`: Reject the operation and return a HTTP 400 (Bad request) instead.
 * `disallow()`: Reject the operation because of security reasons and return a HTTP 403 (Forbidden) instead.

Read more about scripting in the [Docs](../02-documentation/developer-guides/scripting).