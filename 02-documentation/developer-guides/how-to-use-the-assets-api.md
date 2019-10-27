---
description: How to use the Assets API to resize images.
---

# Assets API

### How to retrieve assets and content?

All assets are publicly available and not secured. But the IDs are randomly generated as 128 bit number \([GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)\) and almost impossible to find out by just trial and error. So you are assets are safe.

You can download and link assets from the following URL:

```text
http://<YOUR-DOMAIN>/api/assets/{app}/{idOrSlug}/{*more}
```

So in case you are using the API you have to use:

```text
https://cloud.squidex.io/api/assets/{app}/{idOrSlug}/{*more}
```

Typically an asset URL will look like this:

```text
https://cloud.squidex.io/api/assets/my-app/7ba1eb41-4943-442e-b033-dac4893dbd6c
```

In case your assets have a slug you can also use it for your URL:

```text
https://cloud.squidex.io/api/assets/my-app/sebastians-avatar
```

If multiple assets with the slug exist it will return the first asset with this value.

The more parameter can be used to add additional text to the URL to improve your link quality:

```text
https://cloud.squidex.io/api/assets/my-app/sebastians-avatar/cto-of-squidex
```

The API reference with all parameters is provided here: [https://cloud.squidex.io/api/docs\#operation/AssetContent\_GetAssetContent](https://cloud.squidex.io/api/docs#operation/AssetContent_GetAssetContent)

### How can I resize images?

The API provides several parameters to provide and manipulate images. Resized images are cached permanently to improve the performance for the next requests.

Use the following query string parameters:

| Parameter | Description |
| :--- | :--- |
| `width` \(number\) | The target width of the asset, if it is an image.  |
| `height` \(number\) | The target height of the asset, if it is an image. |
| `mode` \(string\) | The resize mode when the width and height is defined. Default: `Max` |

You have to pass in either the `width` or `height` parameter. if the asset is not an image these parameters have no effect.

Squidex supports the following resize modes:

| Mode | Description |
| :--- | :--- |
| `Crop` | Crops the resized image to fit the bounds of its container. If the desired width and height is greater than the image dimensions it behaves like `BoxPad`. |
| `CropUpsize` | Crops the resized image to fit the bounds of its container, also desired width and height is greater than the image dimensions. |
| `Pad` | Pads the resized image to fit the bounds of its container. If only one dimension is passed, will maintain the original aspect ratio. |
| `BoxPad` | Pads the image to fit the bound of the container without resizing the original source. When downscaling, performs the same functionality as `Pad`. |
| `Max` | Constrains the resized image to fit the bounds of its container maintaining the original aspect ratio. |
| `Min` | Resizes the image until the shortest side reaches the set given dimension. Up-scaling is disabled in this mode and the original image will be returned if attempted. |

### How to change the image quality?

You can also add the `quality` parameter to the asset URL to define the quality from 0 \(lowest\) to 100 \(best\). If you define the quality the image will always be returned as jpeg format and you might loose transparency information.

### How caching works

Squidex provides the `ETag` __header for each asset. The browser caches the asset, along with its ETag. If the user wants retrieve the same URL resource again, it will first determine whether the locally cached version of the URL has expired \(through the `Cache-Control` and the `Expire` __headers\).  
If the URL has not expired, it will retrieve the locally cached resource. If it is determined that the URL has expired \(is stale\), the client will contact the server and send its previously-saved copy of the ETag along with the request in an `If-None-Match` field.   
Squidex now compares the passed ETag with the ETag of the current version of the asset. If the ETag values match, meaning that the asset has not changed, the server sends back an empty response with a [**HTTP 304 Not Modified**](https://en.wikipedia.org/wiki/HTTP_304) status and the Browser will show the cached version.

More about the ETag header at [Wikipedia](https://en.wikipedia.org/wiki/HTTP_ETag).

You can add the `cache` query parameter as a number of seconds to cache the image in the Browser.   
Then the following header is added to the response:

```text
Cache-Contro: public,max-age=<cache>
```

### More useful query parameters

<table>
  <thead>
    <tr>
      <th style="text-align:left">Parameter</th>
      <th style="text-align:left">Description</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>version</code> (number)</td>
      <td style="text-align:left">If you have update the asset with a new version of the file you can retrieve
        old versions of the file by adding the version header. The first version
        has value <code>0</code>, then <code>1</code>, <code>2</code> and so on.</td>
      <td
      style="text-align:left"></td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>download</code>
        </p>
        <p>(number)</p>
      </td>
      <td style="text-align:left">By default, Squidex provides the file name of the asset in the response.
        Therefore most browsers will download the file, which might be not desired
        for images. By setting this parameter to <code>0</code> you can prevent the
        download for images.</td>
      <td style="text-align:left"></td>
    </tr>
  </tbody>
</table>