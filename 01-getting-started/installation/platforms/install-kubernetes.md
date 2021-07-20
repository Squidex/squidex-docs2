---
description: Install Squidex on a Kubernetes cluster
---

# Install on Kubernetes

## Supported platforms

* Kubernetes 1.14+

## Use the Helm chart

We provide a Helm chart:

> [https://github.com/Squidex/squidex/tree/master/helm](https://github.com/Squidex/squidex/tree/master/helm)

It will run 2 deployments:

* Squidex
* [MongoDB](https://www.mongodb.com/de)

It will also create a service and ingress. 

Make sure to have an [Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) already setup, such as [NGINX](https://www.nginx.com/products/nginx-ingress-controller/).

### 1. Add the repository

```
helm repo add squidex https://squidex.github.io/squidex/helm/
```

### 2. Install the chart

Your kubeconfig must already be in place, and you should be able to run `kubectl` commands against your cluster.

```
helm install squidex/squidex --set env.URLS__BASEURL=squidex.your.domain --set ingress.hostName=squidex.your.domain
```

### 3. Wait for the rollout

```
kubectl rollout status deployment/squidex
```

## Troubleshooting

Please check the logs first using docker.

```bash
kubectl logs deploy/squidex
```
### Common issues

1. Warning for ServerGC

> info: Orleans.Runtime.Silo[100404]  
> Silo starting with GC settings: ServerGC=False GCLatencyMode=Interactive  
> warn: Orleans.Runtime.Silo[100405]  
> Note: Silo not running with ServerGC turned on - recommend checking app config : --  
> warn: Orleans.Runtime.Silo[100405]  
> Note: ServerGC only kicks in on multi-core systems (settings enabling ServerGC have no effect on single-core machines).  


**Solution**: Setting resource on cpu is greater than 2 to avoid this warning

```yml
resources:
  requests:
    cpu: 2
```

### More issues?

It is very likely a configuration problem and not related to hosting under Docker. Checkout

{% page-ref page="../configuration.md" %}

