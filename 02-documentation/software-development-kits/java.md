---
description: Easy installation and setup of the Java SDK.
---

# Java

## Introduction

The SDK is mostly generated from the OpenAPI specification. You can read the API documentation here:[ https://cloud.squidex.io/api/docs](https://cloud.squidex.io/api/docs).

This means that the API is fully covered, including all endpoints used by the frontend. You can also use the SDK to create and configure Apps, schemas and rules.&#x20;

Use this SDK in your Java application to integrate with Squidex CMS.

## Install the SDK

The SDK is available on [Maven](https://mvnrepository.com/artifact/io.squidex/squidex). The installation depends on your build system.

### Maven

Add the dependency in your `build.gradle`:

```groovy
dependencies {
    implementation 'io.squidex:squidex:1.0.0'
}
```

### Maven

Add the dependency in your `pom.xml:`

```xml
<dependency>
    <groupId>io.squidex</groupId>
    <artifactId>squidex</artifactId>
    <version>1.0.0</version>
</dependency>// Some code
```

## Instantiate the SDK

The `SquidexClient` is the main entry point for the SDK. It provides the properties for all endpoints.

You can instantiate the client using the following code snippet:

```php
SquidexClient squidex = SquidexClient.builder()
    .appName("my-app")
    .clientId("your-app:default")
    .clientSecret("xxx")
    .url("https://your.squidex-deployment")
    .build();
```

The `url` parameter is optional if you are using Squidex Cloud.

### Additional Configuration

In this article, we will cover some of the important configuration values only. The client is based on the [OkHttp ](https://square.github.io/okhttp/)library to support all platforms including Android. Therefore many configuration options are available throug passing a custom client to Squidex. This client gets cloned to make customizations, for example for authentication.

#### Timeout

Configure a timeout in seconds to cancel unresponsive requests.

<pre class="language-php"><code class="lang-php">OkHttpClient client = new OkHttpClient.Builder()
<strong>    .connectTimeout(10, TimeUnit.SECONDS)
</strong>    .writeTimeout(10, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .build();
        
SquidexClient squidex = SquidexClient.builder()
    ...
    .httpClient(client)
    .build();
</code></pre>

The default timeout is 30 seconds.

Read more: [https://square.github.io/okhttp/recipes/#timeouts-kt-java](https://square.github.io/okhttp/recipes/#timeouts-kt-java)

#### Token Store

The SDK uses the client ID and the client secret to acquire a bearer token, and handles invalidation and expiration automatically. By default the token is stored inside the client and therefore a new token is acquired when the client is cleaned by the garbage collector. However, one can define where the token is stored.&#x20;

```java
SquidexClient squidex = SquidexClient.builder()
    ...
    .tokenStore(new MyTokenStore())
    .build();
```

#### Ignore Certificates

By default the certificates are validated. But for test environments it might be necessary to connect to instances with self signed certificates only. Therefore we have introduced an option to ignore the certificate chain:

```java
SquidexClient squidex = SquidexClient.builder()
    ...
    .trustAllCerts()
    .build();
```

## Use the Client

To use the client you have to use the correct property.

For example, to create a schema use the `schemas` property.

<pre class="language-java"><code class="lang-java">CreateSchemaDto request = CreateSchemaDto.builder()
    .name("my-schema")
    .fields(Collections.singletonList(
        UpsertSchemaFieldDto.builder()
<strong>            .name("field1")
</strong>            .properties(
                FieldPropertiesDto.string(
                    StringFieldPropertiesDto.builder()
                    .build()))
<strong>                .build()))
</strong>    .isPublished(true)
    .build();

SchemaDto createdSchema = client.schemas().postSchema(request);
</code></pre>

In order to work with contents, use the `contents` property.

```php
Map<String, Map<String, Object>> dataItem = new HashMap<>();
Map<String, Object> dataField = new HashMap<>();
dataItem.put("field1", dataField);
dataField.put("iv", id);

ContentsPostContentRequest request = ContentsPostContentRequest.builder()
    .body(dataItem)
    .publish(true)
    .build();
    
client.contents().postContent(schema.getName(), request);
```

### Error Handling

The SDK uses exceptions for error handling.&#x20;

Refer to the code snippet below for an example:

<pre class="language-php"><code class="lang-php">try {
    client.client().apps().postApp(
        CreateAppDto.builder()
            .name("my-app")
            .build());
} catch (ApiError ex) {
<strong>    if (ex.statusCode() == 400) {
</strong>        System.out.println("App probably already exists.");
        return;
    } else {
        throw ex;
    }
}
</code></pre>

## Limitations

As of this writing, the SDK has the following limitations:

1. Endpoints to download files (e.g. assets) return a stream only and not metadata information like the content type or the content length.
2. Endpoints to download files work for Node only and are not available in the browser. This is generally not an issue as assets are handled via direct links in the browser.
3. The generated builders all follow the staged builder pattern. For untyped data, e.g. content items the builder is not available yet and you have to construct the data structure manually using hash maps and arrays.
4. Deprecated methods and properties are not annotated yet.
