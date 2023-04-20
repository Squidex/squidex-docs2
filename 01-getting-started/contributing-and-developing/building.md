---
description: How to Build Squidex Using Docker or Manually
---

# Building

## 1. Build for docker

You can view provided Docker images on Docker hub: [https://hub.docker.com/r/squidex/squidex/](https://hub.docker.com/r/squidex/squidex/)

* `squidex/squidex:latest` (the latest stable version).
* `squidex/squidex:vX.XX` (a specific stable version).
* `squidex/squidex:dev` (the latest dev version - master branch).
* `squidex/squidex:dev-XXXX` (a specific dev version - master branch).

To build a custom image, use the multistage `Dockerfile` and simply run the following command:

```bash
docker build . -t my/squidex
```

## 2. Build Squidex for Manual Deployment

When you want to deploy to IIS or NGINX you may prefer to build manually. Note that we also provide prebuilt binaries on GitHub, link below:

[https://github.com/Squidex/squidex/releases](https://github.com/Squidex/squidex/releases)

You will find the built files under `$SQUIDEX/publish`.

{% hint style="info" %}
`$SQUIDEX`is a placeholder for the path to your local copy of the Squidex source code.
{% endhint %}

### 2.1. Build Squidex with Docker

Run the following commands in _PowerShell_ or _bash_ to build Squidex with Docker:

```bash
# Build the image
docker build . -t squidex-build-image

# Create the container
docker create --name squidex-build-container squidex-build-image

# Copy the output to the host file system
docker cp squidex-build-container:/app/. ./publish

# Cleanup
docker rm squidex-build-container
docker rmi squidex-build-image
```

Alternatively, we also provide a script file (containing these commands) for both Windows and Linux.

For Windows, use the `build.ps1` script.

For Linux, use the `build.sh` script.

{% hint style="info" %}
We recommend giving the Docker machine at least 4GB of memory.
{% endhint %}

### 2.2. Build Squidex Manually

If you don't want to use Docker, you can also build manually.

#### 2.2.1. Build the current Version

The current structure differentiates between the frontend and the backend.

![Project structure](<../../.gitbook/assets/image (6).png>)

The advantage is that the code is separated, so you can use multiple contains to build them independently, this makes better use of caching in Docker. After building frontend and backend,  copy the build artifacts to a common folder. You can use `$SQUIDEX/publish` for this step.

To build the backend, run the following commands.

```bash
cd backend
cd src/Squidex
dotnet publish --configuration Release --output "../../../publish"
```

To build the frontend, run the following commands.

```bash
cd frontend
npm i # Install npm packages
npm run build
copy build "../publish/wwwroot/build"
```

#### 2.2.2. Build the .NET Core 2.0 Version without Docker

Very old versions that still work with .NET Core 2.0 have a different structure. Therefore the build process is slightly different. For most people this version is not relevant anymore.

```bash
npm i
npm run build

dotnet restore
dotnet publish --configuration Release --output "../../publish"
```

Please note, on Windows you must run _PowerShell_ or _CMD.exe_ in elevated mode (**Run as Administrator**) to install the required build tools for `node-sass`.

```bash
npm install --global --production windows-build-tools
```

{% hint style="info" %}
We recommend building Squidex with Docker, because it ensures a clean environment. Due to Docker [layers](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/), the build isn't much slower and in some cases, it can actually be quicker.
{% endhint %}
