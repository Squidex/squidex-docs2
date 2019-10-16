# Install with Docker

## Supported platforms

* Linux with [Docker CE](https://docs.docker.com/install/linux/docker-ce/centos/)
* Windows 10 Pro, Enterprise or Education with [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
* Windows with [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)
* Mac with [Docker for Mac](https://docs.docker.com/docker-for-mac/)

## Use the docker-compose setup

We provide a docker-compose configuration:

> [https://github.com/Squidex/squidex-docker/blob/master/standalone](https://github.com/Squidex/squidex-docker/blob/master/standalone)

It will run 4 containers:

* Squidex
* Nginx as Reverse Proxy to support HTTPS
* Nginx Sidecar to provision certificates with LetsEncrypt.
* MongoDB

### 1. Download the files

Download the following files to your server:

* `docker-compose.yml`
* `.env`

### 2. Configure Squidex

Open the `.env` file and set all variables:

* `SQUIDEX_PROTOCOL`: Keep it unchanged. You can set it to http to disable secure connections.
* `SQUIDEX_FORCE_HTTPS`: Keep it unchanged. You can set it to false to disable permanent redirects from http to https.
* `SQUIDEX_DOMAIN`: Your domain name, e.g. we use `cloud.squidex.io`
* `SQUIDEX_ADMINEMAIL`: The email address of the admin user.
* `SQUIDEX_ADMINPASSWORD`: The password of the admin user \(Must contain a lowercase and uppercase letter, a number and a special character\).

You can keep the other settings empty for now.

### 3. Create the MongoDB database folder

The data will be stored outside of the docker container to simplify the backups. Create the folder with

```text
sudo mkdir /var/mongo/db
```

### 4. Run the docker-compose file

```text
docker-compose up -d
```

### More issues?

It is very likely a configuration problem and not related to hosting under Docker. Go to the [Configuration](configuration.md) page.

