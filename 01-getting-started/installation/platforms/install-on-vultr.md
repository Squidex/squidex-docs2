---
description: >-
  Vultr is a cheap provider of virtual or physical machines all over the world
  and is great if you need fast servers for low costs.
---

# Install on Vultr

## Considering Vultr

### When to use Vultr?

* You want a server for low costs.
* You do not need scalability.
* You do not need integrated monitoring and logging.
* You have a custom domain.

### When not to use Vultr

* You are already customer of another cloud provider.
* You need scalability for Squidex and the database.

### Requirements

* A custom domain or subdomain and the ability to create an A DNS record.

## What is included?

This installation configures a Ubuntu 20.04 x64 machine with

* Docker
* Docker-Compose

Based on this setup 3 containers are installed:

* Squidex
* MongoDB for storing your data.
* Caddy as reverse proxy and for https termination \([https://caddyserver.com/](https://caddyserver.com/)\).

To work properly you need a DNS A record entry pointing to your machine, because caddy will issue a certificate using lets-encrypt.

## Installation guide

### Step 1: Go to the marketplace

Just follow the link: [https://www.vultr.com/marketplace/apps/squidex](https://www.vultr.com/marketplace/apps/squidex)

### Step 2: Deploy a new server

1. Select your target location close to your center of operation.
2. Select the size of your machine. At least 4GB or memory with 2 virtual cores are recommended. 

![Recommended server size](../../../.gitbook/assets/image%20%2850%29.png)



### Step 3: Wait for the server to spin up

It can take a while until your server is ready to be used.

![Waiting for the server](../../../.gitbook/assets/image%20%2865%29.png)

### Step 4: Create a DNS record

Click your new server and wait until you got a IP address.

![IP address is ready](../../../.gitbook/assets/image%20%2843%29.png)

Create a DNS A record to this IP address.

### Step 5: Connect using SSH

On the same page you see the SSH username and password. Login to your server with SSH or putty for Windows to run the installation script.

Go to the home directory and run the setup script

```bash
cd /home/

# Run the setup script
./setup-squidex.sh
```

You will be asked to enter the domain here. All other values are optional. The installation script will start docker-compose then and download all images and start them in the right order. 

![Running the setup script](../../../.gitbook/assets/image%20%2820%29%20%281%29.png)

Squidex is ready to be used now. If you visit your installation under [https://mydomain.com](https://mydomain.com) you will see a simple setup guide where you can create the initial admin user.

Enjoy and have fun.

