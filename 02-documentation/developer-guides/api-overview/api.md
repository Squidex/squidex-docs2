---
description: How to query content with filters, sorting and pagination.
---

# Queries

## Query Options

Squidex has a query engine that allows different query languages. So far the following query languages are available:

1. **OData queries** that is the first system that has been implemented using an existing solution that was easy to adapt, they are easier to write in URLs.
2. **JSON queries** are newer and are mainly used the UI, because they are faster and easier to parse. It is recommended to use JSON queries in your client.

Both query languages support the same features:

1. Filters with complex comparison operators, conjunctions and negations.
2. Full text search.
3. Sorting by one or multiple fields.
4. Skipping items and restricting the size of the result set for pagination.

### OData Queries

OData is an open [protocol](https://en.wikipedia.org/wiki/Protocol\_\(computing\)) which allows the creation and consumption of queryable and inoperable APIs in a simple and standardized way. It was designed and developed by Microsoft and provides ready to use solutions. We have decided to use the Query syntax because we wanted to leverage an existing system and parser and found it easy to adapt to our needs.

The queries are provided over the URL and have a special syntax. OData query options start with a dollar character, e.g. `$filter`.

An example:

```
https://.../api/content/geodata/cities?$top=30&$skip=10&$search=Munich
```

{% hint style="info" %}
Even though we use OData, we do not support the full capabilities and there are no plans to do so. Some features like select, expand or formatting can be better handled with GraphQL.
{% endhint %}

The full OData convention can be read at:

{% embed url="https://www.odata.org/documentation/odata-version-2-0/uri-conventions/" %}

### Json Queries

JSON queries will be passed in as URL encoded JSON objects with the `q` query parameter. They are much harder to read for humans but easier and faster to parse. It has been introduced when a new query editor was implemented for the Management UI.

An example

```
https://.../api/content/geodata/cities?q=%7B%22fullText%22%3A%22website%22%2C%22take%22%3A10%2C%22sort%22%3A%5B%5D%2C%22filter%22%3A%7B%22and%22%3A%5B%5D%7D%7
```

As you can see it is horrible to read, therefore we will just show normal JSON examples from now on.

## Content structure

We demonstrate the API concepts based on the following example:

Lets assume you have an app `geodata` with two configured languages: German (de) and English (en).

We also have a schema `cities` with these fields:

| Name              | Type        | Localizable | Description                              |
| ----------------- | ----------- | ----------- | ---------------------------------------- |
| `name`            | String      | Yes         | The name of the city.                    |
| `population`      | Number      | No          | The number of people living in the city. |
| `foundation-year` | Number      | No          | The foundation year.                     |
| `districts`       | References  | No          | References to district content items.    |
| `tags`            | Tags        | No          | Search tags.                             |
| `isCapital`       | Boolean     | No          | Indicates whether the city is a capital  |
| `location`        | Geolocation | No          | The location of the city.                |

Then your content has the following structure in the API:

```javascript
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
        },
        "foundation-year": {
            "iv": 1200
        },
        "districts": {
            "iv": [
                "5921b6f7-9584-49ef-b112-4b830cd0b87a"
            ]
        },
        "tags": {
            "iv": ["Bavaria", "Beer"]
        },
        "isCapital": {
            "iv": true
        },
        "location": {
            "iv": {
               "longitude": 11.576124
               "latitude": 48.137154
            }
        }        
    }
}
```

Please note that there is one object for each field, because each field has a partitioning. It defines how the field is structured. The most simple partitioning is the invariant partition, which only allows a single key `iv`. If the field is localizable we use the languages codes from the languages that you defined in your app settings as keys.

Read more about localization:

{% content-ref url="../../concepts/localization.md" %}
[localization.md](../../concepts/localization.md)
{% endcontent-ref %}

### How to identity fields

To identify a field of our content item we use the full path to this field, separated by hashes, for example

* `id`
* `createdBy`
* `data/name/en`
* `data/name/iv`
* `data/population/iv`

### Special cases

#### Dot Notation in JSON queries

When you use JSON queries, you can also use the dot-notation to have a syntax that is closer to Javascript and other programming languages. It is recommended to use this notation. For example:

* `data.population.iv`

#### OData Restrictions

In OData dash characters (-) are not allowed. Therefore you have to replace them with underscore in your queries. To identify the `foundation-year` field we would use

* `data/foundation_year/iv`in OData
* `data.foundation-year.iv`in JSON queries.

## Query Features

### Limiting the number of results

The `top` / `take` query option requests the number of items in the queried collection to be included in the result. The default value is 20 and the maximum allowed value is 200.

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/geodata/cities?$top=30
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "take": 30
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Because of a stupid error the parameter is called **top** in OData and **take** in JSON.
{% endhint %}

### Skipping items in the result set

The `skip` query option requests the number of items in the queried collection that are to be skipped and not included in the result. Use it together with `top` / `take` to read the all your data page by page.

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/geodata/cities?$skip=20
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "skip": 20
}
```
{% endtab %}
{% endtabs %}

or combined with `top` / `take`

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$skip=20&$top=30
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "skip": 20,
    "take": 30
}
```
{% endtab %}
{% endtabs %}

### Get random items

You can get random operators with the `random`option:

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/geodata/cities?$random=5
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "random": 5
}
```
{% endtab %}
{% endtabs %}

The random operator picks elements from the result set, not from the entire database, for example this query returns 5 random items from the first 200 elements with the default order:

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/geodata/cities?$random=5&$top=200
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "random": 5,
    "take": 200%%&% 
}
```
{% endtab %}
{% endtabs %}

### Full text searches

The search query option allows clients to request entities matching a free-text search expression. We add the data of all fields for all keys to a single field in the database and use this combined field to implement the full text search.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$search=Munich
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "fullText": "Munich"
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can either use **search or filter** but not both.
{% endhint %}

### Filters

The filter system query option allows clients to filter a collection of resources that are addressed by a request URL.

Find the city with the name _Munich_ in English.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$filter=data/name/en eq Munich
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.name.en",
      "op": "eq"
      "value": "Munich"
   }
}
```
{% endtab %}
{% endtabs %}

Find all cities with a population or more than 100000 people

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$filter=data/population/iv gt 100000
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.population.iv",
      "op": "gt"
      "value": 100000
   }
}
```
{% endtab %}
{% endtabs %}

For example when you want to filter by the foundation year (foundation).

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$filter=data/foundation_year/iv lt 1000
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.foundation-year.iv",
      "op": "lt"
      "value": 1000
   }
}
```
{% endtab %}
{% endtabs %}

#### Array

If you have fields that have array of values, for example references that are represented as an array of content ids, you can still the equal operator. The API will return a content item if at least one item in the array is equal to the passed in value.

For example when we search by tags.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/app/term?$filter=data/tags/iv eq 'Beer'
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.tags.iv",
      "op": "eq"
      "value": "Beer"
   }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can either use **search** or **filter** but not both.
{% endhint %}

#### More examples

An array (components, array fields, references, assets, strings) cannot be empty:

{% tabs %}
{% tab title="First Tab" %}
```
// Some code
```
{% endtab %}
{% endtabs %}

Date must match value:

{% tabs %}
{% tab title="OData" %}
```
$filter=created eq 1988-01-19T12:00:00Z
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "created ",
      "op": "eq"
      "value": "1988-01-19T12:00:00Z"
   }
}
```
{% endtab %}
{% endtabs %}

Date must match one of many values:

{% tabs %}
{% tab title="OData" %}
```
$filter=created in ('1988-01-19T12:00:00Z', '2011-01-22T08:00:00Z')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "created ",
      "op": "in"
      "value": [
         "1988-01-19T12:00:00Z",
         "2011-01-22T08:00:00Z"
      }
   }
}
```
{% endtab %}
{% endtabs %}

Id must match value:

{% tabs %}
{% tab title="OData" %}
```
$filter=id eq B5FE25E3-...
---
$filter=id in (B5FE25E3-..., 311DD333-...)
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "id",
        "op": "eq",
        "value": "B5FE25E3-..."
    }
}

---

{
    "filter": {
        "path": "id",
        "op": "eq",
        "value": [
            "B5FE25E3-...",
            "311DD333-..."
        }
    }
}
```
{% endtab %}
{% endtabs %}

Name must match string value:

{% tabs %}
{% tab title="OData" %}
```
$filter=data/name/en eq 'Munich'
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.name.en",
        "op": "eq",
        "value": "Munich"
    }
}
```
{% endtab %}
{% endtabs %}

Boolean must match value:

{% tabs %}
{% tab title="OData" %}
```
$filter=data/isCapital/iv eq true
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.isCapital.iv",
        "op": "eq",
        "value": true
    }
}
```
{% endtab %}
{% endtabs %}

Number must match a value:

{% tabs %}
{% tab title="OData" %}
```
$filter=data/population/iv eq 1000000
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.population.iv",
        "op": "eq",
        "value": 1000000
    }
}
```
{% endtab %}
{% endtabs %}

String property should start with, ends with or contain a string:

{% tabs %}
{% tab title="OData" %}
```
$filter=startswith(data/name/en, 'Mun')
$filter=startswith(data/name/en, 'Mun') eq true // Aquivalent
---
$filter=endswith(data/name/en, 'ich')
---
$filter=contains(data/name/en, 'ich')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.name.en",
        "op": "startsWith",
        "value": "Mun"
    }
}
---
{
    "filter": {
        "path": "data.name.en",
        "op": "endsWith",
        "value": "ich"
    }
}
---
{
    "filter": {
        "path": "data.name.en",
        "op": "contains",
        "value": "ich"
    }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**contains**, **startsWith** and **endsWith** are always case insensitive.
{% endhint %}

String property should match to a regex pattern:

{% tabs %}
{% tab title="OData" %}
```
$filter=matchs(data/name/en, 'a-z') // Case insensitive
---
$filter=matchs(data/name/en, '/a-z/') // Case sensitive
---
$filter=matchs(data/name/en, '/a-z/i') // Case insensitive
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "filter": {
        "path": "data.name.en",
        "op": "matchs",
        "value": "a-z" // Case insensitive
    }
}
---
{
    "filter": {
        "path": "data.name.en",
        "op": "matchs",
        "value": "/a-z/" // Case sensitive
    }
}
---
{
    "filter": {
        "path": "data.name.en",
        "op": "matchs",
        "value": "/a-z/i" // Case insensitive
    }
}
```
{% endtab %}
{% endtabs %}

In OData these operators can also be compared with false.&#x20;

In JSON queries you have to use a **not** operation to negate your filter expression.

{% tabs %}
{% tab title="OData" %}
```
$filter=contains(data/name/en, 'ich') eq false
---
not contains(data/name/en, 'ich')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "not": {
            "path": "data.name.en",
            "op": "contains",
            "value": "ich"
        }
    }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
In **OData** single quotes (`'`) in text values must be replaced with double single quotes.
{% endhint %}

Geolocation must within radius.

{% tabs %}
{% tab title="OData" %}
```javascript
// Point is defined as POINT(longitude latitude)
geo.distance(data/geolocation/iv, geography'POINT(11.576124 48.137154)') lt 1000
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": {
            "data.geolocation.iv",
            "op": "lt"
            // The radius is defined as Radius(Longitude, Latitude, Meters)
            "value": "Radius(11.576124, 48.137154, 1000)"
        }
    }
}
```
{% endtab %}
{% endtabs %}

Different conditions

{% tabs %}
{% tab title="OData" %}
```
$filter=data/population/iv ne 1 // Not equals
---
$filter=data/population/iv eq 1 // Equals
---
$filter=data/population/iv lt 1 // Less than
---
$filter=data/population/iv le 1 // Less or equals than
---
$filter=data/population/iv gt 1 // Greater than
---
$filter=data/population/iv ge 1 // Greater or equals than
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.population.iv",
        "op": "ne", // Not equals
        "value": 1
    }
}
---
{
    "filter": {
        "path": "data.population.iv",
        "op": "ne", // Equals
        "value": 1
    }
}
---
{
    "path": "data.population.iv",
    "op": "lt", // Less than
    "value": 1
}
---
{
    "filter": {
        "path": "data.population.iv",
        "op": "le", // Less or equals than
        "value": 1
    }
}
---
{
    "filter": {
        "path": "data.population.iv",
        "op": "gt", // Greater than
        "value": 1
    }
}
---
{
    "filter": {
        "path": "data.population.iv",
        "op": "ge", // Greater or equals than
        "value": 1
    }
}
```
{% endtab %}
{% endtabs %}

Combine different conditions:

{% tabs %}
{% tab title="OData" %}
```
// AND: Both condition must be true
$filter=data/population/iv eq 1000000 and data/isCapital/iv eq true 

// OR: One condition must be true
$filter=data/population/iv eq 1000000 or data/isCapital/iv eq true 
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "and": [{ // AND: Both condition must be true
            "path": "data.population.iv",
            "op": "eq",
            "value": 1000000
        }, {
            "path": "data.capital.iv",
            "op": "eq",
            "value": true
        }]
    }
}
---
{
    "filter": {
        "or": [{ // OR: One condition must be true
            "path": "data.population.iv",
            "op": "eq",
            "value": 1000000
        }, {
            "path": "data.capital.iv",
            "op": "eq",
            "value": true
        }]
    }
}
```
{% endtab %}
{% endtabs %}

Negations

{% tabs %}
{% tab title="OData" %}
```
not endswith(data/name/en, 'ich')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "not": {
            "path": "data.name.ev",
            "op": "endswith",
            "value": "ich"
        }
    }
}
```
{% endtab %}
{% endtabs %}

### Sorting

The orderby or sorting query option allows clients to request resources in a particular order.

e.g. find the top 20 biggest cities by population:

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$orderby=data/population/iv desc$top=20
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "sort": [{
        "path": "data.population.iv",
        "order": "descending"
    }],
    "take": 20
}
```
{% endtab %}
{% endtabs %}

Of course you can also sort by multiple fields.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/geodata/cities?$orderby=data/population/iv desc,data/name/iv asc$top=20
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "sort": [{
        "path": "data.population.iv",
        "order": "descending"
    }, {
        "path": "data.name.iv",
        "order": "ascending"
    }],
    "take": 20
}
```
{% endtab %}
{% endtabs %}

## Published items

By default the content api returns only published content. You can use the `X-Unpublished` header to also return draft content.

### Versioning

The API tracks the version of each content element and provides this information in the `ETag` content header if you make an update (POST, PUT, PATCH) or if you request a single resource. If you request multiple resources, the version is provided as a field to each entry.

You can use this header for two use cases:

1. When you make an update you get the new version. This information can be used to find out if your change has already been written to the read store when you receive the same resource after your update.
2. When you make an update you can use the `If-Match` header to pass the expected version to the API. If the version does not match to the version in the database another user or client has changed the same resource. Then the `412 (Precondition Failed)` status code is returned. You should provide this information to the user and ask if the user wants to reload the data or if the resource should be overwritten (just do not use the `If-Match` header for the second request).

Read more about the If-Match header at

{% embed url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match" %}
