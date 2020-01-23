---
description: How to retrieve access tokens to get access to the API
---

# Authentication

## Introduction

Squidex uses OpenID Connect and OAuth2.0 as authentication protocols. Both are state of the art specifications and adopted by a lot of internet services. You have already used it when you logged in with your Google account to a third-party website.

The implementation uses [IdentityServer4](https://identityserver.io/), a certified access control solution.

## Basic authentication flow

Lets talk about the general authentication flow first.

### 1. Generate Clients

Before you get an access token you have to create a client first. A client is just another name for an application and could be a mobile app, a public website, single page application or a backend server.

If you create a new app, it has already a default client.

![Create a new client](../../../.gitbook/assets/image%20%289%29.png)

Each client has also a role assigned to define which updates or queries can be performance with the client. This is particularly useful when your client is a public application that can easily be reversed engineer like a mobile app or single page application. You can store your client credentials \(client id and client secret\) in the application but you have to ensure, that you give your client only the necessary permissions and not more.

Read more about permissions:

{% page-ref page="../../concepts/permissions.md" %}

### 2. Request a token

The client id and secret cannot be used directly in the API calls. You have to make an additional request to identity-server first to get an access token. This token is then valid for 30 days. 

{% api-method method="post" host="https://cloud.squidex.io/identity-server/connect/token" path="" %}
{% api-method-summary %}
Get access token
{% endapi-method-summary %}

{% api-method-description %}
Get an access token from squidex identity.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-form-data-parameters %}
{% api-method-parameter name="scope" type="string" required=true %}
squidex-api
{% endapi-method-parameter %}

{% api-method-parameter name="client\_secret" type="string" required=true %}
**&lt;YOUR\_CLIENT\_SECRET&gt;**
{% endapi-method-parameter %}

{% api-method-parameter name="client\_id" type="string" required=true %}
**&lt;YOUR\_CLIENT\_ID&gt;**
{% endapi-method-parameter %}

{% api-method-parameter name="grant\_type" type="string" required=true %}
client\_credentials
{% endapi-method-parameter %}
{% endapi-method-form-data-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
The token response.
{% endapi-method-response-example-description %}

```
{
    "access_token":"<YOUR_ACCESS_TOKEN>,
    "expires_in":2592000,  // Expiration in seconds, 30 days
    "token_type":"Bearer",
    "scope":"squidex-api"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

Or just make a request with curl:

```bash
curl
    -X POST 'https://cloud.squidex.io/identity-server/connect/token'
    -H 'Content-Type: application/x-www-form-urlencoded'
    -d 'grant_type=client_credentials&
        client_id=<YOUR_CLIENT_ID>&
        client_secret=<YOUR_CLIENT_SECRET>&
        scope=squidex-api
```

### 3. Use the token

Add the returned token to all consecutive requests:

```bash
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

## How to deal with the access token

An often asked question is how to deal with the access token, because there are a few challenges:

1. The token is only valid for 30 days.
2. The token might expire sooner, for example when a certificate is replaced on the server.
3. You need an additional request to get the token.

Our recommendation is to use the following pattern \(pseudo code\):

```javascript
function makeRequest(url, body) {
    const token = getTokenFromCache();
    
    if (!token) {
        token = getToken(clientId, clientSecret);
        
        storeTokenInCache(token, days: 30);
    }
    
    const response = makeRequestToSquidex(url, body);
    
    // Token has probably expired. 
    if (response.status == 401) {
        // Request the token again.
        token = getToken(clientId, clientSecret);
        
        storeTokenInCache(token, days: 30);
        
        // Try the request again.
        response = makeRequestToSquidex(url, body);
    }
    
    // You can still have a 401 here, but this very likely not an epxired token then.
    return response;
}
```

As you can see, we use a simple memory cache to keep our token. We request a new token when it has been expired in the cache or on the server and before the first request after our application started.

You can also request multiple tokens in parallel, for example when you have a cluster of servers. There is no need to sync the access tokens between your servers or to keep them in a centralized cache.

