---
description: 'How to query content with filters, sorting and pagination.'
---

# Queries

## Example

We demonstrate the API concepts based on the following example:

Lets assume you have an app `geodata` with two languages \(en, de\) and a schema `cities` with these fields:

1. `name`: String \(localizable\).
2. `population`: Number \(not localizable\).
3. `foundation-year`: Number \(not localizable\).

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
        },,
        "foundation-year": {
            "iv": 1200
        }
    }
}
```

## General structure

Please note that there is one object for each field, because each field has a partitioning. It defines how the field is structured. The most simple partitioning is the invariant partition, which only allows a single key `iv`. If the field is localizable we use the languages codes from the languages that you defined in your app settings as keys.

Read more at

{% page-ref page="../../concepts/localization.md" %}

## Query Options

Squidex has a query engine that allows different query languages. So far the following query languages are available:

1. **OData queries** that is the first system that has been implemented using an existing solution that was easy to adapt.
2. **JSON queries** are newer and are mainly used the UI, because they are faster and easier to parse.

Both query languages support the same features:

1. Filters with complex comparison operators, conjunctions and negations.
2. Full text search.
3. Sorting by one or multiple fields.
4. Skipping items and restricting the size of the result set for pagination.

### OData queries

OData  is an open [protocol](https://en.wikipedia.org/wiki/Protocol_%28computing%29) which allows the creation and consumption of queryable and inoperable APIs in a simple and standardized way. It was designed and developed by Microsoft and provides ready to use solutions. We have decided to use the Query syntax because we wanted to leverage an existing system and parser and found it easy to adapt to our needs. 

The queries are provided over the URL and have a special syntax. OData query options start with a dollar character, e.g. `$filter`.

An example:

```text
https://.../api/content/geodata/cities?$top=30&$skip=10&$search=Munich
```

{% hint style="info" %}
Even though we use OData, we do not support the full capabilities and there are no plans to do so. Some features like select, expand or formatting can be better handled with GraphQL.
{% endhint %}

The full OData convention can be read at:

{% embed url="https://www.odata.org/documentation/odata-version-2-0/uri-conventions/" %}

### JSON queries

JSON queries will be passed in as URL encoded JSON objects with the `q` query parameter. They are much harder to read for humans but easier and faster to parse. It has been introduced when a new query editor was implemented for the Management UI.

An example

```text
https://.../api/content/geodata/cities?q=%7B%22fullText%22%3A%22website%22%2C%22take%22%3A10%2C%22sort%22%3A%5B%5D%2C%22filter%22%3A%7B%22and%22%3A%5B%5D%7D%7
```

As you can see it is horrible to read, therefore we will just show normal JSON examples from now on.

## Query capabilities

### Limiting the number of results

The `top` query option requests the number of items in the queried collection to be included in the result. The default value is 20 and the maximum allowed value is 200.

{% tabs %}
{% tab title="OData" %}
```markup
https://.../api/content/geodata/cities?$top=30
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "top": 30
}
```
{% endtab %}
{% endtabs %}

### Skipping items in the result set

The `skip` query option requests the number of items in the queried collection that are to be skipped and not included in the result. Use it together with `top` to read the all your data page by page.

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

or combined with top

{% tabs %}
{% tab title="OData" %}
```text
https://.../api/content/geodata/cities?$skip=20&$top=30
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "skip": 20,
    "top": 30
}
```
{% endtab %}
{% endtabs %}

### Full text searches

The search query option allows clients to request entities matching a free-text search expression. We add the data of all fields for all keys to a single field in the database and use this combined field to implement the full text search.

{% tabs %}
{% tab title="OData" %}
```text
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

Find the city with the English name \(name\) _Munich._

{% tabs %}
{% tab title="OData" %}
```text
https://.../api/content/geodata/cities?$filter=data/name/de eq Munich
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
```text
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

As you can see the query systems use a different notation to address nested properties. While OData separates the properties by a slash \(/\) character, JSON queries make use of a dot \(.\) notation, to be closer to Javascript. You can actually use slash in JSON queries as well, but the recommendation is to use dot.

#### OData restrictions

Please also note that dash \(-\) characters are not allowed in OData and that you have to use underscore instead. This restriction does not exist in JSON queries.

For example when you want to filter by the foundation year \(foundation\).

{% tabs %}
{% tab title="OData" %}
```text
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

For example, lets take the following use case:

Find all the term items which belong to a certain vocabulary item: Let's say you'd like to `tag` your articles and you'd like to categorize these tags. In this case you would have a `term` schema and a `vocabulary` schema. Each `term` would have a reference field to `vocabulary` with the validation set to only allow a single element. To find only those `term` items which belong to `vocabulary` with id `e46aca5e-5067-408f-b90f-ea441314385a` you would do the following request:

{% tabs %}
{% tab title="OData" %}
```text
https://.../api/content/app/term?$filter=data/vocabulary/iv eq 'e46aca5e-5067-...'
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
   "filter": {
      "path": "data.vocabulary.iv",
      "op": "eq"
      "value": "e46aca5e-5067-..."
   }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can either use **search or filter** but not both.
{% endhint %}

#### More examples

Date must match value:

{% tabs %}
{% tab title="OData" %}
```text
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
```text
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
```text
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
```text
$filter=firstName eq 'Scrooge'
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "name",
        "op": "eq",
        "value": "Scrooge"
    }
}
```
{% endtab %}
{% endtabs %}

Boolean must match value:

{% tabs %}
{% tab title="OData" %}
```text
$filter=isComicFigure eq true
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "isComicFigure ",
        "op": "eq",
        "value": true
    }
}
```
{% endtab %}
{% endtabs %}

Age must must be equal to number:

{% tabs %}
{% tab title="OData" %}
```text
$filter=age eq 60
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "age",
        "op": "eq",
        "value": 60
    }
}
```
{% endtab %}
{% endtabs %}

String property should start with, ends with or contain a string:

{% tabs %}
{% tab title="OData" %}
```text
$filter=startswith(lastName, 'Duck')
$filter=startswith(lastName, 'Duck') eq true // Aquivalent
---
$filter=endswith(lastName, 'Duck')
---
$filter=contains(lastName, 'Duck')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "lastName",
        "op": "startsWith",
        "value": "Duck"
    }
}
---
{
    "filter": {
        "path": "lastName",
        "op": "endsWith",
        "value": "Duck"
    }
}
---
{
    "filter": {
        "path": "lastName",
        "op": "contains",
        "value": "Duck"
    }
}
```
{% endtab %}
{% endtabs %}

In OData these operators can also be compared with `false`. In JSON queries you need a negation.

{% tabs %}
{% tab title="OData" %}
```text
$filter=contains(lastName, 'Duck') eq false
---
not contains(Name, 'Duck')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "not": {
            "path": "lastName",
            "op": "contains",
            "value": "Duck"
        }
    }
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
In **OData** single quotes \(`'`\) in text values must be replaced with double single quotes \(`''`\).
{% endhint %}

Different conditions

{% tabs %}
{% tab title="OData" %}
```text
$filter=age ne 1 // Not equals
---
$filter=age eq 1 // Equals
---
$filter=age lt 1 // Less than
---
$filter=age le 1 // Less or equals than
---
$filter=age gt 1 // Greater than
---
$filter=age ge 1 // Greater or equals than
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "path": "age",
        "op": "ne", // Not equals
        "value": 1
    }
}
---
{
    "filter": {
        "path": "age",
        "op": "ne", // Equals
        "value": 1
    }
}
---
{
    "path": "age",
    "op": "lt", // Less than
    "value": 1
}
---
{
    "filter": {
        "path": "age",
        "op": "le", // Less or equals than
        "value": 1
    }
}
---
{
    "filter": {
        "path": "age",
        "op": "gt", // Greater than
        "value": 1
    }
}
---
{
    "filter": {
        "path": "age",
        "op": "ge", // Greater or equals than
        "value": 1
    }
}
```
{% endtab %}
{% endtabs %}

Combine different conditions:

{% tabs %}
{% tab title="Plain Text" %}
```text
$filter=age eq 60 and isComicFigure eq true // AND: Both condition must be true
$filter=age eq 60 or  isComicFigure eq true // OR: One condition must be true
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "and": [{ // AND: Both condition must be true
            "path": "age",
            "op": "eq",
            "value": 60
        }, {
            "path": "lastName",
            "op": "eq",
            "value": "Duck"
        }]
    }
}
---
{
    "filter": {
        "or": [{ // OR: One condition must be true
            "path": "age",
            "op": "eq",
            "value": 60
        }, {
            "path": "lastName",
            "op": "eq",
            "value": "Duck"
        }]
    }
}
```
{% endtab %}
{% endtabs %}

Negations

{% tabs %}
{% tab title="OData" %}
```text
not endswith(Name, 'Duck')
```
{% endtab %}

{% tab title="JSON" %}
```javascript
{
    "filter": {
        "not": {
            "path": "lastName",
            "op": "endswith",
            "value": "Duck"
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
```text
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
    "top": 20
}
```
{% endtab %}
{% endtabs %}

## Published

By default the content api returns only published content. You can use the `X-Unpublished` header to also return draft content.

### Versioning

The API tracks the version of each content element and provides this information in the `ETag` content header if you make an update \(POST, PUT, PATCH\) or if you request a single resource. If you request multiple resources, the version is provided as a field to each entry.

You can use this header for two use cases:

1. When you make an update you get the new version. This information can be used to find out if your change has already been written to the read store when you receive the same resource after your update.
2. When you make an update you can use the `If-Match` header to pass the expected version to the API. If the version does not match to the version in the database another user or client has changed the same resource. Then the `412 (Precondition Failed)` status code is returned. You should provide this information to the user and ask if the user wants to reload the data or if the resource should be overwritten \(just do not use the `If-Match` header for the second request\).

Read more about the If-Match header at

{% embed url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match" %}

