---
description: How to use the Assets API to resize images.
---

# Assets

This documentation is based on the _FoodCrunch_ use case. Please open the below link side by side to this page to understand some of the examples.

{% content-ref url="../../introduction-and-use-case.md" %}
[introduction-and-use-case.md](../../introduction-and-use-case.md)
{% endcontent-ref %}

## How to retrieve assets and content?

All assets are publicly available and not secured. But the IDs are randomly generated as 128 bit number ([GUID](https://en.wikipedia.org/wiki/Universally\_unique\_identifier)) and almost impossible to find out just by trial and error. Consider your assets safe.

You can download and link assets using the following URL format:

```
http://<YOUR-DOMAIN>/api/assets/{app}/{idOrSlug}/{*more}
```

If you are using Squidex Cloud, the URL format will be:

```
https://cloud.squidex.io/api/assets/{app}/{idOrSlug}/{*more}
```

Below is an example of a typical asset URL.

```
https://cloud.squidex.io/api/assets/my-app/7ba1eb41-4943-442e-b033-dac4893dbd6c
```

In case the assets have a slug you can also use it for your URL:

```
https://cloud.squidex.io/api/assets/my-app/sebastians-avatar
```

If multiple assets with the slug exist it will return the first asset with this value.

The `more` parameter can be used to add additional text to the URL to improve the link quality. For example:

```
https://cloud.squidex.io/api/assets/my-app/sebastians-avatar/cto-of-squidex
```

The API reference with all parameters is provided here: [https://cloud.squidex.io/api/docs#operation/AssetContent\_GetAssetContent](https://cloud.squidex.io/api/docs#operation/AssetContent\_GetAssetContent)

## How to resize images?

The API provides several parameters to manipulate images. Resized images are cached permanently to improve the performance for the next requests.

Use the following query string parameters:

| Parameter  | Type    | Description                                                                                                                                                                                                                               |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`    | number  | The target width of the asset, if it is an image.                                                                                                                                                                                         |
| `height`   | number  | The target height of the asset, if it is an image.                                                                                                                                                                                        |
| `mode`     | string  | The resize mode when the width and height is defined. Default: `Max`                                                                                                                                                                      |
| `download` | number  | By default, Squidex provides the file name of the asset in the response. Therefore most browsers will download the file, which might be not desired for images. By setting this parameter to `0` you can prevent the download for images. |
| `version`  | number  | Use this value to get a concrete version. If omitted, the last version is returned. The initial version is `0` and it is updated with each update of the asset, not only when a new file version is uploaded.                             |
| `cache`    | number  | The client cache duration in seconds. Only affects the response header.                                                                                                                                                                   |
| `quality`  | number  | Define the quality of the resized image.                                                                                                                                                                                                  |
| `bg`       | string  | Background color, if the image has a transparent background.                                                                                                                                                                              |
| `focusX`   | number  | Overrides the X value of focus point as a relative value from 0 (left) to 1 (right). Can also be configured via the Management UI. The dimensions are changed during resize, the focus point will be always visible.                      |
| `focusY`   | number  | Overrides the Y value of focus point as a relative value from 0 (top) to 1 (bottom). Can also be configured via the Management UI. The dimensions are changed during resize, the focus point will be always visible.                      |
| `nofocus`  | boolean | Ignores the focus point when resizing.                                                                                                                                                                                                    |
| `force`    | boolean | Resizes the image, even it is cached on the server side. Can be used to invalidate broken cache entries.                                                                                                                                  |
| `auto`     | boolean | Delivers the image in the best format, depending on the `Accept` header. This is usually `webp` or `avif`.                                                                                                                                |

You have to pass in either the `width` or `height` parameter. if the asset is not an image these parameters have no effect.

Squidex supports the following resize modes:

| Mode         | Description                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Crop`       | Crops the resized image to fit the bounds of its container. If the desired width and height is greater than the image dimensions it behaves like `BoxPad`.           |
| `CropUpsize` | Crops the resized image to fit the bounds of its container, also desired width and height is greater than the image dimensions.                                      |
| `Pad`        | Pads the resized image to fit the bounds of its container. If only one dimension is passed, will maintain the original aspect ratio.                                 |
| `BoxPad`     | Pads the image to fit the bound of the container without resizing the original source. When down-scaling this mode performs the same functionality as `Pad`.         |
| `Max`        | Constrains the resized image to fit the bounds of its container maintaining the original aspect ratio.                                                               |
| `Min`        | Resizes the image until the shortest side reaches the set given dimension. Up-scaling is disabled in this mode and the original image will be returned if attempted. |

### How to change the image quality?

Add the `quality` parameter to the asset URL to define the quality from 0 (lowest) to 100 (best). If the quality of the image is defined, the image will always be returned in _jpeg_ format and you might lose transparency information.

## How caching works

Squidex provides the `ETag` \*\*header for each asset. The browser caches the asset, along with its ETag. If a user wants to retrieve the same URL resource again, it will first determine whether the locally cached version of the URL has expired (through the `Cache-Control` and the `Expire` \*\* headers).\
If the URL has not expired, it will retrieve the locally cached resource. If it determines that the URL has expired (is stale), the client will contact the server and send its previously-saved copy of the ETag along with the request in an `If-None-Match` field.\
Squidex now compares the passed ETag with the ETag of the current version of the asset. If the ETag values match, meaning that the asset has not changed, the server sends back an empty response with a [**HTTP 304 Not Modified**](https://en.wikipedia.org/wiki/HTTP\_304) status and the Browser will show the cached version.

More about the ETag header at [Wikipedia](https://en.wikipedia.org/wiki/HTTP\_ETag).

You can add the `cache` query parameter as a number of seconds to cache the image in the Browser.\
Then the following header is added to the response:

```
Cache-Control: public,max-age=<cache>
```

### Resolve references assets

When you have content items with asset fields, the assets are added as IDs to the content item. Therefore, by default you will only retrieve the IDs when you query content items and you have to do additional requests to get asset information.

You have two options to solve this.

### Use GraphQL

With GraphQL you can get exactly the information you are looking for. You have to define the fields you want to retrieve, from referenced assets or referenced contents.&#x20;

In the following example, the query is used to retrieve the testimonials with the associated company logo as the fields. (This example is NOT from the _FoodCrunch_ use case)

<figure><img src="../../../.gitbook/assets/2023-04-10_19-49.png" alt=""><figcaption><p>Use GraphQL to get asset information</p></figcaption></figure>

### Use headers in the REST endpoint

When using the normal REST endpoint you can use the `X-Resolve-Urls` to define the fields that should be resolved. The value of this header must be a comma-separated list of field names.

![Resolve the image URL](<../../../.gitbook/assets/image (12).png>)
