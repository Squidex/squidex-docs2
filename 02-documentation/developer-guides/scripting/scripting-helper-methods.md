# Scripting Helper Methods

The following helper methods that are not part of the ES5 Javascript standard, but very helpful for a lot of use cases.

| Name | Description |
| :--- | :--- |
| `html2Text(text)` | Converts a HTML string to plain text. |
| `markdown2Text(text)` | Converts a markdown string to plain text. |
| `formatDate(date,pattern)` | Formats a JavaScript date object using the specified pattern. |
| `formatTime(date,pattern)` | Same as formatDate. |
| `wordCount(text)` | Counts the number of words in a text. Useful in combination with `html2Text` or `markdown2Text`. |
| `characterCount(text)` | Counts the number of characters in a text. Useful in combination with `html2Text` or `markdown2Text`. |
| `toCamelCase(text)` | Converts a text to camelCase. |
| `toPascalCase(text)` | Converts a text to PascalCase. |
| `sha256(text)` | Calculate the SHA256 hash from a given string. Use this method for hashing passwords. |
| `md5(text)` | Calculate the MD5 hash from a given string. Use this method for hashing passwords, when backwards compatibility is important. |
| `slugify(text)` | Calculates the slug of a text by removing all special characters and whitespaces to create a friendly term that can be used for SEO-friendly URLs. |

