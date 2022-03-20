---
description: >-
  Learn how to setup Squidex as Azure WebApp with an integrated MongoDB
  container.
---

# Install on Azure

Please note that azure also supports Docker compose files so you can also follow the Docker tutorial, especially if it is important for you to be independent from your cloud provider.

In this tutorial I will also not teach you the basics of Azure. it is a very complicated product with thousands of features and you should be familiar with the basics before you follow this tutorial or just learn it on the fly.

This tutorial will also demonstrate how to install MongoDB on your web app. But for production environments it is recommended to one of the offerings in Azure marketplace to get a MongoDB replica set with at least three members.

## Requirements

Before you start you have to setup a few things first:

1. A resource group for all your squidex resources.
2. A service plan to host Squidex (Linux).
3. A storage account for assets and MongoDB, standard performance (general purpose v1 or v2).
4. An installation of the [Azure-CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) on your developer machine.
5. An installation of a MongoDB tool like [Mongo Compass](https://www.mongodb.com/try/download/compass) on your developer machine.
6. The [Microsoft.ContainerInstance](https://azure.microsoft.com/en-gb/services/container-instances/) provider registered in your Azure subscription.

## 1. Create the web app

Create a new web app with the following _Basics_ settings:

![Create App Service Basics](../../../images/started/azure/create-app-service-basics.png)

Configure the _Docker_ tab like this.

{% hint style="info" %}
It is recommended to use a image tag with a fixed version, e.g. squidex/squidex:6.5
{% endhint %}

![Create App Service Docker](../../../images/started/azure/create-app-service-docker.png)

### Enable logging

In the next step we enable logging. This makes diagnostics easier.

Go to your app service and scroll down to menu item _App Service logs_ and turn on file logging. Squidex logs everything to the standard output by default and the stream is forwarded to a file.

{% hint style="info" %}
You can then use the _Log stream_ to view all log entries.
{% endhint %}

![Enable logging](../../../images/started/azure/logging.png)

## 2. Configure your storage account

Go to your storage account instance and execute the following step

1. Go to _Data storage / Files shares_ (1) __ and create a file share named `etc-squidex-mongodb`.
2. Go to _Data storage / Blobs_ (2) and create a container named `etc-squidex-assets`.

Also take the keys and connection string for later.

To do so, go to _Security / Access Keys_ (3) and show all keys (4):

1. Get one of the keys (5) and store them for later. We will use it to configure MongoDB.
2. Get one of the connection strings (6) and store it for later.

![](<../../../.gitbook/assets/image (78).png>)

## 3. Create the MongoDB instance

The following setup of the container instance can only be done using the azure-cli at the moment.

Open a terminal, login to azure using `az login` and run the following command.

```bash
  az container create --resource-group [YOUR_RESOURCE_GROUP] --name mongodb --image mongo --azure-file-volume-account-name [YOUR_STORAGE_ACCOUNT] --azure-file-volume-account-key "[YOUR_STORAGE_KEY]" --azure-file-volume-share-name etc-squidex-mongodb --azure-file-volume-mount-path "/data/mongoaz" --ports 27017 --cpu 2 --ip-address public --memory 2 --os-type Linux --protocol TCP --command-line "mongod --dbpath=/data/mongoaz --bind_ip_all"
```

This will create a container Instance with a single container running mongo db.

### Create an admin user

At this point your MongoDB server will run without authentication. But your MongoDB instance is also available from the public internet, therefore we need to secure it.

Connect to your MongoDB container:

1. Go to _Container instances_ (1)
2. Select your container, usually mongodb (2)
3. Go to _Containers_ (3)
4. Go to _Connect_ (4)
5. Select /bin/bash

![](<../../../.gitbook/assets/image (79).png>)

We have to execute the following steps to create a user

```
// Switch to Mongo shell
mongo

// Switch to admin db
use admin

// Create user
db.createUser({ "user": "root", "pwd": "1q2w3e$R", "roles": ["root"] })
```

{% hint style="info" %}
Please choose a custom username and password.
{% endhint %}

Now we have created a user, we can check the connection now.

Go to container instances (1), select your container (2) and copy the public IP address (3).

![](<../../../.gitbook/assets/image (81).png>)

Use a tool like [Mongo Compass](https://www.mongodb.com/try/download/compass) to connect to your database with this IP address.

Use the following connection string for that: `mongodb://[IP_ADDRESS].` As you can see the connection string does not connect the username and password. But you should be able to connect to your mongo database. The reason is that we authentication is not enabled yet.

Therefore we have to execute the previous command in the azure shell again, but this time, we change the command-line argument to enable authentication. The last part should look like this now. It can take a while to complete this command.

```
--command-line "mongod --dbpath=/data/mongoaz --bind_ip_all --auth"
```

If you try to connect with the connection string from above you should see this or a similar error.

![](<../../../.gitbook/assets/image (77).png>)

The final connection string will contain the username and password and we can successfully connect.

`mongodb://root:1q2w3e$R@[IP_ADDRESS]`

## 4. Configure your application

Go to the _Configuration section_ and choose _Application settings_ to configure squidex.

{% hint style="info" %}
**IMPORANT**: After you change your configuration values you have to restart your container. In our case the only option was to stop the app service and then start it again. **The restart button did not work**. Please write a comment if you know a better solution.
{% endhint %}

Go back to your _App Services_ (1), select your web app (2) and go to the _Configuration_ page (3). You can use the _Advanced edit_ dialog to configure everything will the sample from below.

![](<../../../.gitbook/assets/image (57).png>)



### All settings

The following list provides all necessary settings. Please use the following placeholders:

| Key                        | Description                                                | Sample                                 |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| `[AZURE_CONNECTIONSTRING]` | The connection string to your storage account. See step 2. |                                        |
| `[MONGO_USERNAME]`         | The username of the MongoDB user.                          | <p>In our case:<br>"root"</p>          |
| `[MONGO_PASSWORD]`         | The password of the MongoDB user.                          | <p>In our case:<br>"1q2w3e$R"</p>      |
| `[MONGO_IP]`               | The IP address to your MongoDB container.                  | <p>In our case:<br>"20.101.164.19"</p> |



```javascript
[
  {
    "name": "ASSETSTORE__AZUREBLOB__CONNECTIONSTRING",
    "value": "[AZURE_CONNECTIONSTRING]",
    "slotSetting": false
  },
  {
    "name": "ASSETSTORE__AZUREBLOB__CONTAINERNAME",
    "value": "etc-squidex-assets",
    "slotSetting": false
  },
  {
    "name": "ASSETSTORE__TYPE",
    "value": "AzureBlob",
    "slotSetting": false
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_URL",
    "value": "https://index.docker.io",
    "slotSetting": false
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "EVENTSTORE__MONGODB__CONFIGURATION",
    "value": "mongodb://[MONGO_USER]:[MONGO_PASSWORD]@[MONGO_IP]:27017",
    "slotSetting": false
  },
  {
    "name": "IDENTITY__GITHUBCLIENT",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "IDENTITY__GITHUBSECRET",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "IDENTITY__GOOGLECLIENT",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "IDENTITY__GOOGLESECRET",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "IDENTITY__MICROSOFTCLIENT",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "IDENTITY__MICROSOFTSECRET",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "STORE__MONGODB__CONFIGURATION",
    "value": "mongodb://[MONGO_USER]:[MONGO_PASSWORD]@[MONGO_IP]:27017",
    "slotSetting": false
  },
  {
    "name": "URLS__BASEURL",
    "value": "https://[WEBAPP NAME].azurewebsites.net/",
    "slotSetting": false
  },
  {
    "name": "VIRTUAL_HOST",
    "value": "[WEBAPP NAME].azurewebsites.net",
    "slotSetting": false
  },
  {
    "name": "WEBSITE_HTTPLOGGING_RETENTION_DAYS",
    "value": "10",
    "slotSetting": false
  }
]
```

Configuration values for external authentication providers are empty to turn them off.

## More issues?

It is very likely a configuration problem and not related to Azure. Please visit the following page:&#x20;

{% content-ref url="../configuration.md" %}
[configuration.md](../configuration.md)
{% endcontent-ref %}
