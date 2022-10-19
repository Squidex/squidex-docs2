---
description: A short tutorial how to use Squidex with Postman.
---

# Postman

This is a short tutorial how to make the first requests with Postman.

## What is Postman

Postman is a free collaboration platform for API development and a good way to get started.

{% embed url="https://www.getpostman.com/downloads/" %}

## Lets get started

### 1. Create an App

The first step is to create an app, which is just another name for project or space.

1. Click the "New App" button.
2. Enter a name for your App. The name must be unique so it might already been taken if you use the cloud version. The name can also contain only lowercase letters, numbers and dashes because it will be part of the URLs.
3. Click the "Create" button.

![Create a new App](<../../../.gitbook/assets/image (57) (2) (2) (2) (2) (2) (2) (1) (2) (1) (1) (1).png>)

Your app will show up in your list. Just click your App (1) to move to the next step:

![](<../../../.gitbook/assets/image (42).png>)

Read more about Apps:

{% content-ref url="../../concepts/apps.md" %}
[apps.md](../../concepts/apps.md)
{% endcontent-ref %}

### 2. Create a Schema

Next create a schema, which is like a database table with fields of different types:

1. Go to the schemas section of your App.
2. Click the "+" button.
3. Choose a name of your schema. Like the App name it is used in URLs, so it must be unique within your App and it cannot be changed later.
4. Click the "Create" button to create a new schema.

![Create a new Schema](<../../../.gitbook/assets/image (43).png>)

Now we are going to add a new field:

1. Click the "Add Field" button in the bottom right of the screen.
2. Ensure that the field type is set to "String".
3. Enter a field name.
4. Click "Create and close" to create a new field.

![Add a new field to our schema](<../../../.gitbook/assets/image (69) (1) (1).png>)

Also ensure that the schema is published. Otherwise you cannot create content for the schema.

![Publish your content](<../../../.gitbook/assets/image (45).png>)

If you want to learn more about schemas use the following page:

{% content-ref url="../../concepts/schemas.md" %}
[schemas.md](../../concepts/schemas.md)
{% endcontent-ref %}

### 3. Add Content

Add some content to your schema.

1. Go to the content section of your App.
2. Select your created schema.
3. Click the "New" button to create a new content item.

![Create content](<../../../.gitbook/assets/image (46).png>)

![Go to contents section](<../../../.gitbook/assets/contents (1).png>)

Now you will see the content screen. If you have added more fields it will look differently of course.

1. Enter some texts or values for your fields.
2. Click the "Save and Publish" button. By default only published content items are visible in the API. Therefore it is important not to click the "Save" button.

![](<../../../.gitbook/assets/image (47).png>)

### 4. Connect to your app using a client

A client represents an application like a mobile app or server application.

We have implemented the [OpenID client credentials flow](https://docs.axway.com/u/documentation/api\_gateway/7.5.3/webhelp\_portal\_oauth/Content/OAuthGuideTopics/oauth\_flows\_client\_credentials.). It is an secure and open standard to protect your APIs and to provide authentication for clients (aka applications) and users. It is also used big big players like Microsoft, Github and Google. When you login to applications using third party logins you have already used it.

{% content-ref url="authentication.md" %}
[authentication.md](authentication.md)
{% endcontent-ref %}

By default, a default client is generated for your App If this is not the case you are probably running an older version of Squidex. Then you have to create a new client with a name of your choice.

To acquire a token you have to do the following steps:

1. Go the setting section of your App.
2. Go the the clients setting.
3. Click the "Connect" button.

![](<../../../.gitbook/assets/image (65) (1) (1) (1).png>)

In this dialog we provide explanations how to connect to your app. For now we connect manually with Postman. Click the first option (1).

![Connect Wizard Step 1](<../../../.gitbook/assets/image (48).png>)

In the next step you see the token that is generated for you and how to use it. Just copy the token by clicking the copy-button (2) that is marked with a red dot here.

![Connect Wizard Step 2](<../../../.gitbook/assets/image (49).png>)

This token is valid for 30 days, but can be renewed as often as you want.

You can also access a token with a HTTP request using the client id and secret:

```
$ curl
    -X POST 'https://cloud.squidex.io/identity-server/connect/token/' 
    -H 'Content-Type: application/x-www-form-urlencoded' 
    -d 'grant_type=client_credentials&
        client_id=[APP_NAME]:[CLIENT_ID]&
        client_secret=[CLIENT_SECRET]&
        scope=squidex-api'
```

### 5. Download OpenAPI Specification

Squidex creates an OpenAPI documentation for your App. We are going to download it to import it to Postman:

1. Go to the API section of your App.
2. Click the "Content API" link to open the API docs in a new tab.

![API section](<../../../.gitbook/assets/image (50).png>)

The documentation shows all the endpoints that are available for your content. Download the OpenAPI specification file and save it in your file system to import it with Postman.

![Download the OpenAPI specification](<../../../.gitbook/assets/image (51).png>)

### 6. Make the request with Postman

We have to import the OpenAPI file to Postman. Click the Import button (1) in the file settings and select your file that you have saved before.

![Import the OpenAPI spec in Postman](<../../../.gitbook/assets/image (53).png>)

You should be able to see your API now:

1. Go to Collections section.
2. Select the ContentAPI for your App.
3. Select the endpoints for your schema.
4. Select the query endpoint to query all contents items.
5. Unclick all query parameters.

![Your schema in Postman](<../../../.gitbook/assets/image (54).png>)

The last step is to enter you access token:

1. Go to the Authorization settings of your API.
2. Paste in your access token.
3. Send your request with the "Send" button.

![](<../../../.gitbook/assets/image (55).png>)

You have created your first app, schema and content with Squidex and you have learned how to retrieve the content items.
