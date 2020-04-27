---
description: >-
  The CLI (command line interface) helps you to automate your administration
  processes.
---

# Automation Tools

The CLI \(command line interface\) is terminal application for Windows, Linux and OS X.

You can download the CLI at Github: [https://github.com/Squidex/squidex-samples/releases](https://github.com/Squidex/squidex-samples/releases)

The CLI has two main advantages:

1. It is easy to automate things in your build and release processes, for example you can trigger nightly updates, schema migrations from one app to another or export content.
2. It is easier to integrate complex features, such as export to CSV, because it takes more time to write a good user interface than the export routine itself.

## How to use the CLI?

Hopefully the CLI itself is good enough so that you can use the integrated help to navigate through all the features.

The general structure of each command is

```text
.\sq.exe [FEATURE] [COMMAND] [ARGS] [OPTIONAL_PARAMETERS]
```

Depending on your use cases you need a client in the **Developer** or even **Owner** role.

## How to manage configurations

The CLI can manage multiple configurations, so that you do not have to define the app, client and secret for each command.

STEP 1: Add a configuration

```text
.\sq.exe config add [APP_NAME] [CLIENT_ID] [CLIENT_SECRET]
```

STEP 3: Show all configurations

```text
.\sq.exe config list
```

or as table

```text
.\sq.exe config list -t
.\sq.exe config list --table
```

STEP 3: Switch to another config

```text
.\sq.exe config use [CONFIG_NAME]
```

## Use Cases

The following section describes the most common use cases and how to execute them with the CLI:

### Synchronize schemas

> You need **Developer** role for this use case.

STEP 1: Go to first app and save the schema to a file

```text
.\sq.exe config use app1
.\sq.exe schemas get schema1 > schema.json
```

STEP 2: Go to second app and sync the schema from the saved file

```text
.\sq.exe config use app2
.\sq.exe schemas sync schema.json
```

OR: Sync it to another schema name

```text
.\sq.exe schemas sync schema.json --name <schema-name>
```

### Start a backup

> You need **Owner** role for this use case.

```text
.\sq.exe backup create backup.zip
```

### Export content to CSV

```text
.\sq.exe content export <schema-name> --fields=id,version
```

You have to define the fields you want to export. The general syntax is:

```text
(<CSV_COLUMN>=)?<JSON_PATH>
```

The csv column is optional and can be skipped. If no column name is specified the path string will be used.

To get a good understanding of the paths, it is helpful to have a look to the API documentation of your schemas, e.g.

[https://cloud.squidex.io/api/content/squidex-website/docs\#operation/GetTestimonialsContent](https://cloud.squidex.io/api/content/squidex-website/docs#operation/GetTestimonialsContent)

Some sample paths

* `id`
* `version`
* `data.personName.iv`
* `data.personName` \(`iv` is added by default for non-localized fields\)
* `personName=data.personName` \(Column name for non-localized field\).

More exeamples \(not from the example operation above\):

* `data.text.en` \(Localized field\)
* `data.hobbies.iv.0.name`\(For array of objects\)
* `data.hobbies.iv`\(To serialize the whole array to a string\)
* `data.json.iv.property` \(For a nested object\)
* `data.json.iv` \(To serialize the whole object to a string\)

If the extract value is a json array of object it will be serialized to a string.

### Export content to JSON

```text
.\sq.exe content export <schema-name>--format=JSON
```

### Import content from CSV

```text
.\sq.exe content import <schema-name> File.csv --fields=text
```

You have to define the fields you want to import. The general syntax is:

```text
<JSON_PATH>(=<CSV_COLUM>)?
```

The CSV column is optional and can be skipped. If no column name is specified the path string will be used.

To get a good understanding of the paths, it is helpful to have a look to the API documentation of your schemas, e.g.

[https://cloud.squidex.io/api/content/squidex-website/docs\#operation/GetTestimonialsContent](https://cloud.squidex.io/api/content/squidex-website/docs#operation/GetTestimonialsContent)

Some sample paths

* `personName.iv=personName` 
* `personName` \(`iv` is added by default for non-localized fields\)

More examples \(not from the example operation above\):

* `text.en=text` \(Localized field\)
* `hobbies.iv.0.name=firstHobby`\(For array of objects\)
* `hobbies.iv=hobbies`\(To serialize the whole array to a string\)
* `json.iv.property=jsonProperty` \(For a nested object\)
* `json.iv=json` \(To serialize the whole object to a string\)

If the extract value is a json array of object it will be serialized to a string.

### Import content from JSON

```text
.\sq.exe content import <schema-name>File.json --format=JSON
```

### Use Case: Generate Test Data

Sometimes it is useful to generate test data for a field, e.g. if you need several hundred of items to test a user interface.

This can be done with the CLI as well:

```text
.\sq.exe content test-data <schema-name> --count 100
```

Before you generate the data you can also test it by dumping the data to a file first:

```text
.\sq.exe content test-data <schema-name> --count 100 --file Test-Data
```

The CLI does not support all field types, it has the following restrictions:

* No support for references.
* No support for assets.
* No support for string fields with a pattern validator.

Obviously it can also not support custom validations via scripts or custom extensions.

