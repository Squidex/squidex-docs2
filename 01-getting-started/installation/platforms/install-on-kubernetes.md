---
description: Install Squidex on a Kubernetes cluster
---

# Install on Kubernetes

## Supported platforms

* Kubernetes 1.23+

## Pre-requisites

* Kubernetes cluster
* An [Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) such as [NGINX](https://www.nginx.com/products/nginx-ingress-controller/) deployed in the cluster
* [cert-manager](https://cert-manager.io/v0.14-docs/installation/kubernetes/) for auto SSL of custom domain
* A custom domain for use during Squidex deployment

## Use the Helm chart

We provide a Helm chart that deploys Squidex along with MongoDB.

The helm chart creates the following resources / objects:

* Deployments
  * A Squidex primary deployment
  * And a Squidex worker deployment for background jobs&#x20;
* Statefulsets
  * A MongoDB statefulset with 3 replicas&#x20;
* PVs & PVCs
  * Persistent volumes for MongoDB
* Services
* Ingress

The github link below has all the details:

> [https://github.com/Squidex/squidex/tree/master/helm](https://github.com/Squidex/squidex/tree/master/helm)

### 1. Connect to the Kubernetes cluster

Use _kubeconfig_ to connect to your Kubernetes cluser and ensure you are able to run `kubectl` commands.

### 2. Add the repository

Here _squidex_ is the name used for the repo.&#x20;

```
helm repo add squidex https://squidex.github.io/squidex/helm/
```

### 3. Install the chart

The below command installs version 7 of Squidex. &#x20;

```
helm install squidex squidex/squidex7 --set env.URLS__BASEURL=https://squidex.your.domain --set ingress.hostName=squidex.your.domain
```

* Here _squidex/squidex7_ means we are installing version 7 of squidex.
* Replace _squidex.your.domain_ with your custom domain name.

### 4. Wait for the rollout

It may take a few minutes before the rollout is successful. Run the below command to check the status:

```
kubectl rollout status deployments
```

Below is a sample screenshot of a successful rollout

<figure><img src="../../../.gitbook/assets/2022-12-08_16-46.png" alt=""><figcaption><p>Successful rollout of Squidex deployments</p></figcaption></figure>

### 5. Verify resources/objects

Once can verify / see all the objects created by running:

```
kubectl get all
```

<figure><img src="../../../.gitbook/assets/2022-12-08_16-54.png" alt=""><figcaption><p>Screenshot of all objects deployment by the helm chart</p></figcaption></figure>

### 6. Access Squidex

Open the custom URL address on a browser to continue with Squidex setup.

## Troubleshooting

To troubleshoot check deployment logs of the respective deployment. You can also check the pod logs.

```bash
kubectl logs deployment/squidex-squidex7
```

### 404 Error on accessing URL

It's mostly an ingress issue. Check the ingress class name for your ingress controller deployment.

This helm chart uses the _ingressClassName_ as **nginx**.

### Common issues

#### Warning for ServerGC

> info: Orleans.Runtime.Silo\[100404]\
> Silo starting with GC settings: ServerGC=False GCLatencyMode=Interactive\
> warn: Orleans.Runtime.Silo\[100405]\
> Note: Silo not running with ServerGC turned on - recommend checking app config : --\
> warn: Orleans.Runtime.Silo\[100405]\
> Note: ServerGC only kicks in on multi-core systems (settings enabling ServerGC have no effect on single-core machines).

This is not a critical warning. ServerGC is a special garbage collector as it has no positive or negative impact when running with a single core. You can just ignore it.

**Solution**: Request more than 1 CPU&#x20;

```
resources:
  requests:
    cpu: 2
```

### More issues?

It is very likely a configuration problem and not related to hosting under Docker. Checkout

{% content-ref url="../configuration.md" %}
[configuration.md](../configuration.md)
{% endcontent-ref %}
