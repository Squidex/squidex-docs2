# Install with Docker

## Supported platforms

* Linux with [Docker CE](https://docs.docker.com/install/linux/docker-ce/centos/)
* Windows 10 Pro, Enterprise or Education with [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
* Windows with [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)
* Mac with [Docker for Mac](https://docs.docker.com/docker-for-mac/)

{% hint style="info" %}
Digital Ocean [Droplets](https://www.digitalocean.com/products/droplets) are not supported right now, because their DNS prevents that a container can make a request to itself, which is needed to get OIDC via Identity Server working properly. The issue has been discussed in the [support forum](https://support.squidex.io/t/non-standard-port-installation/1262).
{% endhint %}

## Use the docker-compose setup

We provide a docker-compose configuration:

> [https://github.com/Squidex/squidex-docker/blob/master/standalone](https://github.com/Squidex/squidex-docker/blob/master/standalone)

It will run 4 containers:

* Squidex
* [NGINX ](https://www.nginx.com/)as Reverse Proxy to support HTTPS
* NGINX sidecar to provision free and secure certificates with [LetsEncrypt](https://letsencrypt.org/de/).
* [MongoDB](https://www.mongodb.com/de)

### 1. Download the files

Download the following files to your server:

* `docker-compose.yml`
* `.env`

### 2. Configure Squidex

Open the `.env` file and set the following variables:

| Variable | Description |
| :--- | :--- |
| `SQUIDEX_FORCE_HTTPS` | Your domain name, e.g. we use `cloud.squidex.io` |
| `SQUIDEX_ADMINEMAIL` | The email address of the admin user. |
| `SQUIDEX_ADMINPASSWORD` | The password of the admin user \(Must contain a lowercase and uppercase letter, a number and a special character\). |
| `SQUIDEX_FORCE_HTTPS` | Keep it unchanged. You can set it to false to disable permanent redirects from http to https. |
| `SQUIDEX_PROTOCOL` | Keep it unchanged. You can set it to http to disable secure connections. |

You can keep the other settings empty for now.

### 3. Create the MongoDB database folder

The data will be stored outside of the docker container to simplify the backups. Create the folder with

```bash
sudo mkdir /var/mongo/db
```

### 4. Run the docker-compose file

```bash
docker-compose up -d
```

### More issues?

It is very likely a configuration problem and not related to hosting under Docker.  Checkout

{% page-ref page="configuration.md" %}



