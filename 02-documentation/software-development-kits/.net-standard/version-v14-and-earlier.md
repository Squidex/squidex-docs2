---
description: Learn How to Install, Initialize and Create Classes for Version 14 of the SDK
---

# Version v14 (and Earlier)

## Introduction

The basic concepts of the SDK are documented at the root page, linked below.  Please note, they are the same for all versions of this package.

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}

This document focuses on the initialization of the SDK and how to use the concrete client classes.

## Install the SDK

The SDK is available on [nuget.org](https://www.nuget.org/packages/Squidex.ClientLibrary/). You can install it with:

```bash
dotnet add package Squidex.ClientLibrary
```

## Manually Creating Classes

The main entry class is `SquidexClientManager`, which handles authentication and creates the actual client classes, where each client is used for one endpoint such as assets, schemas and so on.

The client will create an access token using the App client credentials and cache this token in the memory for 30 days. When the token expires, it is recreated automatically. The cache is not shared between the instances of your application and not needed.

Read more about the authentication flow and best practices below:

{% content-ref url="../../developer-guides/api-overview/authentication.md" %}
[authentication.md](../../developer-guides/api-overview/authentication.md)
{% endcontent-ref %}

To instantiate the client manager, you need the _App Name_, the _Client Id_ and _Client Secret_. For self-hosted installations, the _URL_ is also needed. For Squidex Cloud it is `https://cloud.squidex.io`.

<pre class="language-csharp"><code class="lang-csharp"><strong>ISquidexClientManager clientManager =
</strong>    new SquidexClientManager(
        new SquidexOptions
        {
            AppName = "app",
            ClientId = "id",
            ClientSecret = "secret",
            Url = "https://cloud.squidex.io"
        });
</code></pre>

### Configure Multiple Apps

The SDK supports multiple Apps using the normal options. When you create a request using an end point client you have to define the _App Name_, and the client manager picks the correct credentials. When you create a content client, you can also specify the _App Name_.

```csharp
ISquidexClientManager clientManager =
    new SquidexClientManager(
        new SquidexOptions
        {
            AppName = "app",
            ClientId = "id",
            ClientSecret = "secret",
            Url = "https://cloud.squidex.io",
            AppCredentials = new Dictionary<string, AppCredentials>
            {
               ["other-website"] = new AppCredentials
               {
                   ClientId = "...",
                   ClientSecret = "...",
               }
            }
        });
```

## Creating Classes with Dependency Injection

If you use [Dependency Injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-7.0) (especially in ASP.NET Core) you can use the following package:

```bash
dotnet add package Squidex.ClientLibrary.ServiceExtensions
```

This package provides extension methods to register the client manager at the service collection.

<pre class="language-csharp"><code class="lang-csharp">services
    .AddSquidexClient(options =>
<strong>    {
</strong>        options.AppName = "app";
        options.ClientId = "id";
        options.ClientSecret = "secret";
        options.Url = "https://cloud.squidex.io";
    });
</code></pre>

You can inject `ISquidexClientManager` to your other classes.

This configuration uses the [Options Pattern](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-7.0), so it can also be configured the following way:

```csharp
services.AddSquidexClient()
    .Configure<SquidexServiceOptions>(options =>
    {
        options.AppName = "app";
        options.ClientId = "id";
        options.ClientSecret = "secret";
        options.Url = "https://cloud.squidex.io";
    });
```

Another option is to bind it to a configuration section as follows:

```csharp
services.AddSquidexClient();
services.Configure<SquidexServiceOptions>(
    configuration.GetSection("squidex"));
```

### Configure Multiple Apps

You can also configure multiple Apps using the normal options as follows:

```csharp
services.AddSquidexClient(options =>
{
    options.AppName = "app";
    options.ClientId = "id";
    options.ClientSecret = "secret";
    options.Url = "https://cloud.squidex.io";
    options.AppCredentials = new Dictionary<string, AppCredentials>
    {
       ["other-app"] = new AppCredentials
       {
           ClientId = "...",
           ClientSecret = "...",
       }
    };
})
```

### Configure the HTTP pipeline

The package also integrates the [HttpClientFactory](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests) to implement resilient HTTP requests. For example, this can be used to enable logging or to integrate [Polly](https://thepollyproject.azurewebsites.net/), a resilience and transient-fault-handling library.

You can make changes to the HTTP pipeline using the following method:&#x20;

```csharp
serviceCollection.AddSquidexHttpClient()
   .AddHttpMessageHandler(() =>
   {
       // YOUR CODE
   }).Services
```

## Use Concrete Clients

The classes for concrete endpoints can be created with the client manager. These instances are not cached and a new instance is returned for each call. Therefore, you should keep the instance as a local variable and field, and use them as often as possible.

<pre class="language-csharp"><code class="lang-csharp">var assetsClient = client.CreateAssetsClient();

<strong>var assets1 = await assetsClient.GetAssetsAsync();
</strong><strong>
</strong><strong>// Just use the client directly.
</strong><strong>var assets2 = await client.Assets.GetAssetsAsync();
</strong></code></pre>

The content clients are also not cached. They can be created using the following method:

```csharp
var blog1 = client.CreateContentsClient<BlogPost, BlogPostData>("blog1");
var blog1 = client.CreateContentsClient<BlogPost, BlogPostData>("blog1");

ReferenceEquals(blog1, blog2) == false;
```

### Using Dependency Injection

The endpoint clients are registered in the service locator. Therefore, you can also inject endpoint classes to your service class `MyService`.

```csharp
{
    public MyService(IAssetsClient assetsClient)
    {
    }
}
```

The content clients need parameters to be created. Therefore, you have to register them manually.

```csharp
services.AddSquidexClient(
    cm => cm.CreateContentsClient<BlogPost, BlogPost>("blog");

class MyService
{
    public MyService(IContentsClient<BlogPost, BlogPost> blog)
    {
    }
}
```
