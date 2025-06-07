---
description: A Brief Introduction to Squidex and a Use Case
---

# Introduction and Use Case

It's best to describe features and functionality with a use case. So, to make following our documentation easier and briefer, will use a single use case (which will be updated and extended over time). This page describes the details of this particular use case.

Our documentation is still in progress and only a few pages have been created/updated so far. As new information is published, we will update this page.  Do check back for our updates.

{% hint style="info" %}
We recommend opening this use case alongside the documentation, so you don't need to keep switching back and forth!
{% endhint %}

## The Company

The user is the Lead Developer and CTO of a mid-size news magazine called "_FoodCrunch_", a magazine for everything surrounding food startups. It has just over 100 employees speaking 14 different languages. The editors and content authors write articles, news and other types of editorial content. In addition to that, the magazine also maintains a database called "_FoodBase_" with information about all startups in the food industry and information on topics such as co-founders, investment rounds and more.

Therefore, for this use case, the team has created one project in Squidex for all content, assets and settings and invited all developers and content editors to the project to work together. In Squidex we call this an "App".

{% content-ref url="concepts/apps.md" %}
[apps.md](concepts/apps.md)
{% endcontent-ref %}

## The Content Structure

The structure of the content is defined by schemas in Squidex. In this section, we describe the different content types for our use case. Read more about schemas here:

{% content-ref url="concepts/schemas/" %}
[schemas](concepts/schemas/)
{% endcontent-ref %}

### Editorial Content

The CTO has decided to have a single structure for all editorial content. After bringing everybody to the table, the developers and editors have confirmed what information they need for each type of content. Even though the _FoodCrunch_ website is available in four different languages, the team writes editorial content in one language.

This schema is called `magazine` and has the following fields.

| Name           | Type      | Localizable | Description                                        |
| -------------- | --------- | ----------- | -------------------------------------------------- |
| `slug`         | String    | No          | A single slug for Google friendly URLs.            |
| `title`        | String    | No          | The title of the editorial content.                |
| `content`      | String    | No          | The actual content.                                |
| `content-type` | String    | No          | The type of the content, e.g. "Article" or "News". |
| `startup`      | Reference | No          | A reference to the startup in the database.        |
| `image`        | Assets    | No          | One or more teaser images.                         |

### Startup Database

The startup database is maintained in multiple languages, so that entries can be reference in the languages from all articles, independent from the language they are written in.

This schema is called `startups` and has the following fields.

| Name          | Type        | Localizable | Description                                 |
| ------------- | ----------- | ----------- | ------------------------------------------- |
| `slug`        | String      | No          | A single slug for Google friendly URLs.     |
| `name`        | String      | No          | The name of the startup.                    |
| `description` | String      | Yes         | The description of the startup.             |
| `funding`     | Number      | No          | The total funding in millions (USD).        |
| `founded`     | String      | No          | The year the startup has been founded.      |
| `founders`    | Array       | No          | The founders as list of name and position.  |
| `tags`        | Tags        | No          | A list of tags for search.                  |
| `location`    | Geolocation | No          | The geolocation of the headquarter.         |
| `metadata`    | JSON        | No          | Unstructured metadata.                      |
| `givenUp`     | Boolean     | No          | Indicates whether the startup has given up. |

### JSON Structure

If you are a content editor, you can skip this section.

We use JSON to represent content in the database and API. Each content item is one document and the values of all fields are just called "_content data_" or "_data_". As Squidex supports localized fields, we need a way to structure these localized fields as well as the non-localized fields. In Squidex we have decided to use a common structure for this purpose. Therefore, our content takes the following shape:

{% code overflow="wrap" %}
```javascript
// magazine
{
    // Additional metadata, such as content id.
    "data": {
        "slug": {
            "iv": "sustainable-eating-by-foodco"
        },
        "title": {
            "iv": "Sustainable eating by FoodCo"
        },
        "content": {
            "iv": "Introducing FoodCo, the latest player in the food industry. FoodCo aims to revolutionize the way we eat. Their innovative products and focus on sustainability have already garnered attention from foodies and investors alike. Stay tuned for what's cooking next!"
        },
        "content-type": {
            "iv": "Article"
        },
        "startup": {
            "iv": [
                "3a20690a-c40b-44bc-832e-0a6e3e708d93"
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
            "iv": "foodco"
        },
        "name": {
            "iv": "FoodCo"
        },
        "description": {
            "en": "Sustainable eating products",
            "de": null
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
                    "position": "CEO"
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
            "iv": false
        }
    }
}
```
{% endcode %}

As you can see, we need a JSON object for our localized fields. To use a generalized structure, all objects have an `iv` (which stands for invariant) key, used for localized fields. Read more about the reasoning in the section concerning localization:

{% content-ref url="concepts/localization.md" %}
[localization.md](concepts/localization.md)
{% endcontent-ref %}

## People and Roles

The following people work together with Squidex to bring content to a website.

* **Developers** work together to bring new features to a website. Their responsibilities are to define the schemas in Squidex and to implement the business roles with Workflows and Permissions. To make it easier for them to find and fix bugs on the website, they also have full control of the content itself.
* **Editors** are responsible for writing the articles in different languages and conducting research for preparation of articles. As false information is a big deal in the news industry, Editors are not allowed to publish the content itself.
* **Reviewers** check the content before it gets published for spelling, grammar and the accuracy of facts, as well as reviewing other information in the content.
* **Publishers** work together with marketing and social media to decide when content should go live. They can also publish reviewed content but don't create any content themselves.
