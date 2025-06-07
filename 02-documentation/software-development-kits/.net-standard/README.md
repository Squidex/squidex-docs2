---
description: Read more on how to use the .NET Core and .NET Standard
---

# .NET

## Introduction

The SDK is mostly generated from the OpenAPI specification. You can read the API documentation here:[ https://cloud.squidex.io/api/docs](https://cloud.squidex.io/api/docs).

This means that the API is fully covered, including all endpoints used by the frontend. You can also use the SDK to create and configure Apps, schemas and rules.

The downside is that some of the methods are not as user-friendly as they could be. Most methods have the App name as a required parameter, which is redundant because the SDK is designed to mainly connect to a single App and has the App name as a global configuration option.

This has been changed with **v15.0.0,** and the developer experience has been improved. Therefore, this document includes the difference between version 15 and previous versions.&#x20;

## Generating Content Classes

Because of localization, the OpenAPI specification and the generated classes are very difficult to use, especially if your fields are not localized. Therefore, it is best to manually create the mapping classes for your schemas. Of course, you can also use OpenAPI to generate them.

Our recommendation is to use [NSwag](https://github.com/RicoSuter/NSwag). The code generator is also available as a class library to automate the code generation in your CI pipeline.

## Install the SDK

The SDK is available on [nuget.org](https://www.nuget.org/packages/Squidex.ClientLibrary/). You can install it with:

```bash
dotnet add package Squidex.ClientLibrary
```

If you use [Dependency Injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-7.0) (especially in ASP.NET Core) you can use the following package:

```bash
dotnet add package Squidex.ClientLibrary.ServiceExtensions
```

## Instantiate the SDK

As described above, the SDK has been improved with version 15. Therefore, it is best to read one of the following pages, depending on the installed version of the package.

{% content-ref url="version-v15-and-later.md" %}
[version-v15-and-later.md](version-v15-and-later.md)
{% endcontent-ref %}

{% content-ref url="version-v14-and-earlier.md" %}
[version-v14-and-earlier.md](version-v14-and-earlier.md)
{% endcontent-ref %}

### Getting the Code from the Management UI

You can get the initialization code directly from the Management UI. To do so, follow the steps below:

* Go to **Settings** (1).
* Go to **Clients** (2).
* Click the **Connect** (3) button next to the client.

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-04-25_18-46.png" alt=""><figcaption><p>Client settings for the App</p></figcaption></figure>

</div>

Next, click on the third link titled **Connect to your App with SDK** (4) to view instructions.

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-04-25_18-48.png" alt=""><figcaption><p>The connect wizard for the App client</p></figcaption></figure>

</div>

On the next screen, **copy** (5) and paste the sample code applicable for your version to the source file.

{% hint style="info" %}
As of this writing, SDK version 15 has not been deployed to Squidex Cloud. So Squidex Cloud will only show code for version 14.&#x20;
{% endhint %}

<div align="left">

<figure><img src="../../../.gitbook/assets/2023-04-26_23-18.png" alt=""><figcaption><p>The sample code for the client manager</p></figcaption></figure>

</div>

## How to Work with Content Items?

Working with content requires more work!

### Why is there no Code Generation?

The reason there's no code generation is because of the JSON structure of the content data. Let's assume we have a `blog-post` schema with two fields: a localized `title` field and a normal (invariant) `slug` field. The resulting content response would look like the following example:

```javascript
{
   "title": {
      "en": "Hello Squidex",
      "de": "HALLO Squidex"
   },
   "slug": {
      "iv": "hello-squidex"
   }
}
```

When you map a structure to a C# class, every JSON object is mapped to either a dictionary or a class.

A code generator would then create the following class structure and would convert all JSON property names to a _PascalCase_ naming to align the naming with the C# conventions. So, whenever you work with invariant fields you have to access the `Iv` property to get the value.

```csharp
public class BlogPostTitle {
    public string En { get; set; }
    public string De { get; set; }
}

public class BlogPostSlug {
    public string Iv { get; set; }
}

public class BlogPostData {
    public BlogPostTitle Title { get; set; }

    public BlogPostSlug Slug { get; set; }
}
```

This must be repeated for each field and would create a lot of code. Therefore, it is better to create the content classes manually and use custom converters to let the _Newtonsoft JSON serialiser_ deal with this.

### 1. Create Your Class Model

For each schema two classes are needed:

The data object is the structure of your content data.

```csharp
using Newtonsoft.Json;
using Squidex.ClientLibrary;

namespace YourNamespace;

public sealed class BlogPostData
{
    // The invariant converter converts the object to a flat property.
    [JsonConverter(typeof(InvariantConverter))]
    public string Slug { get; set; }

    // For localizable fields you can use dictionaries.
    [JsonProperty("my_title")]
    public Dictionary<string, string> Title { get; set; }
}
```

Another class is created for the blog post itself, which holds the data and metadata.

```csharp
using Squidex.ClientLibrary;

namespace YourNamespace;

public sealed class BlogPost : Content<BlogPostData>
{
}
```

{% hint style="info" %}
Please note that the SDK still uses `Newtonsoft.JSON` and not `System.Text.JSON`. Some types, such as `JSONConverterAttribute` exist in both namespaces, so you have to ensure you add the user to the correct namespace. Otherwise you will get serialization exceptions, because the attributes have not been considered.
{% endhint %}

#### How to Map Fields to .NET Types

This depends on your field type i.e. which .NET type you use for a field.

The following is our recommendation:

<table><thead><tr><th width="197">Field Type</th><th>.NET Type</th></tr></thead><tbody><tr><td>Assets</td><td><code>System.Collections.Generic.List&#x3C;System.Guid></code></td></tr><tr><td>Boolean</td><td><code>bool</code></td></tr><tr><td>DateTime</td><td><code>System.DateTime</code> or <code>System.DateTimeOffset</code></td></tr><tr><td>Geolocation</td><td>A custom class.</td></tr><tr><td>Json</td><td><code>Newtonsoft.Json.Linq.JObject</code> or a custom class.</td></tr><tr><td>Number</td><td><code>double</code></td></tr><tr><td>References</td><td><code>System.Collections.Generic.List&#x3C;System.Guid></code></td></tr><tr><td>String</td><td><code>string</code></td></tr><tr><td>Tags</td><td><code>System.Collections.Generic.List&#x3C;Sstring></code></td></tr><tr><td>Array</td><td>A custom class.</td></tr></tbody></table>

#### Geolocation Classes

At the moment, the SDK does not provide a ready-to-use structure for geolocations, but you can use the following class:

```csharp
public class Geolocation 
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
```

#### Arrays

When you have an array field, you need a class for your array items, for example:

```csharp
using Newtonsoft.Json;
using Squidex.ClientLibrary;

namespace YourNamespace;

public class Comment 
{
    public string Author { get; set; }

    public string Text { get; set; }
}

public sealed class BlogPostData
{
    // For invariant array fields.
    [JsonConverter(typeof(InvariantConverter))]
    public List<Comment> Comments { get; set; }

    // For localized array fields.
    [JsonProperty("my_comments")]
    public Dictionary<string, List<Comment>> Comments  { get; set; }
}
```

{% hint style="info" %}
Please note that the `InvariantConverter`is only needed for root fields.
{% endhint %}

### 2. Instantiate the Client

#### Version 15 and Above

Use the schema name and the created types as arguments.

```csharp
var blogPostsClient =
    client.Contents<BlogPost, BlogPostData>("blog-post");
```

The client is cached and therefore you can call this method as often as you want.

#### Version 14 and Below

Use the schema name and the created types as arguments.

```csharp
var blogPostsClient =
    clientManager.CreateContentsClient<BlogPost, BlogPostData>("blog-post");
```

Do not recreate the client for every request as it is not cached in the client manager.

### 3. Use the Client

Using the client is very easy, for example:

#### Get a Content Item by ID

```csharp
var post = await blogPostsClient.GetAsync("10cb16da-60d2-4ff7-bd2c-47d724a4798c");
```

#### Get a Content Item by ID and Version

```csharp
var post = await blogPostsClient.GetAsync("10cb16da-60d2-4ff7-bd2c-47d724a4798c", 4);
```

#### Create a New Content Item

```csharp
var data = new BlogPostData
{
    Slug = "hello-squidex",
    Title = new Dictionary<string, string>
    {
        ["en"] = "Hello Squidex",
        ["de"] = "Hallo Squidex"
    }
};

await blogPostsClient.CreateAsync(data);
```

#### Update a Content Item

```csharp
var data = new BlogPostData
{
    Slug = "hello-squidex",
    Title = new Dictionary<string, string>
    {
        ["en"] = "Hello Squidex",
        ["de"] = "Hallo Squidex"
    }
};

await blogPostsClient.UpdateAsync("10cb16da-60d2-4ff7-bd2c-47d724a4798c", data);
```

#### Query Items by Filter

```csharp
var posts = await blogPostsClient.GetAsync(new ContentQuery
{
    Filter = $"data/slug/iv eq '{slug}'"
});
```

### Control the Casing

The SDK uses camelCasing when serializing properties, but ignores the casing when deserializing properties. This is important, because Squidex is case sensitive and does not accept unknown properties. Therefore the following data class

```csharp
using Newtonsoft.Json;
using Squidex.ClientLibrary;

namespace YourNamespace;

public sealed class BlogPostData
{
    [JsonConverter(typeof(InvariantConverter))]
    public string Slug { get; set; }
}
```

is serialized to

```json
{
    "slug": "my-blog-post"
}
```

If you want to use PascalCase for your Squidex schema field names you have two options:

You can either disable the conversion to camel case with the `KeepCasingAttribute`:

```csharp
[KeepCasing]
public sealed class BlogPostData
{
    [JsonConverter(typeof(InvariantConverter))]
    public string Slug { get; set; }
}
```

or you control for each property how it will be serialized.

```csharp
[KeepCasing]
public sealed class BlogPostData
{
    [JsonConverter(typeof(InvariantConverter))]
    [JsonProperty("Slug")]
    public string Slug { get; set; }
}
```

## More Samples

We also use the .NET client for API tests. These tests cover almost all endpoints and especially edge cases and are therefore a good reference if you want to understand this class library.

[https://github.com/Squidex/squidex/tree/master/tools/TestSuite](https://github.com/Squidex/squidex/tree/master/tools/TestSuite)
