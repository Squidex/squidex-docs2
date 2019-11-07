# Configuration

## Configuration model

We use the [ASP.NET Core Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration) model for all settings.

You can configure Squidex using the following ways:

1. The `appsettings.json` file.
2. The `appsettings.Production.json` file.
3. Environment variables.
4. Command line arguments.

The ordering is important. Command line arguments override other settings, enironment variables override the json files and so on. Using a combination of all these options can be very helpful.

Read the comments of the `appsettings.json` file to understand all configuration settings.

In this example we want to override the following setting from the configuration file:

```javascript
{
  "assetStore": {
    "folder": {
      "path": "Assets"
    }
  }
}
```

If you combine all keys from the json root to the setting you get the full key of this setting.

Aggregate the keys by two underscores to get the name of the environment variable:

```text
ASSETSTORE__FOLDER__PATH="MyAssets"
```

Aggregate the keys by colon and you get the name of the command line argument

```text
assetstore:folder:path="AssetStore"
```

Casing does not matter.

## Important settings

These are the most important settings:

| Setting | Description |
| :--- | :--- |
| `urls:baseUrl` | The base url under which Squidex is running. It is used to generate hyperlinks and to make redirects with the correct host name. In some environments, squidex is running behind several proxies, e.g. cloudflare, google load balancer and so on. In these cases the original host name might get lost. Therefore we introduced this configuration value. |
| `identity:adminEmail` | The email address of the admin user. |
| `identity:adminPassword` | The password of the admin user \(Must contain lowercase, uppercase letter, number and special character.\) |

Set

* `identity:googleClient`
* `identity:githubClient`
* `identity:microsoftClient`

to empty to disable authentication with third party providers.

## Troubleshooting

Please check the logs to see detailed error messages.

### Login screen shows 'Operation failed' message.

Typically the login fails, because the `urls:baseUrl` setting has an invalid value. Ensure that the domain that is used by your users is configured here. Squidex mght run behind several other servers like Cloudflare, load balancers and reverse proxies and does not know the original domain. Therefore we must configure the URL.

### I see the login screen but I cannot login.

Ensure that you have configured a strong password if you use `identity:adminPassword`.

You will see the following entry in your logs:

```javascript
{
  "logLevel": "Error",
  "action": "createAdmin",
  "status": "failed",
  "exception": {
    ...
    "message": "Cannot create user:...",
    ...
  }
}`
```

The password requirements are:

1. Passwords must be at least 6 characters.
2. Passwords must have at least one non alphanumeric character.
3. Passwords must have at least one digit \('0'-'9'\). 
4. Passwords must have at least one lowercase \('a'-'z'\). 
5. Passwords must not have been appeared in a data breach before: [https://haveibeenpwned.com/](https://haveibeenpwned.com/)

