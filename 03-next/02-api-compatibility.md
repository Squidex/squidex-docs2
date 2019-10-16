# API v3.0 Compatibility

The API for Squidex 3.0 contains a lot of changes to 2.0. This document describes the main differences.

The good first: There is no change in the endpoints to retrieve contents or assets, including the GraphQL endpoint.

## Motivation

These changes are driven by two requirements:

1. `POST` and `PUT` enpoints must return the full entity (e.g. schema object) so that the UI does not have to reason about how the entity will be structured after an updated.
2. Implement `HATEOAS` (Hypermedia As The Engine Of Application State) to tell the client which operations are possible for a given entity and how to invoke them.

Given the list of apps as an example, our JSON response has the following format now:

```json
{
   "items": [{
       "id": 1,
       "name": "my-app",
       "_links": {
          "delete": { "method": "DELETE", "href": "/api/apps/1" }
       }
    }],
    "_links": {
        "create": { "method": "POST", "href": "/api/apps" }
     }
}
```

This format will be called **Items-Object** from now.

A single app in 3.0 has the following format:

```json
{
    "id": 1,
    "name": "my-app",
    "_links": {
        "delete": { "method": "DELETE", "href": "/api/apps/1" }
    }
}
```

If Squidex 2.0 and lower the list of apps was returned as a JSON array, therefore it was not be possible to add the links to the create endpoint.

```json
[{
    "id": 1,
    "name": "my-app",
    "_links": {
        "delete": { "method": "DELETE", "href": "/api/apps/1" }
    }
}]
```

## General changes

### 1. HATEOAS

As described above each entity or list of entities will contain a `_links` object now, with all possible operations. If the operation is not possible or the current user does not have the permission the link will not be present.

> RISK to break something: **LOW**

### 2. Metadata

Data that is not part of the entity, but must be returned as a result of the operation is added to a `_meta` object.

Example: When you upload an asset, the API checks if the same asset has already been uploaded. If this is the case the response will contain the uploaded asset with an additional information if this asset was already part of the app:

```json
{
    "id": 1,
    "fileName": "Logo.jpeg",
    "fileSize": 1024,
    "_links": {
        "delete": { "method": "DELETE", "href": "/api/assets/1" }
    },
    "_meta": {
        "isDuplicate": "1"
    }
}

```

> RISK to break something: **LOW**

### 3. Full response objects

All `POST` and `PUT` enpoints return the full entity (e.g. schema object) now. This is not a breaking change for you if your client has the following behavior:

1. The client does not break when the JSON response contains additional properties.
2. The client does not break when an enpoint that has returned a `204 No Content` status code before, returns `200 OK` now (usally the case).
3. The client does not break when an endpoint tht has not returned a JSON response before, returns a response now.

> RISK to break something: **MEDIUM**

## Specific changes

### Contents

The following endpoints have been removed to be prepared for the coming workflow system:

* `PUT /api/content/{app}/{name}/{id}/archive/`
* `PUT /api/content/{app}/{name}/{id}/publish/`
* `PUT /api/content/{app}/{name}/{id}/restore/`
* `PUT /api/content/{app}/{name}/{id}/unpublish/`

The replacement is a generalized status endpoint

```json
PUT /api/content/{app}/{name}/{id}/status/

{
    "status": "Published"
}
```

> RISK to break something: **HIGH**

### Assets

1. `POST /api/apps/{app}/assets/` does not return the `isDuplicate` JSON property anymore, which has been replaced with metadata (see example above).

> RISK to break something: **LOW**

### Rules

1. `GET /api/apps/{app}/rules/` endpoint returns **Items-Object** instead of JSON array.

> RISK to break something: **LOW**

### Apps

1. `GET /api/apps/` endpoint returns **Items-Object** instead of JSON array.
1. `GET /api/apps/{app}/clients/` endpoint returns **Items-Object** instead of JSON array.
1. `GET /api/apps/{app}/languages/` endpoint returns **Items-Object** instead of JSON array.
1. `GET /api/apps/{app}/contributors/` endpoint returns **Items-Object** instead of custom JSON object.
1. `GET /api/apps/{app}/patterns/` endpoint returns **Items-Object** instead of JSON array.
1. `GET /api/apps/{app}/roles/` endpoint returns **Items-Object** instead of custom JSON object.

> RISK to break something: **LOW**

