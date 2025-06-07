---
description: Learn how to use the TypeScript SDK for Node and Browsers.
---

# TypeScript

## Introduction

The SDK is mostly generated from the OpenAPI specification. You can read the API documentation here:[ https://cloud.squidex.io/api/docs](https://cloud.squidex.io/api/docs).

This means that the API is fully covered, including all endpoints used by the frontend. You can also use the SDK to create and configure Apps, schemas and rules.&#x20;

Use this SDK in your TypeScript or JavaScript application to integrate with Squidex CMS.

## Install the SDK

The SDK is available on [npm](https://www.npmjs.com/package/@squidex/squidex) registry. You can install it with:

```bash
npm install @squidex/squidex --save
```

or

```bash
yarn add @squidex/squidex
```

The SDK has no peer dependencies and will add/install all required packages.

## Instantiate the SDK

The `SquidexClient` is the main entry point for the SDK. It provides the properties for all endpoints.

You can instantiate the client using the following code snippet:

```typescript
import { SquidexClient } from "@squidex/squidex";

const sdk = new SquidexClient({
    appName: "your-app",
    clientId: "your-app:default",
    clientSecret: "xxx",
    environment: "https://cloud.squidex.io"
});
```

The `environment` parameter is optional if you are using Squidex Cloud.

### Additional Configuration

In this article, we will cover some of the important configuration values only. Have a look at the source code for all available options: [https://github.com/Squidex/sdk-node/blob/main/src/wrapper/SquidexClient.ts#L8](https://github.com/Squidex/sdk-node/blob/main/src/wrapper/SquidexClient.ts#L8)

#### Timeout

Configure a timeout in milliseconds to cancel unresponsive requests.

```typescript
const client = new SquidexClient({
    ...
    timeoutInMs: 5000
});
```

#### Token Store

The SDK uses the client ID and the client secret to acquire a bearer token, and handles invalidation and expiration automatically. By default the token is stored inside the client and therefore a new token is acquired when the client is cleaned by the garbage collector. However, one can define where the token is stored.&#x20;

You can store the token in the local store.

```typescript
const client = new SquidexClient({
    ...
    tokenStore: new SquidexClient.StorageTokenStore()
});
```

One can also store the token in the session store using the following configuration:

```typescript
const client = new SquidexClient({
    ...
    tokenStore: new SquidexClient.StorageTokenStore(sessionStore, 'MyTokenKey')
});
```

#### Interceptors

You can control the HTTP request flow with interceptors. They work similar to a middleware in NodeJS. Because the SDK has separate pipelines for normal requests and streaming requests (when downloading a file), you should ideally implement both interceptors.

For example you can add custom headers using the following code snippet:

```typescript
const client = new SquidexClient({
    ...
    fetcherInterceptor: next => {
        return args => {
            args.headers ??= {};
            args.headers['Key'] = 'Value';
            return next(args);
        }
    },
    streamingFetcherInterceptor: next => {
        return args => {
            args.headers ??= {};
            args.headers['Key'] = 'Value';
            return next(args);
        }
    },
});
```

Use the following code snippet example to implement retry requests:

```typescript
const client = new SquidexClient({
    ...
    fetcherInterceptor: next => {
        return args => {
            const NUM_ATTEMPTS = 5;
            for (let attempt = 1; attempt <= NUM_ATTEMPTS; attempt++) {
                try {
                    return next(args);
                } catch (ex) {
                    if (attempt === NUM_ATTEMPTS) {
                        throw ex;
                    }
                }
            }

            throw new Error('Max attempts reached without error.');
        }
    }
});
```

## Use the Client

To use the client you have to use the correct property.

For example, to create a schema use the `schemas` property.

```typescript
const createdSchema =
    await client.schemas.postSchema({
        name: "my-schema",
        fields: [{
            name: "field1",
            properties: {
                fieldType: "String",
            },
        }],
        isPublished: true,
    });
```

In order to query contents, use the `contents` property.

```typescript
const createdContent = 
    await client.contents.postContent("my-schema", {
        body: {
            field1: {
                iv: "My-Value"
            }
        }
    });
```

### Error Handling

The SDK uses exceptions for error handling.&#x20;

Refer to the code snippet below for an example:

```typescript
import { SquidexClient, SquidexError } from "@squidex/squidex";

const client = new SquidexClient({
    ...
});

try {
    await client.contents.postContent("my-schema", { ... });
} catch (ex) {
    if (ex instanceof SquidexError && ex.statusCode === 400) {
        console.log("Validation Error");
    }
}
```

## Limitations

As of this writing, the SDK has the following limitations:

1. Endpoints to download files (e.g. assets) return a stream only and not metadata information like the content type or the content length.
2. Endpoints to download files work for Node only and are not available in the browser. This is generally not an issue as assets are handled via direct links in the browser.
3. When logging an instance of the `SquidexError` class, only the message is written. But the instance also contains the error object from the API that has detailed information about the problem, especially for validation errors. Therefore, it is recommended to convert the error to a JSON string before logging it.
4. Deprecated methods and properties are not annotated yet.

