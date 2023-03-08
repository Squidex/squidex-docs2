---
description: >-
  The Squidex CLI (command line interface) tool helps you automate many of your
  administration processes.
---

# Automation Tools (CLI)

The Squidex CLI (command line interface) is terminal application available for Windows, Linux and macOS (OS X).

You can download the CLI at the GitHub release page: [https://github.com/Squidex/squidex-samples/releases](https://github.com/Squidex/squidex-samples/releases)

The CLI has two main advantages:

1. It is easy to automate things in your build and release processes, for example you can trigger nightly updates, schema migrations from one app to another or export content.
2. It is easier to integrate complex features, such as export to CSV because it takes more time to write a good user interface than the export routine itself.

## How to use the CLI?

Hopefully the CLI itself is good enough for you, so that you can use the integrated help to navigate through all the features.

The general structure of each command is

```
.\sq.exe [FEATURE] [COMMAND] [ARGS] [OPTIONAL_PARAMETERS]
```

Depending on your use cases you will need a client with the **Developer** or **Owner** role.

{% hint style="info" %}
This page demonstrates examples using Windows, but the CLI is also available for Linux and macOS (OS X).
{% endhint %}

## How to manage configurations

A configuration contains all information to connect the CLI to a specific App in your Squidex installation and contains the `app name`, `client id`, `client secret` and optionally the URL to your installation if you do not use the Squidex Cloud.

The CLI can manage multiple configurations, so that you do not have to define the app, client and secret for each command. Configurations are store in a file that is located just next to the CLI, so you need write permissions to this directory.

The _config_ feature of the utility is used to manage configurations.

### STEP 1: Add a configuration

```
.\sq.exe config add [APP_NAME] [CLIENT_ID] [CLIENT_SECRET]
```

<figure><img src="../../.gitbook/assets/2023-02-21_23-03.png" alt=""><figcaption><p>Adding an app configuration</p></figcaption></figure>

### STEP 2: Show all configurations

```
.\sq.exe config list
```

<figure><img src="../../.gitbook/assets/2023-02-21_23-07.png" alt=""><figcaption><p>List all added configurations</p></figcaption></figure>

To view the configurations as a table use `-t` or `--table`.

```
.\sq.exe config list -t
.\sq.exe config list --table
```

<figure><img src="../../.gitbook/assets/2023-02-21_23-08.png" alt=""><figcaption><p>List all added configurations in a table</p></figcaption></figure>

### STEP 3: Switch to another config

When working with multiple apps, the _config use_ command can be used to switch between apps. It is used to select an app (configuration) from a list of configurations.

```
.\sq.exe config use [APP_NAME]
```

## Use Cases

The following section describes the most common use cases and how to execute them with the CLI.

### Synchronize all app settings

{% hint style="info" %}
You need a client with **Owner** role for this use case.
{% endhint %}

A common use case of the CLI is that you can synchronize your Squidex app settings using the `sync` command.

The syntax for it is:

```
.\sq.exe sync [COMMAND] [OPTIONS] [ARGS]
```

The `sync` command can be used to export or import your app settings to a set of JSON files. This command is able to synchronize the following settings:

* Schemas
* Contents (only import)
* Contributors (only import)
* Clients
* Roles
* Rules
* Workflows

#### Use Case - Create sample configuration files

The sync command can be used to create a new folder with sample files that can then be imported to the app.

The following command does the same. Replace `<folder>` with a folder name of your choice.

```bash
.\sq.exe sync new <folder>
```

The CLI creates as set of sample configuration files that begin with \_\_ (see screenshot below). The files starting with double underscore are ignored during the synchronization. Therefore, you have to rename or copy the samples files to sync them.

The screenshot below shows a typical folder structure with sample configuration files.

<figure><img src="../../.gitbook/assets/2023-03-02_20-00.png" alt=""><figcaption></figcaption></figure>

The CLI also generates JSON schema files that are referenced by the configuration files and provide basic intellisense features in editors like [Visual Studio Code](https://code.visualstudio.com). You will see error messages when you do not follow the JSON schema. Also, look out for additional errors that might occur when synchronizing your configuration.

#### Use Case - Import (Synchronize configuration from folder to app)

To synchronize a configuration (created through the CLI) with your app use the following command replacing `<folder>` with the folder name where the configuration is.&#x20;

```bash
.\sq.exe sync in <folder>
```

{% hint style="info" %}
When synchronizing your configuration it is very important that the client used by the CLI configuration to establish the connection to your app is the same in`app.json`file. Else, the client will get deleted during the synchronization and also consecutive commands will fail.
{% endhint %}

The `sync in` command also provide flags to control the synchronization process. You can view a list of supported flags/options by running the following command:

```bash
.\sq.exe sync in --help
```

| Flag                    | Description                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`                   | The name of the app. If not provided then app configured in currentApp gets created.                                                                                              |
| `targets`               | This flag can be used to only import certain parts of your app. You can use multiple parameters. E.g. 'sync in -t contents -t schemas'. Use '`sync targets`' to view all targets. |
| `language`              | The content language to synchronize.                                                                                                                                              |
| `content-action`        | <p>Defines how to handle content. </p><p>Allowed values: <strong>Upsert, UpsertPatch, Create, Update, Patch</strong>.</p>                                                         |
| `delete`                | Use this flag to also delete entities.                                                                                                                                            |
| `patch-content`         | Make content updates as patch.                                                                                                                                                    |
| `recreate`              | Use this flag to also recreate entities.                                                                                                                                          |
| `skip-assets`           | Use this flag to sync asset folders but not assets.                                                                                                                               |
| `update-current-client` | Also update the client that is used during the sync process.                                                                                                                      |
| `emulate`               | Use this flag to only emulate the changes, like a dry run.                                                                                                                        |

#### Use Case - Export (Synchronize configuration from app to folder)

The `sync` command also lets you export your app configuration to a folder if you do not want to start from scratch you can also export. Use the following command replacing `<folder>` with an actual folder name.

```bash
.\sq.exe sync out <folder>
```

{% hint style="info" %}
Make note of the following when synchronizing out or exporting.

1. A client with Owner role can export all configurations.
2. A client with Developer role will not be able to export clients (in Step 3) and will throw a `403 Forbidden` error message. It will complete export of the rest of the configurations.&#x20;
3. A client with Editor role will completely fail exporting with `403 Forbidden` message.
{% endhint %}

For example, in the following screenshot we are exporting the configuration of an app called _blog-with-squidex_ to our local machine where CLI is installed. The client has Owner role.

```
.\sq.exe sync out blog-with-squidex
```

<figure><img src="../../.gitbook/assets/2023-03-02_20-22.png" alt=""><figcaption><p>Synchronize out / Export configuration from app to folder</p></figcaption></figure>

The `sync out` command also provide flags to control the synchronization process.

```
.\sq.exe sync out --help
```

| Flag       | Description                                                                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`      | The name of the app. If not provided then app configured in currentApp gets created.                                                                                               |
| `targets`  | This flag can be used to only export certain parts of your app. You can use multiple parameters. E.g. 'sync out -t contents -t schemas'. Use '`sync targets`' to view all targets. |
| `describe` | Create a README.md file.                                                                                                                                                           |

#### Restrictions

The synchronization feature has a few restrictions:

1. **Contributors cannot be exported**. We use the email address of the users to add new contributors to your app. But because Squidex protects the PII (Personally Identifiable Information) of our users we do not expose the email addresses via the API and therefore cannot export the contributors.
2. **Contents cannot be exported.** In contrast to other entities like schemas or workflows an app can have tens of thousands of content items and hence it does not make sense to export them.
3. **Contents cannot be deleted.** It is just too complicated.

### Synchronize schemas

{% hint style="info" %}
You need a client with either **Developer** or **Owner** role for this use case.
{% endhint %}

The CLI provides a mechanism to synchronize schemas using a JSON file. The `schemas` command helps you achieve this. The syntax for this is:

```
.\sq.exe schemas [command] [options]
```

STEP 1: Use the `config` command to select the source app and then save the schema to a JSON file.

```bash
.\sq.exe config use app1
.\sq.exe schemas get schema1 > schema.json
```

STEP 2: Use the `config` command again to switch to the destination app and sync the schema from the saved file.

```bash
.\sq.exe config use app2
.\sq.exe schemas sync schema.json
```

Or you can also sync it to another schema name

```bash
.\sq.exe schemas sync schema.json --name <schema-name>
```

### Start a backup

You can also create a backup using the CLI. This is achieved by using the `backup` command.

{% hint style="info" %}
You need a client with **Owner** role for this use case.
{% endhint %}

```bash
.\sq.exe backup create backup.zip
```

### Export content to CSV

```bash
.\sq.exe content export <schema-name> --fields=id,version
```

You have to define the fields you want to export. The general syntax is:

```bash
(<CSV_COLUMN>=)?<JSON_PATH>
```

The CSV column is optional and can be skipped. If no column name is specified the path string will be used.

To get a good understanding of the paths, it is helpful to have a look to the API documentation of your schemas, e.g.

[https://cloud.squidex.io/api/content/squidex-website/docs#operation/GetTestimonialsContent](https://cloud.squidex.io/api/content/squidex-website/docs#operation/GetTestimonialsContent)

Some sample paths

* `id`
* `version`
* `data.personName.iv`
* `data.personName` (`iv` is added by default for non-localized fields)
* `personName=data.personName` (Column name for non-localized field).

More examples (not from the example operation above):

* `data.text.en` (Localized field)
* `data.hobbies.iv.0.name`(For array of objects)
* `data.hobbies.iv`(To serialize the whole array to a string)
* `data.json.iv.property` (For a nested object)
* `data.json.iv` (To serialize the whole object to a string)

If the extract value is a JSON array of object, it will be serialized to a string.

### Export content to JSON

```bash
.\sq.exe content export <schema-name> --format=JSON
```

Take a look at the help section of the `content export` command for a list of all options.

```
.\sq.exe content export --help
```

### Import content from CSV

```bash
.\sq.exe content import <schema-name> File.csv --fields=text
```

You have to define the fields you want to import. The general syntax is:

```bash
<JSON_PATH>(=<CSV_COLUM>)?
```

The CSV column is optional and can be skipped. If no column name is specified the path string will be used.

To get a good understanding of the paths, it is helpful to have a look to the API documentation of your schemas, e.g.

[https://cloud.squidex.io/api/content/squidex-website/docs#operation/GetTestimonialsContent](https://cloud.squidex.io/api/content/squidex-website/docs#operation/GetTestimonialsContent)

Some sample paths

* `personName.iv=personName`
* `personName` (`iv` is added by default for non-localized fields)

More examples (not from the example operation above):

* `text.en=text` (Localized field)
* `hobbies.iv.0.name=firstHobby`(For array of objects)
* `hobbies.iv=hobbies`(To serialize the whole array to a string)
* `json.iv.property=jsonProperty` (For a nested object)
* `json.iv=json` (To serialize the whole object to a string)

If the extract value is a json array of object it will be serialized to a string.

### Import content from JSON

```bash
.\sq.exe content import <schema-name> File.json --format=JSON
```

Take a look at the help section of the `content import` command for a list of all options.

```
.\sq.exe content import --help
```

### Use Case: Generate Test Data

Sometimes it is useful to generate test data for a field, e.g. if you need several hundred of items to test a user interface.

This can be done with the CLI as well:

```bash
.\sq.exe content test-data <schema-name> --count 100
```

Before you generate the data you can also test it by dumping the data to a file first:

```bash
.\sq.exe content test-data <schema-name> --count 100 --file Test-Data
```

The CLI does not support all field types, it has the following restrictions:

* No support for references.
* No support for assets.
* No support for string fields with a pattern validator.

It is also unable to support custom validations via scripts or custom extensions.

## How to use the help within the CLI?

The CLI utility has an inbuild help which can be accessed by using the **--help** parameter.

For example _--help_ at the utility level will show all features the CLI supports

`.\sq.exe --help`

<figure><img src="../../.gitbook/assets/2023-03-01_12-28.png" alt=""><figcaption><p>Help Example 1</p></figcaption></figure>

Similarly a _--help_ parameter after a feature gives information about all the commands the feature supports. For example:

`.\sq.exe config --help`

<figure><img src="../../.gitbook/assets/2023-03-01_12-30.png" alt=""><figcaption><p>Help Example 2</p></figcaption></figure>
