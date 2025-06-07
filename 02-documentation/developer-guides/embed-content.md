---
description: >-
  Learn to Embed Content to Unstructured Text Such as Markdown or Rich-Text to
  Close the Gap Between Unstructured Content and Structured Content
---

# Embed Content

This documentation is based on the _FoodCrunch_ use case. Please open the link below alongside this page to understand the examples.

{% content-ref url="../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../introduction-and-use-case.md)
{% endcontent-ref %}

## Use Case

When a content author writes an article about new food startups or a review for a product sold by a startup, they might want to add startup information to the article. As the article is unstructured and just Markdown or rich-text, there are limited options mentioned below and none of them really work:

1. The author can copy and paste the startup information to the article. When the information about the startup is updated at a later date, the article will contain outdated information.
2. It's possible to use a special placeholder in the Markdown to reference the startup and ask the developers to resolve this reference in the UI.
3. The developers can build a complex schema, for example with arrays to structure the article.

As none of the options are practical and convenient, this feature has been added.

## How to Use Embedded Contents

To use this feature follow the steps below:

### 1. Define Which Schemas Can be Embedded

By editing the string field, you can decide which schemas can be embedded. Set **Markdown** (1) as the editor as it provides easy options to insert contents. Next, check **Is embedding contents and assets** (2) and select the schema.&#x20;

In this example, we only allow embedding of contents from the `startups` schema.

<div align="left">

<figure><img src="../../.gitbook/assets/2023-05-01_15-48.png" alt=""><figcaption><p>Enabling embedding on a string field</p></figcaption></figure>

</div>

### 2. Add Links to Your String Field

We can now use the Markdown editor to add links to other content items. To do so, click the **Insert Contents** (1) button in the editor.&#x20;

{% hint style="info" %}
The string field must be set to Markdown editor to see the insert contents button.
{% endhint %}

<div align="left">

<figure><img src="../../.gitbook/assets/2023-05-01_15-32.png" alt=""><figcaption><p>Adding linked contents from another schema</p></figcaption></figure>

</div>

On the popup window, select the entries you wish to link by **checking the box** (2) next to them and click **Link selected contents** (3). Refer to the example screenshot below, here we are selecting a couple of startups:

<div align="left">

<figure><img src="../../.gitbook/assets/2023-05-01_15-35.png" alt=""><figcaption><p>Selecting linked contents from another schema</p></figcaption></figure>

</div>

The result should be two links appearing in the Markdown editor. An example screenshot is provided below for reference:

<div align="left">

<figure><img src="../../.gitbook/assets/2023-05-01_15-41.png" alt=""><figcaption><p>Linked content from another schema</p></figcaption></figure>

</div>

### 3. Use the GraphQL to Fetch References

Use the new GraphQL structure to fetch the text and references. When you allow embedding, the structure of the GraphQL response changes and you can fetch the text and the references with a single request:

<div align="left">

<figure><img src="../../.gitbook/assets/2023-05-01_21-16.png" alt=""><figcaption><p>Get the references with GraphQL</p></figcaption></figure>

</div>

### 4. Use the References to Render the Embedded Content

In the frontend both of the pieces of information can be used together to render the embedded content. In this sample code we've used react and react-markdown for this purpose. We can hook into the rendering process and render custom components for links.

At this point, it's important to check if the link is referencing  a content item and if this content item is part of the references. Then it's possible to render the startup.

{% code overflow="wrap" %}
```javascript
const startupsRegex = new RegExp(`${CONFIG.url}\\/api/content\\/${CONFIG.appName}\\/startups/(?<id>[a-z0-9\\-]+)`);

export const Markdown = ({ markdown, references }) => {
    return (
        <ReactMarkdown children={markdown} components={{
            a({ href, children }) {
                const match = startupsRegex.exec(href);

                if (match && match.groups) {
                    const referenceId = match.groups.id;
                    const reference = references?.find(x => x.id === referenceId);

                    if (reference) {
                        return <EmbeddableStartup startup={reference} />;
                    }
                } 
                
                return <a href={href} target='_blank' rel='noopener noreferrer'>{children}</a>;
            }
        }} />
    )
}s
```
{% endcode %}

As Markdown is unstructured  a regular expression must be used for this. The result is an article with embedded startup information.

This feature gives the content authors a lot more flexibility and simplifies the schemas in question.

### Examples

A sample for this feature is available in GitHub: [https://github.com/Squidex/squidex-samples/tree/master/jscript/react/sample-hotels](https://github.com/Squidex/squidex-samples/tree/master/jscript/react/sample-hotels).&#x20;

{% hint style="info" %}
This sample does not use the _FoodCrunch_ use case but can be used as a reference to understand how it is implemented.
{% endhint %}

The template for the schemas and sample content is also available under: [https://github.com/Squidex/templates/tree/main/sample-hotels](https://github.com/Squidex/templates/tree/main/sample-hotels)
