Scripts can be used to implement custom workflows.

In scripts all available information are available from the `ctx` (Context) variable.

For example:

* `ctx.user` will provide user information, for example `ctx.user.id` or `ctx.user.email`.

* `ctx.data` will provide the new data value of the content item.

* `ctx.dataOld` will provide the current data value of the content item.

* `ctx.status`: The new status when a content is changed.

* `ctx.statusOld`: The current status of a content item.

* `ctx.contentId`: The id of the content item.



Read more about schemas in the [Documentation](../02-documentation/developer-guides/scripting).