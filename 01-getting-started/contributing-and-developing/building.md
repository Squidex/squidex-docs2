---
description: How to build Squidex using Docker or manually.
---

# Building

## 1. Build for docker

We provide docker images on docker hub: [https://hub.docker.com/r/squidex/squidex/](https://hub.docker.com/r/squidex/squidex/)

* `squidex/squidex:latest` is the latest stable version.
* `squidex/squidex:vX.XX` is a specific stable version.
* `squidex/squidex:dev` is the latest dev version (master branch).
* `squidex/squidex:dex-XXXX` is a specific dev version (master branch).

To build a custom image use the multistage Dockerfile. Just run:

```bash
docker build . -t my/squidex
```

## 2. Build for manual deployment

When you want to deploy to IIS or NGINX you might want to build it manually. Note that we also provide the prebuild binaries on Github, link below.

[https://github.com/Squidex/squidex/releases](https://github.com/Squidex/squidex/releases)

You can then find the files under `$SQUIDEX/publish`.

{% hint style="info" %}
`$SQUIDEX`is a placeholder for the path to your local copy of the Squidex source code.
{% endhint %}

### 2.1. Build with docker

Run the following commands in PowerShell or bash to build Squidex with docker:

```bash
# Build the image
docker build . -t squidex-build-image -f dockerfile.build

# Open the image
docker create --name squidex-build-container squidex-build-image

# Copy the output to the host file system
docker cp squidex-build-container:/out ./publish

# Cleanup
docker rm squidex-build-container
```

In Windows, just use the `build.ps` script.

{% hint style="info" %}
We recommend giving the Docker machine at least 4GB of memory.
{% endhint %}

### 2.2. Build it manually

If you don't want to use docker, you can also build it manually. The project structure has changed slightly its migration from .NET Core 2.X to .NET Core 3.0.

#### 2.2.1. Build the .NET 3.0 version

The new structure differentiates between the frontend and the backend.

![Project structure](<../../.gitbook/assets/image (6).png>)

This has the advantage that the code is separated and we can use multiple contains to build them independently, making better use of caching in docker. After both frontend and backend, have been built, you need to copy the build artifacts to a common folder. We just assume that we use `$SQUIDEX/publish` for that.

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

#### 2.2.2. Build the .NET 2.X without docker

```bash
npm i
npm run build

dotnet restore
dotnet publish --configuration Release --output "../../publish"
```

Please note that, on Windows you have to run PowerShell or CMD.exe in elevated mode (run as Administrator) to install all required build tools for node-sass.

```bash
npm install --global --production windows-build-tools
```

{% hint style="info" %}
We recommend to build Squidex with docker, because it ensures that you have a clean environment. Because of the docker [layers](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) the build is not much slower and can be even faster in some situations.
{% endhint %}
