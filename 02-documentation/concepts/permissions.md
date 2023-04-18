---
description: >-
  Roles and Permissions Provide Users the Ability to View, Change and Delete
  Content, Assets and Settings.
---

# Roles & Permissions

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../introduction-and-use-case.md)
{% endcontent-ref %}

## Permissions in Squidex

Squidex uses a fine-grained permission system. Permissions are defined with a dot-notation as outlined below:

* `squidex`
* `squidex.apps.{app}.clients`
* `squidex.apps.{app}.clients.read`
* `squidex.apps.{app}.contents`
* `squidex.apps.{app}.contents.{schema}`
* `squidex.apps.{app}.contents.{schema}.read`
* `squidex.apps.{app}.contents.{schema}.create`

`{app}` and `{schema}` are placeholders that will be replaced with your current App name or schema name.

The full list of permissions can be found here: [https://github.com/Squidex/squidex/blob/master/backend/src/Squidex.Shared/PermissionIds.cs](https://github.com/Squidex/squidex/blob/master/backend/src/Squidex.Shared/PermissionIds.cs)

The system is expressed as a hierarchy. Visualizing it as a tree, its structure is as follows:

* squidex
  * apps
    * {app}
      * clients
        * reader
      * contents
        * {schema}
          * read
          * create

The meaning is as follows:

* `squidex` grants you all permissions and makes you an administrator.
* `squidex.apps.{app}` gives you all permissions for a specific App and makes you the App owner.

### Defining Permissions

The permission system also allows wildcards:

`squidex.apps.{app}.contents.*.read` gives you read access to all schemas in your App, but now write access.

Another example of a wildcard is below:

`squidex.apps.{app}.contents.magazine|startups.*` which gives you full access to two schemas, `magazine` and `startups`.

A third example of a wildcard might be:

`squidex.apps.{app}.contents.^settings.*` gives you full access to all schemas except to a schema called `settings`.

### Special Permission

In the list of [available permissions](https://github.com/Squidex/squidex/blob/master/backend/src/Squidex.Shared/PermissionIds.cs) there is one special permission i.e. `squidex.apps.{app}.common`.&#x20;

This gives you the minimum permission to access an App.&#x20;

If you create a role that can only view content, the role will need permission to query the configured languages and published schemas for an App. Therefore, all App roles implicity have this permission.

## Roles

Roles are used to assign one or more permissions to users. You can view the default roles and create custom roles under **Roles** in the **Settings** section of the App.&#x20;

<figure><img src="../../.gitbook/assets/2022-11-22_11-13.png" alt=""><figcaption><p>Roles</p></figcaption></figure>

### Default Roles

Squidex has four default roles that cannot be deleted.&#x20;

{% hint style="info" %}
`{app}` is your App name.
{% endhint %}

### Owner

An Owner is the owner of the app and can do everything, including delete the App.

|                      |                  |
| -------------------- | ---------------- |
| `squidex.apps.{app}` | All permissions. |

### Developer

Users with a Developer role can use the API view, edit assets, content, schemas, rules, workflows and settings.The Editor Role allows editing assets, editing content and viewing workflows.

| Permission                    | Description                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| `squidex.apps.{app}.api`      | Can use the API section the Management UI.                      |
| `squidex.apps.{app}.assets`   | Can view and manage assets.                                     |
| `squidex.apps.{app}.contents` | Can view and manage contents.                                   |
| `squidex.apps.{app}.patterns` | Can view and manage patterns.                                   |
| `squidex.apps.{app}.rules`    | Can view and manage rules.                                      |
| `squidex.apps.{app}.schemas`  | Can manage schemas (viewing schemas is an implicit permission). |

### Editor

The editor role allows editing assets and contents and viewing workflows

| Permission                    | Description                  |
| ----------------------------- | ---------------------------- |
| `squidex.apps.{app}.assets`   | Can view and manage assets.  |
| `squidex.apps.{app}.contents` | Can view and manage content. |

### Reader

A user with a Reader Role can only read assets and content.

|                                      |                   |
| ------------------------------------ | ----------------- |
| `squidex.apps.{app}.contents.*.read` | Can view content. |

### Custom Roles

You can create custom roles in the Management UI. To create a Custom Role, navigate to **Settings** (1) and then to **Roles** (2) in your App. Enter a **Name** (3) for the role and then click **Add Role** (4).

For our _FoodCrunch_ use case, we want to create a Custom Role for blog/magazine contributors. In this scenario, the role is named as **Contributor**.

<figure><img src="../../.gitbook/assets/2022-11-22_19-16.png" alt=""><figcaption><p>Creating a custom role</p></figcaption></figure>

Next, click on the **Gear** icon (5) ![](../../.gitbook/assets/2022-11-22\_19-23.png) next to the Custom role to start assigning permissions.

<figure><img src="../../.gitbook/assets/2022-11-22_19-25.png" alt=""><figcaption><p>Custom role settings</p></figcaption></figure>

For our _FoodCrunch_ magazine contributors, we want to provide _full access to assets and content_ only in the App. The default Editor role has these permissions but it also has other permissions that allow reading roles and workflows, which we want to avoid for our use case. Hence, the need for a Custom role.&#x20;

The following permissions will be added:

* `assets`
* `contents.*`

To start adding permissions, begin by typing a few words for the permission that you want to assign and a drop down list will appear, select the desired permission and click + to add it.

So, for our use case we will search for the word **assets** (6) and select **assets** (7) from the list.  This is because we want to provide all permissions for assets. Click **+** (8) to add.

<figure><img src="../../.gitbook/assets/2022-11-22_19-34.png" alt=""><figcaption><p>Adding permissions to a customer role - 1</p></figcaption></figure>

Similarly, search for **contents** (9) and select **contents.\*** (10) from the list. Click **+** (11) to add the permission to the custom role and then **Save** (12) to save changes.

<figure><img src="../../.gitbook/assets/2022-11-22_19-37.png" alt=""><figcaption><p>Adding permissions to a customer role - 2</p></figcaption></figure>

All permissions are automatically prefixed with `squidex.apps.{app}`, otherwise a user would be able to create Roles that grant permissions to another App.

## Administration

As an administrator you can also assign permissions to users individually:

![Custom permissions](../../images/articles/permissions/administration.png)

There are some limitations to bear in mind:

* When you manually assign permissions to a user, the user has to logout and login again for the changes to take effect, as these permissions are stored as claims in a cookie.
* Even if a user has admin permission (`squidex`) or permissions for all Apps (`squidex.apps`) he or she will not see them in the Apps' overview in the administration UI. A Squidex instance can have thousands of Apps (like our Cloud) but the user interface is not designed for this. So, either assign them explicitly to an App, such as `squidex.apps.{app}`, or enter the URL manually.
