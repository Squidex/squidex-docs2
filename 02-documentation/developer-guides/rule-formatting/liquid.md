---
description: How to format rules with Liquid templates.
---

# Liquid

You can use Liquid templates using the following syntax:

```
Liquid(<YOUR_SCRIPT>)
```

## Basic syntax

The liquid syntax is documented by shopify at [https://shopify.github.io/liquid/](https://shopify.github.io/liquid/)

## Special extensions

Squidex provides special extensions.

### Tags

#### reference

Resolves a content by ID and saves the content in a variable.

```
// Input

{% raw %}
{% for id in event.data.references.iv %}
   {% reference 'ref', id %}
   Text: {{ ref.data.field1.iv }} {{ ref.data.field2.iv }} {{ ref.id }}
{% endfor %}
{% endraw %}


// Output
Text: Content1_Field1 Content1_Field2 Content1_ID
Text: Content2_Field1 Content2_Field2 Content1_ID
```

#### asset

Resolves a asset by ID and saves the asset in a variable.

```
// Input

{% raw %}
{% for id in event.data.assets.iv %}
   {% asset 'ref', id %}
   Text: {{ ref.fileName }} {{ ref.id }}
{% endfor %}
{% endraw %}

// Output
Text: Asset1_FileName Asset1_ID
Text: Asset2_FileName Asset2_ID
```

### Filters

#### format\_date

Formats a date using a specified pattern.

```
{{event.timestamp | format_date: 'yyyy-MM-dd-hh-mm-ss'}}
```

#### timestamp

Returns the number of milliseconds between 1970/1/1 and a given date.

```
{{event.timestamp | timestamp}}
```

#### timestamp\_sec

Returns the number of seconds between 1970/1/1 and a given date.

```
{{event.timestamp_sec | timestamp}}
```

#### escape

Escapes a value to be a valid JSON string.

```
{{event.user.name | escape}}
```

#### html2text

Converts a HTML string to plain text.

```
{{event.data.body.iv | html2text}}
```

#### markdown2text

Converts a markdown string to plain text.

```
{{event.data.body.iv | markdown2text}}
```

#### md5

Calculate the MD5 hash from a given string. Use this method for hashing passwords, when backwards compatibility is important

```
{{event.data.password.iv | md5}}
```

#### sha256

Calculate the SHA256 hash from a given string. Use this method for hashing passwords.

```
{{event.data.password.iv | sha256}}
```

#### slugify

Calculates the slug of a text by removing all special characters and whitespaces to create a friendly term that can be used for SEO-friendly URLs.

```
{{event.data.title.iv | slugify}}
```

#### trim

Same as [strip](https://shopify.github.io/liquid/filters/strip/). Removes all whitespace (tabs, spaces, and newlines) from both the left and right sides of a string. It does not affect spaces between words.
