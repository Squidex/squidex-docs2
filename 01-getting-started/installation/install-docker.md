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

> [https://github.com/Squidex/squidex-hosting/blob/master/docker-compose/docker-compose-nginx.yml](https://github.com/Squidex/squidex-hosting/blob/master/docker-compose/docker-compose-nginx.yml)

It will run 4 containers:

* Squidex
* [NGINX ](https://www.nginx.com/)as Reverse Proxy to support HTTPS
* NGINX sidecar to provision free and secure certificates with [LetsEncrypt](https://letsencrypt.org/de/).
* [MongoDB](https://www.mongodb.com/de)

On GitHub you can also find alternative docker-compose configurations to run Squidex without a proxy or on Azure:

> [https://github.com/Squidex/squidex-hosting/tree/master/docker-compose](https://github.com/Squidex/squidex-hosting/tree/master/docker-compose)

### 1. Download the files

Download the following files to your server:

* `docker-compose.yml`
* `.env`

### 2. Configure Squidex

Open the `.env` file and set the following variables:

| Variable | Description |
| :--- | :--- |
| `SQUIDEX_DOMAIN` | Your domain name, e.g. we use `cloud.squidex.io` |
| `SQUIDEX_ADMINEMAIL` | The email address of the admin user. |
| `SQUIDEX_ADMINPASSWORD` | The password of the admin user. Must contain a lowercase and uppercase letter, a number and a special character. Leaked passwords are also forbidden, check [https://haveibeenpwned.com/Passwords](https://haveibeenpwned.com/Passwords) first. |
| `SQUIDEX_FORCE_HTTPS` | Keep it unchanged. You can set it to false to disable permanent redirects from http to https. |
| `SQUIDEX_PROTOCOL` | Keep it unchanged. You can set it to http to disable secure connections. |

You can keep the other settings empty for now.

### 3. Data Folder

The data will be stored outside of the docker container to simplify the backups. The default path /etc/squidex will be created by docker.

### 4. Run the docker-compose file

```bash
docker-compose up -d
```

## Troubleshooting

Please check the logs first using docker.

```bash
docker ps # Get the container id first
docker logs <CONTAINER-ID> # Read the logs
```

### I get a 502 Bad Gateway

In my tests it took sometime to issue the certificate. Probably around 10 minutes.

Also ensure that your DNS server is configured correctly.

### I cannot login and see a IDX20803 error code in my logs

In some cases, especially on CentOS 7, the communication between docker containers on the same host is blocked by the firewall. There is an open [issue on Github](https://github.com/moby/moby/issues/32138) for this problem.

The solution that worked in our cases was to add https as a service to the firewall:

```bash
sudo firewall-cmd --add-service=https --permanent --zone=trusted
sudo firewall-cmd --reload
```

### I see a IDX20803: Unable to obtain configuration from: &lt;IP&gt; in the logs

This problem is because you use an host name or IP address that is not reachable from the docker itself. You can think about the Squidex being two processes in one application. There is the OpenID Connect Server \(Identity Server\) that generates the access tokens and the API. When the API receives an access token it makes a request to the Identity Server to validate the token \(See following diagram\).

![Authentication Flow](../../.gitbook/assets/untitled-presentation.png)

When you use a local host name or IP address such as `localhost` or `127.0.0.1`your are referring to the host name. But containers inside docker cannot resolve the network routes and therefore the authentication flow fails. The solution is to either use another local hostname, that you have to configure in the host file of your Operation system or to use a real hostname, such as a public domain name.

### More issues?

It is very likely a configuration problem and not related to hosting under Docker. Checkout

{% page-ref page="configuration.md" %}

