# Introduction and Use Case

We think it is easier to describe the features and functionality with Use Cases. To make the documentation easier and shorter we will use a single Use Case for all pages, which will be extended over time. This page describes the details of this use case. To unify the documentation is still in progress and only very few pages have been updated so far. We will add a note to this page for these pages.

{% hint style="info" %}
We recommend to open this use case side by side with the documentation, so that you do not have to switch back and forth.
{% endhint %}

## The company

The user is the Lead Developer and CTO of a midsize news magazine called "FoodCrunch", a magazine for everything around food startups. It has just over 100 employees from 14 different languages. The editors and content authors write articles, news and other kind of editorial content. In addition to that the magazine also maintains a database called "Food Base" with information about all startup in the food area and information like co-founders, investment rounds and more.

Therefore we create one project in Squidex for all our content, assets and settings and invite all developers and content editors to this project to work together. In Squidex we call this an "App".

{% content-ref url="concepts/apps.md" %}
[apps.md](concepts/apps.md)
{% endcontent-ref %}

## The content structure

The structure of the content is defined by Schemas in Squidex. In this section we describe the different content types for our use case. Read more about schemas here:

{% content-ref url="concepts/schemas.md" %}
[schemas.md](concepts/schemas.md)
{% endcontent-ref %}

### Editorial content

The CTO decided to have a single structure for all editorial content. After bringing everybody to the table, the developers and editors have decided together what information they need for each content. Even though our website is available in four different languages we write editorial content for exactly one language.

This schema is just called `contents` and has the following fields.

| Name        | Type      | Localizable | Description                                        |
| ----------- | --------- | ----------- | -------------------------------------------------- |
|  `language` | String    | No          | The content language.                              |
| `title`     | String    | No          | The title of the editorial content.                |
| `slug`      | String    | No          | A single slug for Google friendly URLs.            |
| `content`   | String    | No          | The actual content.                                |
| `type`      | String    | No          | The type of the content, e.g. "Article" or "News". |
| `startup`   | Reference | No          | A reference to the startup in the database.        |
| `image`     | Assets    | No          | One or more teaser images.                         |

### Startup database

The startup database is maintained in multiple languages, so that entries can be reference them from all articles, independent from the language they are written in.

This schema is called `startups` and has the following fields.

| Name           | Type        | Localizable | Description                                 |
| -------------- | ----------- | ----------- | ------------------------------------------- |
| `slug`         | String      | No          | A single slug for Google friendly URLs.     |
| `name`         | String      | No          | The name of the startup.                    |
| `description`  | String      | Yes         | The description of the startup.             |
| `funding`      | Number      | No          | The total funding in USD ($).               |
| `foundingDate` | DateTime    | No          | The date the startup has been founded.      |
| `founders`     | Array       | No          | The founders as list of name and position.  |
| `tags`         | Tags        | No          | A list of tags for search.                  |
| `location`     | Geolocation | No          | The geolocation of the headquarter.         |
| `metadata`     | Json        | No          | Unstructured metadata.                      |
| `givenUp`      | Boolean     | No          | Indicates whether the startup has given up. |

### &#x20;JSON structure

If you are a content editor, you can skip this section.

Of course we use JSON to represent our content in the database and API. Each content item is one document and the values of all fields are just called "content data" or "data". Because Squidex supports localized fields we need a way to structure our localized fields as well as our non-localized fields. In Squidex we have decided to use a common structure for that. Therefore our content has the following shape:

```javascript
// contents
{
    // Additional metadata, such as content id.
    "data": {
        "language": {
            "iv": "en"
        },
        "slug": {
            "iv": "super-corp-buys-food-startup"
        },
        "title": {
            "iv": "Super Corp buys Food Startup"
        },
        "content": {
            "iv": "A very long text"
        },
        "type": {
            "iv": "Article"
        },
        "startup": {
            "iv": [
                "673d3a3a-988f-4ce6-a8ec-022e73e12f9f"
            ]
        },
        "image": {
            "iv": [
                "287a2948-8992-4e65-990f-3ee486c9a4b5"
            ]
        }
    }
}

// startups
{
    // Additional metadata, such as content id.
    "data": {
        "slug": {
            "iv": "best-organgs"
        },
        "name": {
            "iv": "Best Oranges"
        },
        "description": {
            "en": "Best Oranges sells the best oranges in the Valley",
            "de": "Best Oranges verkauft die besten Orangen im Tal"
        },
        "funding": {
            "iv": 1000000
        },
        "foundingDate": {
            "iv": 2021-01-10T00:00:00z"
        },
        "founders": {
            "iv": [{
                "name": "John Doe",
                "position": "Marketing"
            }, {
                "name": "Jane Doe",
                "position": "Sales"
            }]
        },
        "tags": {
            "iv": [
                "oranges",
                "food",
                "valley"
            ]
        },
        "location": {
            "iv": {
                "longitude": -122.431297,
                "latitude": 37.773972
            }
        },
        "metadata": {
            "iv": {
                "createBy": "auto-importer"
            }
        },
        "givenUp": {
            "iv": false
        }
    }
}
```

As you can see, we need an JSON object for our localized fields. To use a generalized structure all objects use fields `iv` (for invariant) is used for localized fields. Read more about the reasoning in the section about localization:

{% content-ref url="concepts/localization.md" %}
[localization.md](concepts/localization.md)
{% endcontent-ref %}

## People and roles

The following people work together with Squidex to bring content to the website.

* **Developers** work together to bring new features to the website. Their responsibility is to define the schemas in Squidex and to implement the business roles with Workflows and Permissions. To make it easier for them to find and fix bugs on the website they also have full control to the content itself.
* **Editors** are responsibility to write the articles in different languages and to make all the research around it. Because false information are a big deal in the News industry they are not allowed to publish the content itself.
* **Reviewers** check the content before it gets published for spelling and grammar mistakes and also check correctness of all facts and information in the content.
* **Publisher** work together with Marketing and social media to decide when a content should go live. They can also publish reviewed content and do not create any content themselves.
