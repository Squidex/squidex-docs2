Scripts can be used to implement custom workflows.

In scripts all available information are available from the `ctx` (Context) variable.

For example:

* `ctx.user` will provide user information, for example `ctx.user.id` or `ctx.user.email`.

* `ctx.data` will provide the new data value of the content item.

* `ctx.dataOld` will provide the current data value of the content item.

* `ctx.status`: The new status when a content is changed.

* `ctx.statusOld`: The current status of a content item.

* `ctx.contentId`: The id of the content item.

Possible operations are:

* `replace()`: Replaces the content with the modified version.

* `reject()`: Reject the operation and return a HTTP 400 (Bad request) instead.

* `disallow()`: Reject the operation because of security reasons and return a HTTP 403 (Forbidden) instead.

Read more about scripting in the [Documentation](../02-documentation/developer-guides/scripting).