---
description: Provide a live preview on your website for your content editors.
---

# Preview Content

By default, Squidex will only deliver content that has been published. But it can be very useful to review content in your production environment before you actually publish it. This guide shows you how to do it.

## Step 1: Query unpublished content

To retrieve unpublished content you can add the `X-Unpublished` header to all your HTTP requests to the Squidex API (REST or GraphQL). For the website I have added a top secret query parameter to the blog page. When this query parameter is set to true, it will create add this header to the requests.

The following example shows how you can do it with the C# client library:

```csharp
public BlogPost Post { get; set; }

public async Task<IActionResult> OnGet(string slug, bool secretQueryParameter = false)
{
    var postsClient = clientManager.GetClient<BlogPost, BlogPostData>("blog");

    var context = QueryContext.Default.Unpublished(secretQueryParameter);

    var posts = await postsClient.GetAsync(filter: $"data/slug/iv eq '{slug}'", context);
    var post = pages.Items.FirstOrDefault();

    if (post == null)
    {
        return NotFound();
    }

    Post = post;

    return Page();
}
```

## Step 2: Manage preview URLs

You can define preview URL per schema in the following menu item:

1. Go to the settings area (1)
2. Select your schema (2)
3. Select the "More" tab (3)
4. Scroll to the "Preview URLs" (4)

![Navigation to Preview URLs](<../../.gitbook/assets/image (75).png>)

The following example shows 2 preview URLs:

1. The URL to the normal website.
2. The URL to an dedicated mobile website (just as an example).

As you can see, you can use a placeholder with the JavaScript interpolation syntax, e.g.

1. `${id}` of the content.
2. `${data.slug}`: Slug field (if not localized).
3. `${data.slug.iv}`: Slug field, alternative syntax.
4. `${data.title.en}`: Title in English
5. `${data.title.en-US}`: Title in American English
6. `${version}`: Version of the content item.

![Preview URLs](<../../.gitbook/assets/image (72).png>)

## Step 3: Use the preview button

If you open a saved content item, you will see the buttons with the preview URLs:

![The preview button](<../../.gitbook/assets/image (74).png>)
