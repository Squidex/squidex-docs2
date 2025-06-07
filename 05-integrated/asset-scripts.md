### Scripts

Asset script can be used to implement custom workflows. In scripts all available information are available from the `ctx` (Context) variable.

For example:

 * `ctx.user` will provide user information, for example `ctx.user.id` or `ctx.user.email`.
 * `ctx.fileHash`: The hash value of the asset content.
 * `ctx.fileName`: The file name.
 * `ctx.fileSize`: The size of the asset in bytes.
 * `ctx.fileSlug`: The slug, which is calculated from the file name.
 * `ctx.metadata`: The metadata object.
 * `ctx.mimeType`: The mime type.
 * `ctx.parentId`: The ID of the parent folder as string.
 * `ctx.parentPath`: The path of the parent folder as array of objects.
 * `ctx.tags`: The tag names as string array.

Possible operations are:

 * `replace()`: Replaces the content with the modified version.
 * `reject()`: Reject the operation and return a HTTP 400 (Bad request) instead.
 * `disallow()`: Reject the operation because of security reasons and return a HTTP 403 (Forbidden) instead.

Read more about scripting in the [Documentation](../02-documentation/developer-guides/scripting).