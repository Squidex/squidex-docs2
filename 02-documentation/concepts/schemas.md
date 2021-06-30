---
description: Schemas define the structure of your content.
---

# Schemas

## Introduction

This documentation is based on the FoodCrunch use case. Please follow the link and open it side by side to this page to understand the examples.

{% page-ref page="../introduction-and-use-case.md" %}

Schemas define the structure of your content:

![Startups schema](../../.gitbook/assets/image%20%2848%29.png)

In the screenshot above we define a blog schema with several fields.

Each field is identified by the following properties:

| State | Immutable | Description |
| :--- | :--- | :--- |
| **Name** | No | The name of the field in the API. It cannot be changed anymore, but you can add a optional label that is used in UI. |
| **Type** | No | The data type of this field. |
| **Editor** | Yes | Most fields have an editor, which depends on the type of the field. The editor can be changed, but it will not change the value. If you change a field editor from HTML to Markdown you will probably face issues. |
| **Partitioning** | No | Defines whether the field content is localizable and managed in multiple languages or not. |
| **Validation** | Yes | A set of validation properties, which depend on the type of the field. For example they define the maximum length of a string or the maximum number of assets you can reference. |

Furthermore a schema has a published change. Only published schemas can have content.

## Field States

Each field has multiple states:

1. **Locked**: The field cannot be updated or deleted anymore.
2. **Hidden**: The field will not be returned by the api and is only visible in the Management UI.
3. **Disabled**: The field cannot be manipulated in the Management UI. Do not use it together with the required validator, because you will not be able to update invalid content items anymore.

## Field Types

Field types define how a field is structured in the API and in the processing pipeline. You can define the editor for each field, so a string field can either be a html text, markdown or a list of allowed values with a dropdown editor. We use a product catalog as an example to describe the different field types.

{% hint style="info" %}
If a field is not required it can also be **null** or **omitted**. This is also the case when a field has been added or marked as required after a content items have already been added to this schema.
{% endhint %}

### 

### String

![String](../../.gitbook/assets/string.png)

A string is the most used field type and can be used for any kind of texts, like product names, descriptions and additional information. It is also the most flexible field and the usage depends very much on the editor you are using:

1. **HTML**: With a WYSIWYG editor.
2. **Markdown**: With a markdown editor.
3. **Simple text**: With an input control for texts with only one line.
4. **Multiline text**: With a textarea control.
5. **Selection of predefined values**: With a dropdown control or radio boxes.

#### API representation

```javascript
"title": {
    "iv": "Super Corp buys Food Startup"
},
// OR
"title": {
    "iv": null
}
```

### Number

![Number](../../.gitbook/assets/number.png)

A number can either be a point number or integer. Typical examples when to use numbers are quantities, IDs and prices.

#### API representation

```javascript
"funding": {
    "iv": 1500000
}
// OR
"fundingInMio": {
    "iv": 1.5
},
// OR
"funding": {
    "iv": null
}
```

### Boolean

![Boolean](../../.gitbook/assets/boolean.png)

Booleans have only 2 states: True or false, yes or no, 1 or 0.

#### API representation

```javascript
"givenUp": {
    "iv": false
}
// OR
"givenUp": {
    "iv": true
}
// OR
"givenUp": {
    "iv": null
}
```

### DateTime

![DateTime](../../.gitbook/assets/datetime.png)

Date and time in the ISO8601 standard. The format is: `YYYY-MM-DDTHH:mm:ssZ`.

#### API representation

```javascript
"foundingDate": {
    "iv": 2021-01-10T00:00:00z"
},
// OR
"foundingDate": {
    "iv": null
}
```

### Assets

![Assets](../../.gitbook/assets/assets.png)

Asset fields are used to maintain a list of asset IDs. You can also restrict the number of assets with a minimum and maximum limit, for example when you want to have a single avatar or preview image for a content. You can use the IDs load the asset. Read more about [here](schemas.md). When you delete an asset a cleanup process will remove the asset id from your contents. This process is executed in the background to improve the performance and it can take several minutes to complete. Therefore it is highly recommended to handle cases where an content has an id to an deleted asset.

#### API representation

```javascript
"image": {
    "iv": [
        "287a2948-8992-4e65-990f-3ee486c9a4b5"
    ]
},
// OR
"image": {
    "iv": null
}
```

### References

![References](../../.gitbook/assets/references.png)

References fields are used to model relationship to other content items. For example you could have a schema for products and a schema for product categories. A product has a field with references to the categories it belongs to. Both, products and categories can be created, updated and managed independently. Please think about the direction of the reference very carefully. For example a typical product is only in very few categories, but a product category could have thousand of products. Therefore it is not recommended to reference the products from the categories. When you delete content a cleanup process will remove the referenced id from all contents. This process is executed in the background to improve the performance and it can take several minutes to complete. Therefore it is highly recommended to handle cases where an content has an reference to an deleted content.

#### API representation

```javascript
"startup": {
    "iv": [
        "673d3a3a-988f-4ce6-a8ec-022e73e12f9f"
    ]
},
// OR
"startup": {
    "iv": null
}
```

### Array

![Arrays](../../.gitbook/assets/array.png)

Some content items only exist as child content for another content item. For example a product could have variations like different sizes and prices. These content items can be represented with array fields, where each item in the field has a specified structured, that is called **nested schema**.

#### API representation

```javascript
"founders": {
    "iv": [{
        "name": "John Doe",
        "position": "Marketing"
    }, {
        "name": "Jane Doe",
        "position": "Sales"
    }]
},
// OR
"founders": {
    "iv": null
}
```

### Component

![Component](../../.gitbook/assets/image%20%287%29.png)

A component is content item \(defined by another schema\) that is embedded into the current content. 

#### API Representation

```javascript
"component1": {
    "iv": {
        "schemaId": "3e6b3c9f-6de7-44a2-bdd0-4cc6ec255480",
        "title": "My Title",
        "text": "My Text"
    }
},
// OR
"component2": {
    "iv": null
}
```

### Components

![Components](../../.gitbook/assets/image%20%281%29.png)

A components field is used to embed multiple content items \(defined by other schemas\) into the current item. The order is defined when creating or updating the content item and can be changed in the UI.

#### API Representation

```javascript
"components1": {
    "iv": [{
            "schemaId": "3e6b3c9f-6de7-44a2-bdd0-4cc6ec255480",
            "title": "My Title",
            "text": "My Text"
        }, {
            "schemaId": "410a07f2-a89e-4d77-9a43-46fff835ff8c",
            "image": "http://url/to/image",
            "alt": "My Image"
        }
    ]
},
// OR
"components2": {
    "iv": []
},
// OR
"components3": {
    "iv": null
}
```

### Geolocation

![Geolocation](../../.gitbook/assets/geolocation.png)

The geolocation field represents a tuple of latitude and longitude and is designed to be used in combination with maps. It does not store additional data about the location, such as names, addresses or other information. You have to add additional fields for this purpose.

```javascript
"location": {
    "iv": {
        "longitude": -122.431297,
        "latitude": 37.773972
    }
},
// OR
"location": {
    "iv": null
}
```

### Tags

![Tags](../../.gitbook/assets/tags.png)

Tags are list of strings that are use in the combination tag editor in the Management UI. It is especially useful if you enrich your content with external systems. At the moment the tag editor does not support advanced tag management, such as global lists of tags, renaming and merging of tags.

#### API representation

```javascript
"tags": {
    "iv": [
        "oranges",
        "food",
        "valley"
    ]
},
// OR
"tags": {
    "iv": null
}
```

### Json

![Json](../../.gitbook/assets/json.png)

A json field is for developers. Whenever you have some structured or unstructured content, that you cannot cover with the built in field types or editors you should the json field. You should either write a [custom editor](../developer-guides/editors.md) when the content editors can edit the field or disable the field when the content for this field comes from an external source. Editing the json manually is fragile and can easily break your processes.

#### API representation

```javascript
"metadata": {
    "iv": {
        "createBy": "auto-importer"
    }
},
// OR
"location": {
    "iv": null
}
```



