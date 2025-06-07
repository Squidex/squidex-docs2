---
description: >-
  This Page Describes How You Can Offload Image Resizing to a Separate Image
  Resizing Service
---

# Deploying the Image Resizer Service

Image resizing could be an expensive task from a performance perspective as it could consume a lot of CPU resources depending on the size and number of images that are being resized. Since most images are compressed, for example a PNG image, in order to resize it has to be loaded to the server, decompressed, resized (in memory), compressed again and sent back.&#x20;

Squidex uses _Imagesharp_ for this task which works for most formats in combination with _ImageMagick_ for WebP and TGA images.

While these libraries are fast they can still be a bottleneck and a CPU intensive task when resizing images of large size and in large numbers.&#x20;

Hence, a small microservice was built to offload this task to another service. The aim was to create an external process that can handle the image resizing and the thread that accepted the request to resize the image can handle other HTTP requests while it is waiting for the result. This does not necessarily mean that resizing of images will become faster as this would depend on the resource allocated to the microservice.

## About The Microservice

This microservice is available as a docker image and is easy to install.

It does not have any dependencies or database requirements and hence can be simply installed on any server, Kubernetes cluster, or one can also use a managed services like Google Cloud Run ([https://cloud.google.com/run](https://cloud.google.com/run)) for infinite scalability.&#x20;

### Authentication

It is important to note that Squidex does NOT use any authentication to communicate with the Image Resizer microservice.

Hence it is recommended to host it in the same network, preferably keeping it private. Hosting in the same network also helps in keeping traffic costs low.

## Deploying the Microservice

### Docker Image&#x20;

The Docker image is available at [https://hub.docker.com/repository/docker/squidex/resizer](https://hub.docker.com/repository/docker/squidex/resizer).

Running the docker image is as simple as running the following command:

{% hint style="info" %}
The image resizer runs on port 80 by default. You should map it to a different port if you have a reverse proxy like NGINX also running on port 80/443.

The following command maps image resizer to port 8001 on the host.
{% endhint %}

```
docker run -d -p 8001:80 squidex/resizer
```

### Kubernetes YAML

The following YAML file can be used in Kubernetes deployments:&#x20;

[https://github.com/Squidex/squidex-hosting/blob/master/kubernetes/resizer/resizer.yml](https://github.com/Squidex/squidex-hosting/blob/master/kubernetes/resizer/resizer.yml).

To deploy the resizer in Kubernetes, download/copy the `resizer.yml` from the link above and simply run the following command:

```
kubectl apply -f resizer.yml
```

## Configuring Squidex for the Image Resizer Service

Starting with Squidex 6.4.0, the following environment variable can be configured to point to the resizer microservice:

| Variable             | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `ASSETS__RESIZERURL` | The URL where the image resizer service is running.  |

For example, if you were running the Kubernetes YAML file, then the URL would be [`http://resizer.default.svc.cluster.local`](http://resizer.default.svc.cluster.local).
