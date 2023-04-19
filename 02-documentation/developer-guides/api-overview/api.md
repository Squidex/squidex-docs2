---
description: How to Query Content with Filters, Sorting and Pagination
---

# Queries

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../introduction-and-use-case.md)
{% endcontent-ref %}

## Query Options

Squidex has a query engine that allows different query languages. So far, the following query languages are available:

1. **OData Queries** - this is the first system implemented using an existing solution that was easy to adapt, these are easier to write in URLs.
2. **JSON Queries** are newer and are mainly used for the UI, because they are faster and easier to determine. It is best to use JSON- queries for your client.

Both query languages support the same features:

1. Filters with complex comparison operators, conjunctions and negations.
2. Full text search.
3. Sorting by one or multiple fields.
4. Skipping items and restricting the size of the result set for pagination.

### OData Queries

OData is an open [protocol](https://en.wikipedia.org/wiki/Protocol\_\(computing\)) which allows the creation and consumption of queryable and inoperable APIs in a simple, standardized way. It was designed and developed by Microsoft and provides ready-to use-solutions. We have decided to use the Query syntax because we wanted to leverage an existing system and parser and we find it easy to adapt to our needs.

The queries are provided over the URL and have a special syntax. OData query options start with a dollar character, e.g. `$filter`.

Here's an example:

```
https://.../api/content/the-foodcrunch-mag/startups?$top=30&$skip=10&$search=delivery
```

{% hint style="info" %}
Even though we use OData, we do not support the full capabilities and there are no plans to do so in future. Some features like select, expand or formatting can be handled better with GraphQL.
{% endhint %}

The full OData convention can be read at:

{% embed url="https://www.odata.org/documentation/odata-version-2-0/uri-conventions/" %}

### JSON Queries

JSON queries are passed in as **URL encoded JSON objects** with the `q` query parameter. They are much harder to read for humans, but easier and faster to parse. This was introduced when a new query editor was implemented for the Management UI.

Here's an example:

```
https://.../api/content/the-foodcrunch-mag/startups?q=%7B%22fullText%22%3A%22website%22%2C%22take%22%3A10%2C%22sort%22%3A%5B%5D%2C%22filter%22%3A%7B%22and%22%3A%5B%5D%7D%7
```

As you can see it is horrible to read, therefore we will just show normal JSON examples from now on.

## Content Structure

Let's demonstrate the API concepts based on our _FoodCrunch_ App use case. The app has two schemas, we will consider the `startups` schema which contains a database of startups in the food space.

The schema has the following fields:

| Name          | Type        | Localizable | Description                                 |
| ------------- | ----------- | ----------- | ------------------------------------------- |
| `slug`        | String      | No          | A single slug for Google friendly URLs.     |
| `name`        | String      | No          | The name of the startup.                    |
| `description` | String      | Yes         | The description of the startup.             |
| `stage`       | String      | No          | Current startup stage                       |
| `funding`     | Number      | No          | The total funding in Millions (USD).        |
| `founded`     | Number      | No          | Year when the startup was founded.          |
| `founders`    | Array       | No          | The founders as list of name and position.  |
| `tags`        | Tags        | No          | A list of tags for search.                  |
| `location`    | Geolocation | No          | The geolocation of the headquarter.         |
| `metadata`    | JSON        | No          | Unstructured metadata.                      |
| `givenUp`     | Boolean     | No          | Indicates whether the startup has given up. |

Then, your content will have the following structure in the API:

{% code overflow="wrap" %}
```javascript
{
    "id": "7802056f",
    "created": "2022-12-31T08:00:52Z",
    "createdBy": ".....",
    "lastModified": "2023-01-09T19:29:05Z",
    "lastModifiedBy": ".....",
    "data": {
        "slug": {
            "iv": "foodco"
        },
        "name": {
            "iv": "FoodCo"
        },
        "description": {
            "en": "FoodCo aims to revolutionize the way we eat. Their innovative products focus on sustainability.",
            "de": "FoodCo zielt darauf ab, die Art und Weise, wie wir essen, zu revolutionieren. Ihre innovativen Produkte setzen auf Nachhaltigkeit.",
            "it": null,
            "sv": "FoodCo har som mål att revolutionera vårt sätt att äta. Deras innovativa produkter fokuserar på hållbarhet."
        },
        "stage": {
            "iv": "Early"
        },
        "founded": {
            "iv": 2019
        },
        "funding": {
            "iv": 234
        },
        "founders": {
            "iv": [
                {
                    "name": "John Doe",
                    "position": null
                }
            ]
        },
        "tags": {
            "iv": [
                "sustainability"
            ]
        },
        "location": {
            "iv": {
                "latitude": 32.0237703,
                "longitude": -92.0390231
            }
        },
        "metadata": {
            "iv": null
        },
        "givenUp": {
            "iv": null
        }
    }
}
```
{% endcode %}

Please note, that there is one object for each field because each field has a partitioning. This defines how the field is structured. The most simple partitioning is the invariant partition, which only allows a single key `iv`.

If the field is `localizable`, use the languages codes from the languages that you defined in your App settings as keys.

Read more about localization here:

{% content-ref url="../../concepts/localization.md" %}
[localization.md](../../concepts/localization.md)
{% endcontent-ref %}

### How to Identity Fields

To identify the field of our content item, use the full path to this field, separated by hashes.&#x20;

For example:

* `id`
* `createdBy`
* `data/name/iv`
* `data/description/en`
* `data/description/de`
* `data/founded/iv`

### Special Cases

#### Dot Notation in JSON Queries

When you use JSON queries, you can also use the dot-notation to create a syntax that is closer to Javascript and other programming languages. It is best to use this notation.&#x20;

For example:

* `data.name.iv`

#### OData Restrictions

In OData dash characters (-) are not allowed. Therefore, you should replace them with underscore in your queries.&#x20;

For example, if there was a field called `acquired-by` we would use:

* `data/acquired_by/iv`in OData
* `data.acquired-by.iv`in JSON

## Query Features

### Limiting the Number of Results

{% hint style="info" %}
The examples here used the `startups` schema of the _FoodCrunch_ use case.
{% endhint %}

The `top` / `take` query option requests the number of items in the queried collection to be included in the result. The default value is 20 and the maximum allowed value is 200.

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/the-foodcrunch-mag/startups?$top=30
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
Because of an error the parameter is called **top** in OData and **take** in JSON.
{% endhint %}

### Skipping Items in the Result Set

The `skip` query option requests the number of items in the queried collection to be skipped and not included in the result. Use this together with `top` / `take` to read all your data page by page.

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/the-foodcrunch-mag/startups?$skip=20
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

Example of `skip` combined with `top` / `take`:

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$skip=20&$top=30
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

### Get Random Items

You can get random items using the `random`option:

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/the-foodcrunch-mag/startups?$random=5
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

The random operator picks elements from the result set (not from the entire database).&#x20;

For example, this query returns 5 random items from the first 200 elements with the default order:

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/the-foodcrunch-mag/startups?$random=5&$top=200
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

### Full Text Searches

The `search` query option allows clients to request entities matching a free-text search expression. We add the data of all fields for all keys to a single field in the database and use this combined field to implement the full text search.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$search=delivery
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "fullText": "delivery"
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can either use **search** or **filter** but not both.
{% endhint %}

### Filters

The `filter` system query option allows clients to filter a collection of resources that are addressed by a request URL.

For example, find all the startups in the _Seed_ stage.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$filter=data/stage/iv eq Seed
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.stage.iv",
      "op": "eq"
      "value": "Seed"
   }
}
```
{% endtab %}
{% endtabs %}

For example, find all the startups with a funding of more than 100 million USD.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$filter=data/funding/iv gt 100
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.funding.iv",
      "op": "gt"
      "value": 100
   }
}
```
{% endtab %}
{% endtabs %}

For example, find all the startups with a funding of less than 10 million USD.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$filter=data/funding/iv lt 10
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.funding.iv",
      "op": "lt"
      "value": 10
   }
}
```
{% endtab %}
{% endtabs %}

#### Array

If you have fields that have an array of values, for example, references that are represented as an array of content IDs, you can still use the equal operator. The API will return a content item if at least one item in the array is equal to the passed in value.

An example of filtering by tags:

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$filter=data/tags/iv eq 'Home Delivery'
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.tags.iv",
      "op": "eq"
      "value": "Home Delivery"
   }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can either use **search** or **filter** but not both.
{% endhint %}

#### More Examples

* Example demonstrating an array (components, array fields, references, assets, strings) cannot be empty:

{% tabs %}
{% tab title="First Tab" %}
```
// Some code
```
{% endtab %}
{% endtabs %}

* Example demonstrating a date must match value:

{% tabs %}
{% tab title="OData" %}
```
$filter=created eq 2023-01-19T12:00:00Z
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "created ",
      "op": "eq"
      "value": "2023-01-19T12:00:00Z"
   }
}
```
{% endtab %}
{% endtabs %}

* Example demonstrating a date must match one of many values:

{% tabs %}
{% tab title="OData" %}
```
$filter=created in ('2023-01-19T12:00:00Z', '2022-01-19T12:00:00Z')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "created ",
      "op": "in"
      "value": [
         "2023-01-19T12:00:00Z",
         "2022-01-19T12:00:00Z"
      }
   }
}
```
{% endtab %}
{% endtabs %}

* Example demonstrating an ID must match value:

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

* Example demonstrating a name must match string value:

{% tabs %}
{% tab title="OData" %}
```
$filter=data/name/iv eq 'Uber Eats'
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.name.iv",
        "op": "eq",
        "value": "Uber Eats"
    }
}
```
{% endtab %}
{% endtabs %}

* Example demonstrating a boolean must match value:

{% tabs %}
{% tab title="OData" %}
```
$filter=data/givenUp/iv eq true
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.givenUp.iv",
        "op": "eq",
        "value": true
    }
}
```
{% endtab %}
{% endtabs %}

* Example demonstrating a number must match a value:

{% tabs %}
{% tab title="OData" %}
```
$filter=data/funding/iv eq 500
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.funding.iv",
        "op": "eq",
        "value": 500
    }
}
```
{% endtab %}
{% endtabs %}

* Examples of string property demonstrating `startswith`, `endswith` or `contains` :

{% tabs %}
{% tab title="OData" %}
```
$filter=startswith(data/founded/iv, '202')
$filter=startswith(data/founded/iv, '202') eq true // Aquivalent
---
$filter=endswith(data/founded/en, '022')
---
$filter=contains(data/description/en, 'catering')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.founded.iv",
        "op": "startsWith",
        "value": "202"
    }
}
---
{
    "filter": {
        "path": "data.founded.en",
        "op": "endsWith",
        "value": "022"
    }
}
---
{
    "filter": {
        "path": "data.description.en",
        "op": "contains",
        "value": "delivery"
    }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**contains**, **startsWith** and **endsWith** are always case insensitive.
{% endhint %}

* Examples of string property matching a regex pattern:

{% tabs %}
{% tab title="OData" %}
```
$filter=matchs(data/name/iv, 'a-z') // Case insensitive
---
$filter=matchs(data/name/iv, '/a-z/') // Case sensitive
---
$filter=matchs(data/name/iv, '/a-z/i') // Case insensitive
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "filter": {
        "path": "data.name.iv",
        "op": "matchs",
        "value": "a-z" // Case insensitive
    }
}
---
{
    "filter": {
        "path": "data.name.iv",
        "op": "matchs",
        "value": "/a-z/" // Case sensitive
    }
}
---
{
    "filter": {
        "path": "data.name.iv",
        "op": "matchs",
        "value": "/a-z/i" // Case insensitive
    }
}
```
{% endtab %}
{% endtabs %}

* Examples of using operators with false / negation\
  In OData these operators can also be compared with **false**. \
  In JSON queries you must use a **not** operation to negate your filter expression.

{% tabs %}
{% tab title="OData" %}
```
$filter=contains(data/name/iv, 'Uber Eats') eq false
---
not contains(data/name/iv, 'Uber Eats')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "not": {
            "path": "data.name.iv",
            "op": "contains",
            "value": "Uber Eats"
        }
    }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
In **OData** single quotes (`'`) in text values must be replaced with double single quotes.
{% endhint %}

* Example of Geolocation within radius:

{% tabs %}
{% tab title="OData" %}
```javascript
// Point is defined as POINT(longitude latitude)
geo.distance(data/location/iv, geography'POINT(11.576124 48.137154)') lt 1000
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": {
            "data.location.iv",
            "op": "lt"
            // The radius is defined as Radius(Longitude, Latitude, Meters)
            "value": "Radius(11.576124, 48.137154, 1000)"
        }
    }
}
```
{% endtab %}
{% endtabs %}

* Examples of various conditions

{% tabs %}
{% tab title="OData" %}
```
$filter=data/funding/iv ne 100 // Not equals
---
$filter=data/funding/iv eq 100 // Equals
---
$filter=data/funding/iv lt 100 // Less than
---
$filter=data/funding/iv le 100 // Less or equals than
---
$filter=data/funding/iv gt 100 // Greater than
---
$filter=data/funding/iv ge 100 // Greater or equals than
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "data.funding.iv",
        "op": "ne", // Not equals
        "value": 100
    }
}
---
{
    "filter": {
        "path": "data.funding.iv",
        "op": "eq", // Equals
        "value": 100
    }
}
---
{
    "path": "data.funding.iv",
    "op": "lt", // Less than
    "value": 100
}
---
{
    "filter": {
        "path": "data.funding.iv",
        "op": "le", // Less or equals than
        "value": 100
    }
}
---
{
    "filter": {
        "path": "data.funding.iv",
        "op": "gt", // Greater than
        "value": 100
    }
}
---
{
    "filter": {
        "path": "data.funding.iv",
        "op": "ge", // Greater or equals than
        "value": 100
    }
}
```
{% endtab %}
{% endtabs %}

* Examples of combining conditions:

{% tabs %}
{% tab title="OData" %}
```
// AND: Both condition must be true
$filter=data/funding/iv eq 100 and data/givenUp/iv eq true 

// OR: One condition must be true
$filter=data/funding/iv eq 100 or data/givenUp/iv eq true 
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "and": [{ // AND: Both condition must be true
            "path": "data.funding.iv",
            "op": "eq",
            "value": 100
        }, {
            "path": "data.givenUp.iv",
            "op": "eq",
            "value": true
        }]
    }
}
---
{
    "filter": {
        "or": [{ // OR: One condition must be true
            "path": "data.funding.iv",
            "op": "eq",
            "value": 100
        }, {
            "path": "data.givenUp.iv",
            "op": "eq",
            "value": true
        }]
    }
}
```
{% endtab %}
{% endtabs %}

* Examples of negations

{% tabs %}
{% tab title="OData" %}
```
not endswith(data/name/iv, 'Food')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "not": {
            "path": "data.name.iv",
            "op": "endswith",
            "value": "Food"
        }
    }
}
```
{% endtab %}
{% endtabs %}

### Sorting

The `orderby` or `sorting` query option allows clients to request resources in a particular order.

For example, find the top 20 most funded startups:

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$orderby=data/funding/iv desc$top=20
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "sort": [{
        "path": "data.funding.iv",
        "order": "descending"
    }],
    "take": 20
}
```
{% endtab %}
{% endtabs %}

You can also sort by multiple fields.

{% tabs %}
{% tab title="OData" %}
```
https://.../api/content/the-foodcrunch-mag/startups?$orderby=data/funding/iv desc,data/name/iv asc$top=20
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "sort": [{
        "path": "data.funding.iv",
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

## Published Items

By default, the content API only returns published content. You can also use the `X-Unpublished` header to return draft content.

### Versioning

The API tracks the version of each content element and provides this information in the `ETag` content header if you create an update (POST, PUT, PATCH) or if you request a single resource. If you request multiple resources, the version is provided as a field to each entry.

You can use this header for two use cases:

1. When you create an update, you get the new version. This information can be used to find out if your change has already been written to the read store when you receive the same resource following your update.
2. When you create an update, you can use the `If-Match` header to pass the expected version to the API. If the version does not match the version in the database, this means that another user or client has changed the same resource. In which case, the `412 (Precondition Failed)` status code is returned. You should provide this information to the user and ask if the user wants to reload the data or if the resource should be overwritten (but don't use the `If-Match` header for the second request).

Read more about the `If-Match` header at:

{% embed url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match" %}
