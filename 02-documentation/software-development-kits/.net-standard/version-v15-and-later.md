---
description: Learn how to install, initialize and create classes for version 15 of the SDK.
---

# Version v15 and later

## Introduction

The basic concepts of the SDK are documented at the root page, linked below, because they are the same for all versions of this package.

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}

This document focuses on the initialization of the SDK and how to use the concrete client classes.

## Install the SDK

The SDK is available on [nuget.org](https://www.nuget.org/packages/Squidex.ClientLibrary/). You can install it with:

```bash
dotnet add package Squidex.ClientLibrary
```

## Create the classes manually

The main entry class is `ISquidexClient` which handles authentication and creates the actual client classes, where each client is used for one endpoint such as assets, schemas and so on.

The client will create an access token using the client credentials and cache this token in the memory for 30 days. When the token expires it is recreated automatically. The cache is not shared between the instances of your application and not needed.

Read more about the authentication flow and best practices below.

{% content-ref url="../../developer-guides/api-overview/authentication.md" %}
[authentication.md](../../developer-guides/api-overview/authentication.md)
{% endcontent-ref %}

To instantiate the client you need the _App Name_, the _Client Id_ and _Client Secret_. For self-hosted installations the _Url_ is also needed. For Squidex cloud it is `https://cloud.squidex.io`.

```csharp
ISquidexClient client =
    new SquidexClient(
        new SquidexOptions
        {
            AppName = "...",
            ClientId = "...",
            ClientSecret = "...",
            Url = "https://cloud.squidex.io"
        });
```

### Configure multiple apps

The client does not support multiple apps anymore. Use one client per app.

## Create the classes with Dependency Injection

If you use [Dependency Injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-7.0) (especially in ASP.NET Core) you can use the following package:

```bash
dotnet add package Squidex.ClientLibrary.ServiceExtensions
```

This package provides extension methods to register the Squidex Client at the service collection.

<pre class="language-csharp"><code class="lang-csharp">services
    .AddSquidexClient(options =>
<strong>    {
</strong>        options.AppName = "app";
        options.ClientId = "id";
        options.ClientSecret = "secret";
        options.Url = "https://custom.squidex.io";
    });
</code></pre>

You can inject `ISquidexClient` to your other classes.

The configuration uses the [Options Pattern](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-7.0), so it can also be configured the following way:

```csharp
services.AddSquidexClient()
    .Configure<SquidexServiceOptions>(options =>
    {
        options.AppName = "app";
        options.ClientId = "id";
        options.ClientSecret = "secret";
        options.Url = "https://custom.squidex.io";
    });
```

Another option is to bind it to a configuration section as follows:

```csharp
services.AddSquidexClient();
services.Configure<SquidexServiceOptions>(
    configuration.GetSection("squidex"));
```

### Configure multiple apps

Multiple apps can be managed with the service provider by using named registrations as shown in the snippet below.

```csharp
services
    .AddSquidexClient(options =>
    {
        options.AppName = "app1";
        options.ClientId = "id1";
        options.ClientSecret = "secret1";
    })
    .AddSquidexClient("app2", options =>
    {
        options.AppName = "app2";
        options.ClientId = "id2";
        options.ClientSecret = "secret2";
    })
    .AddSquidexClient("app3", options =>
    {
        options.AppName = "app3";
        options.ClientId = "id3";
        options.ClientSecret = "secret3";
    });
```

Inject the `ISquidexClientProvider` instance to resolve a concrete client.

```csharp
class MyService
{
    public MyService(ISquidexClientProvider provider)
    {
        // Get the default client, that has been registered without a name.
        var client1 = provider.Get();
        
        // Get a named client.
        var client2 = provider.Get("app2");
        var client3 = provider.Get("app3");
    }
}
```

### Configure the HTTP pipeline

The package also integrates the [HttpClientFactory](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests) to implement resilient HTTP requests. For example, this can be used to enable logging or to integrate [Polly](https://thepollyproject.azurewebsites.net/), a resilience and transient-fault-handling library.

You can make changes to the HTTP pipeline with the following method:

```csharp
serviceCollection.AddSquidexHttpClient()
   .AddHttpMessageHandler(() =>
   {
       // YOUR CODE
   });
```

## Use concrete clients

The classes for concrete endpoints are properties of the client class. These instances are cached and a single instance is shared between all calls. Therefore, it is not required to store the instance in a separate variable.

<pre class="language-csharp"><code class="lang-csharp">var assetsClient = client.Assets;

<strong>var assets1 = await assetsClient.GetAssetsAsync();
</strong><strong>
</strong><strong>// Just use the client directly.
</strong><strong>var assets2 = await client.Assets.GetAssetsAsync();
</strong></code></pre>

The content clients are also cached and can be resolved with the following method:

<pre class="language-csharp"><code class="lang-csharp"><strong>var blog1 = client.Contents&#x3C;BlogPost, BlogPostData>("blog1");
</strong>var blog1 = client.Contents&#x3C;BlogPost, BlogPostData>("blog1");

ReferenceEquals(blog1, blog2) == true;
</code></pre>

The content clients are cached internally using a thread safe dictionary.

### Using with Dependency Injection

The endpoint clients are not registered in the service locator. You have to register them manually if needed. It is recommended to use the root client class, especially if you work with multiple apps. It is also not needed for performance reasons.

```csharp
services.AddSquidexClient(x => x.Assets);
```
