# Permissions

The purpose of a permission is to control the ability of the users to view, change and delete contents, assets and settings.

## Concept

Squidex uses a fine granular permission system. Permissions are defined with a dot-notation:

* `squidex`
* `squidex.apps.{app}.clients`
* `squidex.apps.{app}.clients.read`
* `squidex.apps.{app}.contents`
* `squidex.apps.{app}.contents.{schema}`
* `squidex.apps.{app}.contents.{schema}.read`
* `squidex.apps.{app}.contents.{schema}.create`

`{app}` and `{schema}` are placeholder that will be replaced with your current app name or schema name.

The full list of permissions can be found here: https://github.com/Squidex/squidex/blob/master/src/Squidex.Shared/Permissions.cs

The system is expressed as a hierarchy. If you visualize them as a tree you get the following structure

* squidex
    * apps
        * {app}
            * clients
                * reader
            * contents
                * {schema}
                    * read
                    * create

This means...

* That `squidex` gives you all permissions and makes you an adminstrator.
* That `squidex.apps.{app}` gives you all permissions for a specific app and makes you the app owner.

## Defining permissions

The permission system also allows wildcards:

`squidex.apps.{app}.contents.*.read` gives you read access to all schemas in your app, but now write access.

It also it allows alternatives:

`squidex.apps.{app}.contents.pages|posts|articles.*` gives you full access to the three schemas pages, posts and articles.

And furthermore exceptions (not implemented yet):

`squidex.apps.{app}.contents.^settings.*` gives you full access to all schemas except to the settings schema.

### Special permissions

If you have a look to the list of [available permissions](https://github.com/Squidex/squidex/blob/master/src/Squidex.Shared/Permissions.cs) the meaning should be obvious, but there is one exception:

`squidex.apps.{app}.common` gives you the minimum permissions to access and app. If you create a role that can view content only, this role also needs the permissions to query the configured languages and published schemas for an app. Therefore all app roles have this permissions implicitly.

## Roles

Roles are used to assign permissions to users.

### Default roles

Squidex defines four default roles that cannot be deleted. `{app}` is your app name.

### Owner

* `squidex.apps.{app}`: All permissions

### Developer

* `squidex.apps.{app}.api`: Can use the api section the Management UI
* `squidex.apps.{app}.assets`: Can view and manage assets
* `squidex.apps.{app}.contents`: Can view and manage contents.
* `squidex.apps.{app}.patterns`: Can view and manage patterns.
* `squidex.apps.{app}.rules`: Can view and manage rules.
* `squidex.apps.{app}.schemas`: Can manage schemas (Viewing schemas is an implicit permission).

### Editor

* `squidex.apps.{app}.assets`: Can view and manage assets
* `squidex.apps.{app}.contents`: Can view and manage content.

### Reader

* `squidex.apps.{app}.contents.*.read`: Can view content.

### Custom roles

You can define custom roles in the Management UI by choosing a name first and then assigning the permissions to this role. All permissions will be prefixed with `squidex.apps.{app}` automatically, otherwise you would be able to create roles that give you permissions to another app.

![Custom roles](../images/articles/permissions/roles.png)

## Administration

As an administrator you can also assign permissions to users individually: 

![Custom permissions](../images/articles/permissions/administration.png)

There are some restrictions to the system:

* When you assign permissions to a user manually, this user has to logout and login again, because these permissions are stored as claims in the cookie.

* Even if a user has the admin permission (`squidex`) or permissions for alls apps (`squidex.apps`) he will not see them in the apps overview in the administration UI. A squidex can have have thousands of apps (like our cloud) and the user interface is not designed for that. Either assign him an explicit to an app, like `squidex.apps.{app}` or enter the url manually.
