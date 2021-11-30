---
description: >-
  The CLI (command line interface) helps you to automate your administration
  processes.
---

# Automation Tools (CLI)

The CLI (command line interface) is terminal application for Windows, Linux and OS X.

You can download the CLI at Github: [https://github.com/Squidex/squidex-samples/releases](https://github.com/Squidex/squidex-samples/releases)

The CLI has two main advantages:

1. It is easy to automate things in your build and release processes, for example you can trigger nightly updates, schema migrations from one app to another or export content.
2. It is easier to integrate complex features, such as export to CSV, because it takes more time to write a good user interface than the export routine itself.

## How to use the CLI?

Hopefully the CLI itself is good enough for you, so that you can use the integrated help to navigate through all the features.

The general structure of each command is

```
.\sq.exe [FEATURE] [COMMAND] [ARGS] [OPTIONAL_PARAMETERS]
```

Depending on your use cases you need a client in the **Developer** or even **Owner** role.

{% hint style="info" %}
On this page we use examples under Windows, but the CLI is also available for Linux and OS X.
{% endhint %}

## How to manage configurations

A configuration contains all information to connect the CLI to a specific App in your Squidex installation and contains the app name, client id and and secret and optionally the URL to your installation if you do not use the Squidex Cloud.

The CLI can manage multiple configurations, so that you do not have to define the app, client and secret for each command. Configurations are store in a file that is located just next to the CLI, so you need write permissions to this directory.

STEP 1: Add a configuration

```
.\sq.exe config add [APP_NAME] [CLIENT_ID] [CLIENT_SECRET]
```

STEP 2: Show all configurations

```
.\sq.exe config list
```

or as table

```
.\sq.exe config list -t
.\sq.exe config list --table
```

STEP 3: Switch to another config

```
.\sq.exe config use [CONFIG_NAME]
```

## Use Cases

The following section describes the most common use cases and how to execute them with the CLI:

### Synchronize all app settings (BETA)

{% hint style="info" %}
You need a client with **Owner** role for this use case.
{% endhint %}

This command and use case combines a lot of the following features and can be used to export or import your app settings to a set of JSON files.

The command is able to synchronize these settings:

* Schemas
* Contents (only import)
* Contributors (only import)
* Clients
* Roles
* Rules
* Workflows

To get started with the synchronization feature you can create a new folder with sample files.

```bash
.\sq.exe sync new <folder>
```

The CLI creates as set of sample configuration files (starting with \_\_). Files starting with double underscore are ignored during the synchronization. Therefore you have to rename or copy the samples files to get started.

Furthermore the CLI also generated JSON schema files that are referenced by the configuration files and provide basic intellisense features in editors like [Visual Studio Code](https://code.visualstudio.com). You will also see error messages when you do not follow the JSON schema, but additional errors might occur when you synchronize your configuration.

![Sample folder in Visual Studio Code](<../../.gitbook/assets/image (14).png>)

You can also synchronize the configuration with your app using this command

```bash
.\sq.exe sync in <folder>
```

{% hint style="info" %}
When you synchronize your configuration it is very important that the client that is used by the CLI to establish the connection to your app is also added the the `app.json` file. Otherwise the client will get deleted during the synchronization and also consecutive commands will fail.
{% endhint %}

If you do not want to start from scratch you can export your app using the following command:

```bash
.\sq.exe sync out <folder>
```

These commands also provide flags to control the synchronization process

```bash
.\sq.exe sync in --help

Imports the app from a folder

Usage: sq.exe sync in [options] [arguments]

Arguments:

  folder  <TEXT>
  The target folder to synchronize.

Options:

  -t | --targets (Multiple)  <TEXT>
  The targets to sync, e.g. schemas, workflows, app, rules.

  --nodelete
  Use this flag to prevent deletions.
```

| Flag       | Description                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targets`  | This flag can be used to only import or export certain parts of your app. You can use multiple parameters.                                                                       |
| `nodelete` | When adding this flag, entities that do exist in your app, but not in your configuration file will not be deleted. We recommend to turn this flag on when you test this feature. |

#### Restrictions

The synchronization feature has a few restrictions:

1. **Contributors cannot be exported**. We use the Email-Address of the users to add new contributors to your app. But because Squidex protects the personal identifiable information of our users we do not expose the Email Addresses via the API and therefore cannot export the contributors.
2. **Contents cannot be exported.** In contrast to other entities like schemas or workflows an app can have tens of thousands of content items and it does not make sense to export them.
3. **Contents cannot be deleted.** It is just too complicated.

### Synchronize schemas

{% hint style="info" %}
You need a client with either **Developer** or **Owner** role for this use case.
{% endhint %}

STEP 1: Go to first app and save the schema to a file

```bash
.\sq.exe config use app1
.\sq.exe schemas get schema1 > schema.json
```

STEP 2: Go to second app and sync the schema from the saved file

```bash
.\sq.exe config use app2
.\sq.exe schemas sync schema.json
```

OR: Sync it to another schema name

```bash
.\sq.exe schemas sync schema.json --name <schema-name>
```

### Start a backup

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

If the extract value is a json array of object it will be serialized to a string.

### Export content to JSON

```bash
.\sq.exe content export <schema-name>--format=JSON
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

* `personName.iv=personName`&#x20;
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
.\sq.exe content import <schema-name>File.json --format=JSON
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

Obviously it can also not support custom validations via scripts or custom extensions.
