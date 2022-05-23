---
description: >-
  Learn how to embed content to unstructured text like markdown or rich-text to
  close the gap between unstructured content and structured conten
---

# Embed Content

## Use Case

Let's consider we have built a travel website and have a content type for hotels. When a content author writes an article about new offers or a guide for a destination, he might want to add hotel information to his article. Because the article is unstructured and just markdown or rich text, he has three options and none of them is satisfying.

1. He can copy and paste the hotel information to his article. When the hotel is updated his article will contain outdated information.
2. He can use a special placeholder in the markdown to reference an hotel and ask the developers to resolve this reference in the UI.
3. The developers can build a complex schema, for example with arrays, to structure the article.

As I said, none of these options is satisfying. Therefore this feature has been added.

## How to

How to use this feature:

### 1. Define which schemas can be embedded

When you create a string field, you can decide which schemas can be embedded:

![Configure String Field](<../../.gitbook/assets/image (76).png>)

In this case we only allow embedding hotels.

### 2. Add links to your string field

We can now use the markdown editor to add links to other content items:

![Add links](<../../.gitbook/assets/image (80).png>)

### 3. Use the GraphQL to fetch references

Use the new GraphQL structure to fetch the text and references. When you allow embedding, the structure of the GraphQL response changes, and we can fetch the text and the references with a single request:

![Get the references with GraphQL](<../../.gitbook/assets/image (75).png>)

### 4. Use the references to render the embedded content

In our frontend we can use both information together to render the embedded contents. In this sample we use react and react-markdown for that. We can hook into the rendering process and render custom components for links.

We just check if the link is referencing to a content item and if this content item is part of our references. Then we render the hotel.

```javascript
const hotelsRegex = new RegExp(`${CONFIG.url}\\/api/content\\/${CONFIG.appName}\\/hotels/(?<id>[a-z0-9\\-]+)`);

export const Markdown = ({ markdown, references }) => {
    return (
        <ReactMarkdown children={markdown} components={{
            a({ href, children }) {
                const match = hotelsRegex.exec(href);

                if (match && match.groups) {
                    const referenceId = match.groups.id;
                    const reference = references?.find(x => x.id === referenceId);

                    if (reference) {
                        return <EmbeddableHotel hotel={reference} />;
                    }
                } 
                
                return <a href={href} target='_blank' rel='noopener noreferrer'>{children}</a>;
            }
        }} />
    )
}s
```

Because markdown is unstructured we have to use a regular expression for that. The result is an article with embedded hotel information:

![Embedded Hotels in the UI](<../../.gitbook/assets/image (57).png>)

This feature gives your content authors a lot more flexibility, simplifies your schemas and still n.

A sample for this feature is available in Github: [https://github.com/Squidex/squidex-samples/tree/master/jscript/react/sample-hotels](https://github.com/Squidex/squidex-samples/tree/master/jscript/react/sample-hotels).&#x20;

The template for the schemas and sample content is also available under: [https://github.com/Squidex/templates/tree/main/sample-hotels](https://github.com/Squidex/templates/tree/main/sample-hotels)
