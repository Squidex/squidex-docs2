---
description: Helper Methods for Scripting
---

# Scripting Helper Methods

The following helper methods are not part of the ES5 JavaScript standard, but they are very helpful for a lot of use cases.

<table><thead><tr><th width="299">Name</th><th>Description</th></tr></thead><tbody><tr><td><code>html2Text(text)</code></td><td>Converts a HTML string to plain text.</td></tr><tr><td><code>markdown2Text(text)</code></td><td>Converts a markdown string to plain text.</td></tr><tr><td><code>formatDate(date,pattern)</code></td><td>Formats a JavaScript date object using the specified pattern.</td></tr><tr><td><code>formatTime(date,pattern)</code></td><td>Same as <code>formatDate</code>.</td></tr><tr><td><code>wordCount(text)</code></td><td>Counts the number of words in a text. Useful in combination with <code>html2Text</code> or <code>markdown2Text</code>.</td></tr><tr><td><code>characterCount(text)</code></td><td>Counts the number of characters in a text. Useful in combination with <code>html2Text</code> or <code>markdown2Text</code>.</td></tr><tr><td><code>toCamelCase(text)</code></td><td>Converts a text to camelCase.</td></tr><tr><td><code>toPascalCase(text)</code></td><td>Converts a text to PascalCase.</td></tr><tr><td><code>sha256(text)</code></td><td>Calculate the SHA256 hash from a given string. Use this method for hashing passwords.</td></tr><tr><td><code>md5(text)</code></td><td>Calculate the MD5 hash from a given string. Use this method for hashing passwords, when backwards compatibility is important.</td></tr><tr><td><code>slugify(text)</code></td><td>Calculates the slug of a text by removing all special characters and whitespaces to create a friendly term that can be used for SEO-friendly URLs.</td></tr></tbody></table>
