---
description: >-
  Vultr is a cheap provider of virtual or physical machines all over the world
  and is great if you need fast servers for low costs.
---

# Install on Vultr

## Why you Should Consider Vultr

### When to Use Vultr

* You want a server for low costs.
* You do not need scalability.
* You do not need integrated monitoring and logging.
* You have a custom domain.

### When Not to Use Vultr

* You are already customer of another Cloud provider.
* You need scalability for Squidex and the database.

### Requirements

* A custom domain or subdomain and the ability to create an A DNS record.

## What is Included

This installation configures a Ubuntu 20.04 x64 machine with

* Docker
* Docker-Compose

Based on this setup 3 containers are installed:

* Squidex
* MongoDB for storing your data.
* Caddy as reverse proxy and for https termination ([https://caddyserver.com/](https://caddyserver.com)).

To work properly you need a DNS A record entry pointing to your machine, because caddy will issue a certificate using lets-encrypt.

## Installation Guide

### Step 1: Go to the Marketplace

Just follow the link: [https://www.vultr.com/marketplace/apps/squidex](https://www.vultr.com/marketplace/apps/squidex)

### Step 2: Deploy a New Server

1. Select your target location close to your center of operation.
2. Select the size of your machine. At least 4GB or memory with 2 virtual cores are recommended.

![Recommended server size](<../../../.gitbook/assets/image (60).png>)

### Step 3: Wait For the Server to Spin Up

It can take a while until your server is ready to be used.

![Waiting for the server](<../../../.gitbook/assets/image (61).png>)

### Step 4: Create a DNS Record

Click your new server and wait until you get an IP address.

![IP address is ready](<../../../.gitbook/assets/image (62).png>)

Create a DNS A record to this IP address.

### Step 5: Create the initial admin user

The server will pull all images now and start them in the right order. Furthermore caddy (the reverse proxy) will create a certificate for your domain. This can take a while, depending how fast your DNS record is propagated. If you use a domain that has not been used before, it takes only a few minutes.

Squidex is ready for use. If you visit your installation under [https://mydomain.com](https://mydomain.com) you will see a simple setup guide where you can create the initial admin user. If you have configured an external authentication provider (for example Github or Google) you can just login and as the first user you will get admin permissions automatically.

<figure><img src="../../../.gitbook/assets/image (3).png" alt=""><figcaption><p>Setup guide</p></figcaption></figure>

## Configuring Object Storage

Vultr Object Storage provides an option for cost-effective and scalable S3 compatible storage for Squidex assets. The following steps outline the process of configuring Squidex to use this Vultr product.

### Step 1: Add Object storage

Follow this link [https://my.vultr.com/objectstorage/add/](https://my.vultr.com/objectstorage/add/) and proceed to add object storage to your account.

![Vultr object storage setup](../../../.gitbook/assets/vultr-object-storage.png)

### Step 2: Add a Bucket and a Folder

Navigate to the buckets tab and add a bucket.

![Vultr object storage bucket list](../../../.gitbook/assets/vultr-object-storage-bucket-list.png)

Click on the bucket you've just created and add a folder.

![Vultr object storage bucket list](../../../.gitbook/assets/vultr-object-storage-folder-list.png)

### Step 3: Configure Asset Storage to Use S3

Navigate to the overview tab and make note of your S3 credentials.

![Vultr object storage bucket list](../../../.gitbook/assets/vultr-object-storage-keys.png)

Edit the `/home/.env` file using your editor of choice and add the following environment variables using the appropriate values for each (leave the S3\_REGION variable empty for now):

```
S3_SERVICEURL=https://ewr1.vultrobjects.com
S3_BUCKET=squidex
S3_FOLDER=assets
S3_REGION=
S3_ACCESSKEY=9I2XHCLL43LKD2WLKDEN
S3_SECRETKEY=PUT_YOUR_SECRET_KEY_HERE

# the following variable is used to compartmentalize 
# each app's assets in a separate folder
S3_FORCEPATHSTYLE=true
```

Next, edit the `/home/docker-compose.yml` file to pass these environment variables onto the container:

```
squidex_squidex:
    image: "squidex/squidex:5"
    environment:
      ... previous variables are here
      - ASSETSTORE__TYPE=AmazonS3
      - ASSETSTORE__AMAZONS3__SERVICEURL=${S3_SERVICEURL}
      - ASSETSTORE__AMAZONS3__BUCKET=${S3_BUCKET}
      - ASSETSTORE__AMAZONS3__BUCKETFOLDER=${S3_FOLDER}
      - ASSETSTORE__AMAZONS3__REGIONNAME=${S3_REGION}
      - ASSETSTORE__AMAZONS3__ACCESSKEY=${S3_ACCESSKEY}
      - ASSETSTORE__AMAZONS3__SECRETKEY=${S3_SECRETKEY}
      - ASSETSTORE__AMAZONS3__FORCEPATHSTYLE=${S3_FORCEPATHSTYLE}
```

In your command line shell, update your Squidex container to use the new asset storage settings:

```
docker-compose up -d
```

Enjoy and have fun.
