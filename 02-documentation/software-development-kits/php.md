---
description: Software Development Kit for all PHP platforms
---

# PHP

## Introduction

The SDK is mostly generated from the OpenAPI specification. You can read the API documentation here:[ https://cloud.squidex.io/api/docs](https://cloud.squidex.io/api/docs).

This means that the API is fully covered, including all endpoints used by the frontend. You can also use the SDK to create and configure Apps, schemas and rules.&#x20;

Use this SDK in your PHP application to integrate with Squidex CMS.

## Install the SDK

The SDK is available on [packagist (compose)](https://packagist.org/packages/squidex/squidex). You can install it with:

```sh
compose install @squidex/squidex
```

Composer is a dependency manager for PHP: [https://getcomposer.org/](https://getcomposer.org/)

## Instantiate the SDK

The `SquidexClient` is the main entry point for the SDK. It provides the properties for all endpoints.

You can instantiate the client using the following code snippet:

```php
use Squidex\Client\Configuration;
use Squidex\Client\SquidexClient;

require_once __DIR__ . '/../vendor/autoload.php';

$config = new Configuration();
$config->setClientId('client-id');
$config->setClientSecret('client-secret');
$config->setAppName('my-app');
$config->setHost('https://cloud.squidex.io');

$client = new SquidexClient($config);

```

The `host` parameter is optional if you are using Squidex Cloud.

### Additional Configuration

In this article, we will cover some of the important configuration values only. Have a look at the source code for all available options:\
[https://github.com/Squidex/sdk-php/blob/main/lib/Configuration.php](https://github.com/Squidex/sdk-php/blob/main/lib/Configuration.php)

#### Timeout

Configure a timeout in seconds to cancel unresponsive requests.

```php
$config = new Configuration();
...
$config->setTimeout(60.0);
```

The default timeout is 30 seconds.

#### Token Store

The SDK uses the client ID and the client secret to acquire a bearer token, and handles invalidation and expiration automatically. By default the token is stored inside the client and therefore a new token is acquired when the client is cleaned by the garbage collector. However, one can define where the token is stored.&#x20;

```php
$config = new Configuration();
...
$config->setTokenStore(new MyTokenStore());
```

#### Ignore Certificates

By default the certificates are validated. But for test environments it might be necessary to connect to instances with self signed certificates only. Therefore we have introduced an option to ignore the certificate chain:

```php
$config = new Configuration();
...
$config->setIgnoreCertificates(true);
```

## Use the Client

To use the client you have to use the correct property.

For example, to create a schema use the `schemas` property.

```php
$id = uniqid();

$field = new UpsertSchemaFieldDto();
$field->setName('field1');
$field->setProperties(new StringFieldPropertiesDto());

$request = new CreateSchemaDto();
$request->setName("my-schema");
$request->setIsPublished(true);
$request->setFields([$field]);

$createdSchema = $this->client->schemas()->postSchema($request);
```

In order to work with contents, use the `contents` property.

```php
$data = [
    'field1' => [
        'iv' => 'My Value'
    ]
];
    
$createdContent = $this->client->contents()->postContent(static::$schema->getName(), $data);
```

### Error Handling

The SDK uses exceptions for error handling.&#x20;

Refer to the code snippet below for an example:

```php
try {
    $request = new CreateAppDto();
    $request->setName($appName);

    $client->getClient()->apps()->postApp($request);
} catch (ApiException $e) {
    if ($e->getCode() == 400) {
        echo "App probably already exists.\n";
    } else {
        throw $e;
    }
}
```
