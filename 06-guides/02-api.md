# API

We demonstrate the API concepts based on the following example:

## Example

Lets assume you have an app `geodata` with two languages (en, de) and a schema `cities` with two fields:

1. `name`: String (localizable)
2. `population`: Number (not localizable)

Then your content has the following structure in the API:

```json
{
    "id": "01",
    "created": "2017-02-25T19:56:35Z",
    "createdBy": "...",
    "lastModified": "2017-02-25T19:56:35Z",
    "lastModifiedBy": "...",
    "data": {
        "name": {
            "de": "München",
            "en": "Munich"
        },
        "population": {
            "iv": 1400000
        }
    }
}
```

## General structure

Please note that each field has an partitioning defined. It says how each field is structured. The most simple partitioning is the invariant partitition, which only allows a single key `iv`. 
If the field is localizable we use the iso codes from the languages that you defined in your app settings as keys.

Read more about it at [here](/04-concepts/01-localization.md).

## OData Conventions
The Squidex API supports the OData url convention to query data. 

We support the following query options.

### $top

The `$top` query option requests the number of items in the queried collection to be included in the result. The default value is 20 and the maximum allowed value is 200.

    https://cloud.squidex.io/api/content/geodata/cities?$top=30

### $skip

The `$skip` query option requests the number of items in the queried collection that are to be skipped and not included in the result. Use it together with $top to read the all your data page by page.

    https://cloud.squidex.io/api/content/geodata/cities?$skip=20

or combined with top

    https://cloud.squidex.io/api/content/geodata/cities?$skip=20&$top=30

### $search

The $search query option allows clients to request entities matching a free-text search expression. We add the data of all fields for all keys to a single field in the database and use this combined field to implement the full text search.

    https://cloud.squidex.io/api/content/geodata/cities?$search=Munich

> Note: You can either use `$search` or `$filter` but not both.

### $filter

The $filter system query option allows clients to filter a collection of resources that are addressed by a request URL.

Find the city with the english name Munich

    https://cloud.squidex.io/api/content/geodata/cities?$filter=data/name/de eq Munich

Find all cities with a population or more than 100000 people

    https://cloud.squidex.io/api/content/geodata/cities?$filter=data/population/iv gt 100000


Find all the term items which belong to a certain vocabulary item: let's say you'd like to `tag` your articles and you'd like to categorize these tags. 
In this case you would have a `term` schema and a `vocabulary` schema. Each `term` would have a reference field to `vocabulary` 
with the validation set to only allow a single element. 
To find only those `term` items which belong to `vocabulary` with id `e46aca5e-5067-408f-b90f-ea441314385a` you would do the following request:

    https://cloud.squidex.io/api/content/testapp/term?$filter=data/vocabulary/iv eq 'e46aca5e-5067-408f-b90f-ea441314385a'

> Note: You can either use `$search` or `$filter` but not both.

#### More examples

Date must match value:

    $filter=created eq 1988-01-19T12:00:00Z

Date must match one of many values:

    $filter=created in ('1988-01-19T12:00:00Z', '2011-01-22T08:00:00Z')

Id must match value:

    $filter=id eq B5FE25E3-B262-4B17-91EF-B3772A6B62BB
    $filter=id in (B5FE25E3-B262-4B17-91EF-B3772A6B62BB, 311DD333-B262-4B17-91EF-B3772A6B62BB)

Name must match string value:

    $filter=firstName eq 'Dagobert'

Boolean must match value:

    $filter=isComicFigure eq true

Age must must be equal to number:

    $filter=age eq 60

String property should start with, ends with or contain a string:

    $filter=startswith(lastName, 'Duck')
    $filter=endswith(lastName, 'Duck')
    $filter=contains(lastName, 'Duck')

Different conditions

    $filter=age ne 1 // Not equals
    $filter=age eq 1 // Equals
    $filter=age lt 1 // Less than
    $filter=age le 1 // Less or equals than
    $filter=age gt 1 // Greater than
    $filter=age ge 1 // Greater or equals than

Combine different conditions:

    $filter=contains(lastName, 'Duck') eq false and isComicFigure eq true // AND: Both condition must be true
    $filter=contains(lastName, 'Duck') eq false or  isComicFigure eq true // OR: One condition must be true

#### Encoding 

Single quotes (`'`) in text values must be replaced with double single quotes (`''`).

### $orderby

The $orderby system query option allows clients to request resources in a particular order.

e.g. find the top 20 biggest cities by population:

    https://cloud.squidex.io/api/content/geodata/cities?$orderby=data/population/iv desc$top=20

Read more about OData at: http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html

## Published

By default the content api returns published content only. You can use the `X-Unpublished` header to also return draft content.

## Consistency

The API uses the eventual consistency. Events are handled in the background as described under [architecture](../02-architecture/01-overview.md). This means that it can take to up a second until the data is available to the query side. Under very high load it can even take more time. If you receive a success status code when you create or update an content you have the guarantee, that it has been written to the database successfully. You can also make another write operation directly, e.g. to publish the content.

There are some tricks to deal with it in the UI: http://danielwhittaker.me/2014/10/27/4-ways-handle-eventual-consistency-ui/. In our opinion this leads to a more stable and faster UI and server and it is worth it.

### Versioning

The API tracks the version of each content element and provides this information in the `ETag` content header if you make an update (POST, PUT, PATCH) or if you request a single resource. If you request multiple resources, the version is provided as a field to each entry.

You can use this header for two use cases:

1. When you make an update you get the new version. This information can be used to find out if your change has already been written to the read store when you receive the same resource after your update.

2. When you make an update you can use the `If-Match` header to pass the expected version to the API. If the version does not match to the version in the database another user or client has changed the same resource. Then the `412 (Precondition Failed)` status code is returned. You should provide this information to the user and ask if the user wants to reload the data or if the resource should be overwritten (just do not use the `If-Match` header for the second request).

Read more about the If-Match header at: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match

> NOTE: Property names with dashes are not supported in OData. Use underscore instead.
