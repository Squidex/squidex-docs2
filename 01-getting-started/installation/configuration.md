# Configuration

## Configuration model

We use the [ASP.NET Core Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration) model for all settings.

You can configure Squidex using the following ways:

1. The `appsettings.json` file.
2. The `appsettings.Production.json` file.
3. Environment variables.
4. Command line arguments.

The ordering is important. Command line arguments override other settings, environment variables override the json files and so on. Using a combination of all these options can be very helpful.

Read the comments of the `appsettings.json` file to understand all configuration settings.

In this example we want to override the following setting from the configuration file:

```javascript
{
  "assetStore": {
    "folder": {
      "path": "MyAssets"
    }
  }
}
```

If you combine all keys from the json root to the setting you get the full key of this setting.

Aggregate the keys by two underscores to get the name of the environment variable:

```
ASSETSTORE__FOLDER__PATH="MyAssets"
```

Aggregate the keys by colon and you get the name of the command line argument

```
assetstore:folder:path="MyAssets"
```

Casing does not matter.

## Important settings

We assume that you use environment variables to store the settings. Therefore we use the notation with the two underscores.

#### Settings and Environment Variables

These are the most important settings:

| Setting                  | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `URLS__BASEURL`          | The base URL under which Squidex is running. It is used to generate hyperlinks and to make redirects with the correct host name. In some environments, Squidex is running behind several proxies, e.g. cloudflare, google load balancer and so on. In these cases the original host name might get lost. Therefore we introduced this configuration value.                                                |
| `IDENTITY__ADMINEMAIL`   | The email address of the admin user. You can also set the admin email with the initial setup screen.                                                                                                                                                                                                                                                                                                      |
| `IDENTITY__ADMINPASSWORD` | The password of the admin user (Must contain lowercase, uppercase letter, number and special character). You can also set the admin password with the initial setup screen.                                                                                                                                                                                                                               |
| `CLUSTERING__MODE`       | Squidex uses [Microsoft Orleans](https://dotnet.github.io/orleans/index.html) for clustering. It is technology, which was written for online games, such as Halo. With Orleans you develop small classes that are deployed automatically to a cluster of nodes. To enable clustering you have to set this setting to `Mongo`, which means that a MongoDB table is used to store the state of the cluster. |

Set

* `IDENTITY__GOOGLECLIENT`
* `IDENTITY__GITHUBCLIENT`
* `IDENTITY__MICROSOFTCLIENT`

to empty to disable authentication with third party providers.

#### Health Checks

Many systems support health checks to determinate the health of a service. For example load balancers periodically call an endpoint of the service to remove dead nodes from the list of available nodes and to stop serving HTTP requests to these nodes.

Squidex provides the following health checks:

* `/healthz` (e.g. [https://cloud.squidex.io/healthz](https://cloud.squidex.io/healthz)): An endpoint to check if Squidex can serve HTTP requests and has not consumed too much memory. Recommended health check for liveness, startup and readiness probes.
* `/cluster-healthz`(e.g. [https://cloud.squidex.io/cluster-healthz](https://cloud.squidex.io/cluster-healthz)): An endpoint to check the status of the cluster and if a node can connect to the cluster. It is not recommended to use this endpoint for liveness, startup and readiness probes, because the clustering system has its own health system.
* `/background-healthz` (e.g. [https://cloud.squidex.io/background-healthz](https://cloud.squidex.io/background-healthz)): An endpoint to check the status of background processes. It is not recommended to use this endpoint for liveness, startup and readiness probes, because a restart of a node would not help in most cases. But it is useful for monitoring.
* `/readiness` (e.g. [https://cloud.squidex.io/readiness](https://cloud.squidex.io/readiness)): Special endpoint for readiness and startup probes. Usually it is not needed to use this endpoint.

## Troubleshooting

Please check the logs to see detailed error messages.

### Login screen shows 'Operation failed' message.

Typically the login fails, because the `URLS__BASEURL` setting has an invalid value. Ensure that the domain that is used by your users is configured here. Squidex might run behind several other servers like Cloudflare, load balancers and reverse proxies and does not know the original domain. Therefore we must configure the URL.

### I see the login screen but I cannot login.

Ensure that you have configured a strong password if you use `IDENTITY__ADMINPASSWORD`.

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
3. Passwords must have at least one digit ('0'-'9').&#x20;
4. Passwords must have at least one lowercase ('a'-'z').&#x20;

In case you have forgotten your admin password you can use the following environment variable to update the admin account with the password from the configuration with each start of a Squidex instance:

`IDENTITY__ADMINRECREATE=true`
