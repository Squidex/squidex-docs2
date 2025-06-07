---
description: Install Squidex on Linux machines with docker and docker-compose.
---

# Install on Docker

## Supported Platforms

* Linux with [Docker CE](https://docs.docker.com/install/linux/docker-ce/centos/)
* Windows 10 Pro, Enterprise or Education with [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
* Windows with [Docker Toolbox](https://docs.docker.com/toolbox/toolbox\_install\_windows/)
* Mac with [Docker for Mac](https://docs.docker.com/docker-for-mac/)

{% hint style="info" %}
Digital Ocean [Droplets](https://www.digitalocean.com/products/droplets) are not supported right now, because their DNS prevents that a container can make a request to itself, which is needed to get OIDC via Identity Server working properly. The issue has been discussed in the [support forum](https://support.squidex.io/t/non-standard-port-installation/1262).
{% endhint %}

## Use the Docker Compose Setup

We provide a Docker Compose configuration:

> [https://github.com/Squidex/squidex-hosting/tree/master/docker-compose](https://github.com/Squidex/squidex-hosting/tree/master/docker-compose)

There are 3 alternatives:

#### Squidex + Caddy

`docker-compose.yml` has the following containers:

* Squidex
* [Caddy ](https://caddyserver.com)as reverse proxy to support HTTPS. Also issues the certificate.
* [MongoDB](https://www.mongodb.com/de)

The caddy proxy uses a custom image to configure the Caddyfile.

{% hint style="info" %}
Recommended setup because of the performance of Caddy and the number of containers.
{% endhint %}

#### Squidex + NGINX

`docker-compose-nginx.yml` has the following containers:

* Squidex
* [NGINX ](https://www.nginx.com)as reverse proxy to support HTTPS
* NGINX sidecar to provision free and secure certificates with [LetsEncrypt](https://letsencrypt.org/de/).
* [MongoDB](https://www.mongodb.com/de)

The NGINX proxy uses a [custom image](https://github.com/Squidex/squidex-hosting/blob/master/docker-compose/proxy-nginx/Dockerfile) to increase the size of the http headers.

{% hint style="info" %}
Recommended setup when you are familiar with Nginx and have special requirements.
{% endhint %}

#### Squidex without Proxy

`docker-compose-noproxy.yml` has the following containers:

* Squidex
* [MongoDB](https://www.mongodb.com/de)

{% hint style="info" %}
Recommended setup if you already have a reverse proxy (e.g. Cloudflare).
{% endhint %}

### 1. Download the files

Download the following files to your server:

* `docker-compose.yml`
* `.env`

### 2. Configure Squidex

Open the `.env` file and set the following variables:

<table><thead><tr><th width="294.5">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>SQUIDEX_DOMAIN</code></td><td>Your domain name, that you want to use for your installation. For example the domain name for the Squidex cloud is <code>cloud.squidex.io</code>. If you run Squidex on your local machine it is <code>localhost</code>.</td></tr><tr><td><code>SQUIDEX_ADMINEMAIL</code></td><td>The email address of the admin user. You can leave it empty to create a new user with the setup page when you visit your Squidex installation in the browser.</td></tr><tr><td><code>SQUIDEX_ADMINPASSWORD</code></td><td>The password of the admin user. Must contain a lowercase and uppercase letter, a number and a special character. You can leave it empty to create a new user with the setup page when you visit your Squid</td></tr></tbody></table>

You can keep the other settings empty for now.

### 3. Data Folder

The data files, such as assets and the MongoDB database files will be stored, outside of the Docker container to simplify backups. The default path `/etc/squidex` will be created by Docker automatically.

### 4. Run the docker-compose file

```bash
docker-compose up -d
```

### 5. Visit your Installation

Squidex should be up and running now. You can visit your installation under the following URL:

[https://${SQUIDEX\_DOMAIN}](https://${squidex\_domain}).

You should see the following screen:

![Setup Screen](<../../../.gitbook/assets/image (76) (1) (1) (1).png>)

The setup screen shows a checklist with hints and warnings. As long as there is no error (a red icon), everything is fine.

If no external authentication provider such as Google or Github is configured you will not see the red area.

Next, create a  new administrator account with an email address and password and you are ready to go. We will not send you an email to this email address, so you can choose whatever email address you want.

## Troubleshooting

Please check the logs first using Docker.

```bash
docker ps # Get the container id first
docker logs <CONTAINER-ID> # Read the logs
```

### I Get NET::ERR\_CERT\_AUTHORITY\_INVALID from the Browser

You are very likely running under `localhost`. In which case the webserver (Caddy) cannot create a valid certificate and will create a self signed certificate. Usually, there\`is a button to continue to localhost:

![Accept self signed certificate with Chrome](<../../../.gitbook/assets/image (73).png>)

{% hint style="info" %}
This screenshot is taken from Chrome and might look different on other browsers.
{% endhint %}

### I Get a 502 Bad Gateway

It can take some time to issue the certificate, approximately around 10 minutes.

Do also ensure that your DNS server is configured correctly.

### I Get a IDX20803: Unable to obtain configuration from \<URL>

#### Problem 1: Firewall Issues

In some cases, especially on CentOS 7, the communication between Docker containers on the same host is blocked by a firewall. There is an open [issue on Github](https://github.com/moby/moby/issues/32138) for this problem.

The best solution is to add https as a service to the firewall:

CentOS:

```bash
sudo firewall-cmd --add-service=https --permanent --zone=trusted
sudo firewall-cmd --reload
sudo systemctl restart docker
```

Ubuntu:

```bash
sudo ufw allow 443
sudo ufw enable
sudo systemctl restart docker
```

#### Problem 2: Invalid Host name

This problem occurs because you are using a host name or IP address that is not reachable from the Docker itself. You can think about Squidex being two processes in one application. There is the OpenID Connect Token Server (that generates the access tokens and the API). When the API receives an access token it makes a request to the Token Server to validate the token (see the following diagram).

![Authentication Flow](<../../../.gitbook/assets/Untitled presentation.png>)

When you use a local host name or IP address such as `localhost` or `127.0.0.1,` you're referring to the host name, but containers inside docker cannot resolve the network routes and therefore the authentication flow fails. The solution is to either use another local host name, that you have to configure in the host file of your operation system or to use a real host name, such as a public domain name.

### More Issues?

For other issues, it is likely that you have a configuration problem not related to hosting under Kubernetes. Checkout the following documentation:

{% content-ref url="../configuration.md" %}
[configuration.md](../configuration.md)
{% endcontent-ref %}
