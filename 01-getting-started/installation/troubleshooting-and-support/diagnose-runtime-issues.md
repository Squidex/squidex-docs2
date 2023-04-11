---
description: >-
  This page explains how to diagnose runtime issues. It can also be helpful to
  provide these details to the development team.
---

# Diagnose runtime issues

Squidex is built on .NET Core, which provides a tool to create dumps.

> A dump is a file that contains a snapshot of the process at the time it was created and can be useful for examining the state of your application. Dumps can be used to debug your .NET application when it is difficult to attach a debugger to it such as production or CI environments. Using dumps allows you to capture the state of the problematic process and examine it without having to stop the application.
>
> From: [https://docs.microsoft.com/en-us/dotnet/core/diagnostics/dumps](https://docs.microsoft.com/en-us/dotnet/core/diagnostics/dumps)

Dumps can be analyzed with tools such as:

* Visual Studio
* Visual Studio Code
* Memory Analyzers, e.g. [dotmemory](https://www.jetbrains.com/dotmemory/?source=google\&medium=cpc\&campaign=12509621705\&gclid=Cj0KCQjw5oiMBhDtARIsAJi0qk2ZvCwqDMmKuDzjmibSonfQuJyZZW\_jkhbizatYncy8ipncfEM05BIaAsaXEALw\_wcB)

You have two options to create these dumps:

1. Directly with Squidex if you have version 6.8.0 or newer
2. Manually after you have installed the necessary tools.

## Automated Process (v6.8.0 and Later)

With version 6.8.0 Squidex has been extended to create dumps from either the API or automatically.

### Configuration

{% hint style="info" %}
Just skip this section if you use a container image, because everything will therefore already be configured.
{% endhint %}

Squidex uses the same dump tools that are also used when you create the dumps manually, but they are not part of Squidex itself and therefore you have to tell Squidex where the binaries can be found. Use the following environment variables for that and change the path to point to your installation folder.

```
ENV DIAGNOSTICS__DUMPTOOL=/tools/dotnet-dump
ENV DIAGNOSTICS__GCDUMPTOOL=/tools/dotnet-gcdump
```

### Create a Dump Via API

To create a dump via the API you have to call the following endpoints using the normal authentication headers.

```
GET /api/diagnostics/dump
GET /api/diagnostics/gcdump
```

The dumps are stored in your asset storage under the following paths:

```
diagnostics/dump/yyyy-MM-dd-HH-mm-ss.dump
diagnostics/gcdump/yyyy-MM-dd-HH-mm-ss.gcdump
```

### Create a Dump via Configuration

You can also tell Squidex to create a dump automatically once a memory limit is reached. The dump will therefore only be created once for the whole instance of the Squidex instance.

```
# Triggers the dump tool when the process has consumed more than 4GB
DIAGNOSTICS__DUMPTRIGGERINMB=4096

# Triggers the gcdump tool when the process has consumed more than 4GB
DIAGNOSTICS__GCDUMPTRIGGERINMB=4096
```

## Manual Process

If you want to create a dump manually you have to execute the following steps.

1. Connect to your production machine, container (Docker) or pod (Kubernetes).
2. Install the .NET SDK and the necessary tools.
3. Install the .NET tools
4. Create the dump.
5. Download the dump to your local machine.
6. Optional: Upload the dump file to a network drive to make it available it others.

### 1. Connect to Your Production Machine

How you connect will depend on your hosting environment and operation system:

#### Connect to Linux Machine

Use SSH or [putty for Windows](https://www.putty.org).

#### Connect to Windows Machine

Use remote desktop connection.

#### Connect to Your Docker Container

If you use the official Squidex container you can use the following command to run the shell inside your container. If you have built a custom image, bash might not be installed.

```bash
command docker exec -it <container name> /bin/bash
```

#### Connect to Your Kubernetes Pod

If you use the official Squidex container you can use the following command to run the shell inside your container. If you have built a custom image, bash might not be installed.

```bash
kubectl exec -it <pod_name> -- /bin/bash
```

### 2. Install .NET SDK

Usually the .NET SDK is not installed on your server and only the runtime is installed. This is also true for the official Docker image. You can find detailed installation instructions for your environment from the official documentation here:

{% embed url="https://docs.microsoft.com/en-us/dotnet/core/install" %}
How to install .NET SDK
{% endembed %}

If you use the official Docker image, you can execute the following steps:

```
apk add wget

# Download DotnetSDK Installer
wget -O sdk_install.sh https://dot.net/v1/dotnet-install.sh

# Add permissions to file
chmod 777 sdk_install.sh

# Install sdk.
./sdk_install.sh -c 5.0
```

### 3. Install the .NET tools

There are a wide range of tools that are helpful:

{% embed url="https://docs.microsoft.com/en-us/dotnet/core/diagnostics/dotnet-counters" %}
.NET tools
{% endembed %}

We focus on the following tools:

1. **dotnet-dump:** Creates a full dump of the process. You can analyze the memory usage, stack traces and threads using this tool or third party solutions. The resulting file is really big, usually it has around the same size as the process.
2. **dotnet-gcdump**: This global tool collects GC (Garbage Collector) dumps of live .NET processes. GC dumps are created by triggering a GC in the target process, turning on special events, and regenerating the graph of object roots from the event stream. This process allows for GC dumps to be collected while the process is running and with minimal overhead. These dumps are useful for several scenarios:
   * Comparing the number of objects on the heap at several points in time.
   * Analyzing roots of objects and memory leaks.
   * Collecting general statistics about the counts of objects on the heap.

In the following step we focus on **dotnet-gcdump.**

```
# Go to the dotnet folder. In order to use SDK the process needs to be run directly
cd /root/.dotnet

# install dotnet gcdump or install dotnet-dump to get a full dump
./dotnet tool install --global dotnet-gcdump 

# Go to the tools folder
cd tools
```

### 4. Create the Dump

In this following step we focus on **dotnet-gcdump**.

```
# Go to the tools folde
cd /root/.dotnet/tools

# dotnet-gcdump collect -p 1
```

In Docker and Kubernetes there is only one .NET process running with the Process ID (`pid`) 1. In another environment you can use the following command to list the Dotnet processes that GC dumps can be collected for:

```
dotnet-gcdump ps
```

### 5. Download the Dump to Your Local Machine <a href="#synopsis-2" id="synopsis-2"></a>

This depends on your environment how to copy the dump file to your local machine.

#### How to Copy With Docker

```
docker cp <container_name>:<container_path> <local_path>
```

For example, in our case it was like this:

```
docker cp squidex:/root/.dotnet/tools/core_20211101_160516 full.dump  
```

#### How to Copy With Kubernetes

```
docker cp <pd_name>:<pod_path> <local_path>
```

For example, in our case it was like this:

```
kubectl cp squidex-123:/root/.dotnet/tools/core_20211101_160516 full.dump  
```
