---
description: Gives you an overview about the different APIs.
---

# API

With the API you can:

* ... create, change or query your content.
* ... upload, download or query assets.
* ... make complex queries with the GraphQL endpoint.
* ... execute all management operations such as creating apps, schemas, rules and updating settings.

The Management UI is using the same endpoints. If you can do something manually you can also do it with code.

The next paragraph will give you and introduction about the different endpoints. Then we have some useful links to additional pages about specific aspects of the API.

## Different endpoints

Technically the API has only a single endpoint, but we generate different documentations for the different areas and aspects of the UI.

### Content API

Each app has its own content API. The documentation is generated when you change your schemas and is tailored for your content structure.

You can find the link to your Content API in the API section of the Management UI:

![Link to content API](../../../.gitbook/assets/image%20%2813%29.png)

For example, this this is the Content API for my \(Sebastian, CTO\) personal profile page:

[https://cloud.squidex.io/api/content/sebastians-profile/docs](https://cloud.squidex.io/api/content/sebastians-profile/docs)

### Content GraphQL API

The [GraphQL ](https://graphql.org/)endpoint is also generated per client. The documentation is provided by GraphiQL, an integrated, interactive GraphQL query editor. This endpoint can only be used to query content items and assets. Mutations have not been implemented yet, due several restrictions with the underlying GraphQL framework.

![Link to your GraphQL API](../../../.gitbook/assets/image%20%282%29.png)

### General API

The rest of the API is the same for all your apps. This includes endpoints to query and manipulate apps, schemas, assets, rules and all settings. For the cloud the generated documentation and can be found at:

[https://cloud.squidex.io/api/docs](https://cloud.squidex.io/api/docs)

## Further pages

If you want to jump into the details of the API these pages might be helpful:

### How to get started with Postman

{% page-ref page="postman.md" %}

### How to use the Query system to filter Content

{% page-ref page="api.md" %}

### How to download and resize Assets

{% page-ref page="assets-api.md" %}

## 

