---
description: Schemas Define the Structure of Your Content.
---

# Schemas

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../introduction-and-use-case.md)
{% endcontent-ref %}

## Introduction

Schemas define the structure of your content. Creating one or more schemas to organize your content is usually the first step after creating an App.&#x20;

There can be more than 1 schema in an App.&#x20;

To create a schema click **+** (1) button under Schemas, give it a **Name** (2) and select the **Type** (3). Click **Create** (4).

<figure><img src="../../../.gitbook/assets/2022-11-05_21-51.png" alt=""><figcaption><p>Creating a schema</p></figcaption></figure>

A schema consists of multiple fields of various data types. Each field in a schema is identified by the following important properties:

| State            | Immutable | Description                                                                                                                                                                                                        |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name**         | No        | The name of the field in the API. It cannot be changed anymore, but you can add a optional label that is used in UI.                                                                                               |
| **Type**         | No        | The data type of this field.                                                                                                                                                                                       |
| **Editor**       | Yes       | Most fields have an editor, which depends on the type of the field. The editor can be changed, but it will not change the value. If you change a field editor from HTML to Markdown you will probably face issues. |
| **Partitioning** | No        | Defines whether the field content is localizable and managed in multiple languages or not.                                                                                                                         |
| **Validation**   | Yes       | A set of validation properties, which depend on the type of the field. For example they define the maximum length of a string or the maximum number of assets you can reference.                                   |

To create a field, click **+ Add Field** (1) and select the **Field Type** (2), give it a **Name** (3) and optionally select if it is a **Localizable** field. Click **Create and close** (4) when done.

{% hint style="info" %}
To add multiple fields simultaneously, click **Create and add field** or to immediately edit additional properties on the field click **Create and edit field**.
{% endhint %}

<figure><img src="../../../.gitbook/assets/2022-11-06_00-14.png" alt=""><figcaption><p>Creating a field</p></figcaption></figure>

There are additional properties that can be set in the field after it is created.

<figure><img src="../../../.gitbook/assets/2022-11-06_00-25.png" alt=""><figcaption><p>An example of a schema with fields of different data types</p></figcaption></figure>

The screenshot above shows the final schema of the `startups` database for _FoodCrunch_.

Furthermore, a schema has a published change. Only published schemas can have content. To publish a schema, click **Published**.

<figure><img src="../../../.gitbook/assets/Nov-09-2022 01-17-01.gif" alt=""><figcaption><p>Publishing a schema</p></figcaption></figure>

## Field States

A field has multiple states:

1. **Enabled:** This is is the default state.
2. **Disabled**: The field cannot be manipulated in the Management UI. Do not use it together with the required validator, because by doing so, will not be able to update invalid content items.
3. **Hidden**: The field will not be returned by the API and is only visible in the Management UI.
4. **Locked**: The field cannot be updated or deleted anymore.

To change the state, click on the elipsis (three dots) next to the field and select the right option.

<figure><img src="../../../.gitbook/assets/2022-11-06_00-36.png" alt=""><figcaption><p>Changing the state of a field</p></figcaption></figure>

## Field Types

Field types define how a field is structured in the API and in the processing pipeline. You can define the editor for each field, so a string field can either be a HTML, text, markdown or a list of allowed values with a dropdown editor.&#x20;

{% hint style="info" %}
If a field is not required it can also be `null` or **omitted**. A field is also `null` when it has been added or marked as required, after content items have already been added to the schema.
{% endhint %}

### String

<div align="left">

<img src="../../../.gitbook/assets/string.png" alt="String">

</div>

A string is the most used field type and can be used for any type of text, such as product names, descriptions and additional information. It is also the most flexible field and the usage depends very much on the editor you are using:

1. **HTML**: With a WYSIWYG editor.
2. **Markdown**: With a Markdown editor.
3. **Simple Text**: With an input control for texts in one line.
4. **Multiline Text**: With a TextArea control.
5. **Selection of Predefined Values**: With a dropdown control or radio boxes.

#### API Representation

```javascript
"title": {
    "iv": "Sustainable eating by FoodCo"
},
// OR
"title": {
    "iv": null
}
```

### Number

<div align="left">

<img src="../../../.gitbook/assets/number.png" alt="Number">

</div>

A number can either be a point number or an integer. Typical examples of when to use numbers are quantities, IDs and prices.

#### API Representation

```javascript
"fundingInMn": {
    "iv": 234
}
// OR
"fundingInMn": {
    "iv": null
}
```

### Boolean

<div align="left">

<img src="../../../.gitbook/assets/boolean.png" alt="Boolean">

</div>

Booleans have only 2 states: True or false, yes or no, 1 or 0.

#### API Representation

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

<div align="left">

<img src="../../../.gitbook/assets/datetime.png" alt="DateTime">

</div>

Date and time in the ISO8601 standard. The format is: `YYYY-MM-DDTHH:mm:ssZ`.

#### API Representation

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

<div align="left">

<img src="../../../.gitbook/assets/assets.png" alt="Assets">

</div>

Asset fields are used to maintain a list of asset IDs. You can also restrict the number of assets with a minimum and maximum limit, for example, when you want to have a single avatar or preview image for a content. You can use the IDs to load the asset. Read more [here](./). When you delete an asset, a clean-up process will remove the asset id from your content. This process is executed in the background to improve performance and it can take several minutes to complete. Therefore, it is highly recommended to handle cases where a piece of content has an ID added to a deleted asset.

#### API Representation

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

<div align="left">

<img src="../../../.gitbook/assets/references.png" alt="References">

</div>

References fields are used to model relationships to other content items. For example, you could have a schema for products and a schema for product categories. A product has a field with references to the categories it belongs to. Both products and categories can be created, updated and managed independently. Please think about the direction of the reference very carefully. For example, a typical product may only be in very few categories, but a product category could have thousand of products. Therefore, it is not recommended to reference the products from the categories. When you delete content, a clean-up process will remove the referenced ID from all content. This process is executed in the background to improve performance and it can take several minutes to complete. This is why it's highly recommended to handle cases where a piece of content has a reference to a deleted content.

#### API Representation

```javascript
"startup": {
    "iv": [
        "3a20690a-c40b-44bc-832e-0a6e3e708d93"
    ]
},
// OR
"startup": {
    "iv": null
}
```

### Array

<div align="left">

<img src="../../../.gitbook/assets/array.png" alt="Arrays">

</div>

Some content items only exist as child content for another content item. For example, a product could consist of variations such as different sizes and prices. These content items can be represented with array fields, where each item in the field has a specified structure, this is called a **Nested Schema**.

#### API Representation

```javascript
"founders": {
    "iv": [{
        "name": "John Doe",
        "position": "CEO"
    }, {
        "name": "Jane Doe",
        "position": "CMO"
    }]
},
// OR
"founders": {
    "iv": null
}
```

### Component

<div align="left">

<img src="../../../.gitbook/assets/image (63).png" alt="Component">

</div>

A component is a content item (defined by another schema) that is embedded into the current content.

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

<div align="left">

<img src="../../../.gitbook/assets/image (64).png" alt="Components">

</div>

The components field is used to embed multiple content items (defined by other schemas) into the current item. The order is defined when creating or updating the content item and can be changed in the UI.

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

<div align="left">

<img src="../../../.gitbook/assets/geolocation.png" alt="Geolocation">

</div>

The geolocation field represents a sequence of latitude and longitude and is designed to be used in combination with maps. It does not store additional data about the location, such as names, addresses or other information. You have to add additional fields for this purpose.

#### API Representation

```javascript
"location": {
    "iv": {
        "longitude": 32.0237703,
        "latitude": -92.0390231
    }
},
// OR
"location": {
    "iv": null
}
```

### Tags

<div align="left">

<img src="../../../.gitbook/assets/tags.png" alt="Tags">

</div>

Tags are lists of strings that are use in the combination tag editor in the Management UI. They are especially useful if you enrich your content with external systems. At the moment, the tag editor does not support advanced tag management, such as global lists of tags, renaming and merging of tags.

#### API Representation

```javascript
"tags": {
    "iv": [
        "sustainability",
        "food",
        "healthy"
    ]
},
// OR
"tags": {
    "iv": null
}
```

### Json

<div align="left">

<img src="../../../.gitbook/assets/json.png" alt="Json">

</div>

A json field is for developers. Whenever you have some structured or unstructured content, that you can't cover with the built-in field types or editors, you should use the json field. You should either write a [custom editor](../../developer-guides/editors.md) when the content editors can edit the field or disable the field when the content for this field comes from an external source. Editing the json manually is delicate and can easily dismantle your processes.

#### API Representation

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

### UI

<div align="left">

<figure><img src="../../../.gitbook/assets/Screenshot 2022-10-27 at 6.30.02 PM.png" alt=""><figcaption><p>UI</p></figcaption></figure>

</div>

Separator for editing UI.
