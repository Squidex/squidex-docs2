# How to use Squidex Identity

## About Squidex Identity

Squidex Identity server based on Squidex Headless CMS. It implements the OpenId Connect and OAuth 2.0 protocols to act as a central single sign on server. 
> https://github.com/Squidex/squidex-identity

## 1. Setup of Squidex identity

### 1.1. Clone Squidex.Identity

Clone the Squidex identity repository with the following command:

    git clone https://github.com/Squidex/squidex-identity.git

### 1.2. Create an identity app

You can create the app with predefined schemas either in the cloud or in your custom installation:

![Create Identity App](../../images/started/identity/new-identity-app.png)
    
### 1.3. Update the identity configuration

Update the configureation with the url to your squidex instance and the client id and secret of the default client.

![Copy Default Client](../../images/started/identity/default-client.png)

Update the configuration file at: `Squidex.Identity/appsettings.json`

```json
"app": {
    // ...
    "url": "https://cloud.squidex.io",
    "clientId": "identity:default",
    "clientSecret": "xxx",
    // ...
}
```

Of course you can also use environment variables, e.g.

* `APP__URL=https://cloud.squidex.io`
* `APP__CLIENTID=identity:default`
* `APP__CLIENTSECRET=xxx`

## 2. General application settings:

If you create a identity app in Squidex you will see a schema with the settings, where you can upload a logo, footer text, privacy settings and so on. 

Most settings are optional but you must setup credentials to an smpt server. 

![Site Setting](../../images/started/identity/content-setting.png)
    
Email Delivery Service: 
* https://www.mailjet.com/    
* https://www.sendgrid.com/

## 3. External authentication providers
If you want to use external authentication providers you can setup them in the authentication schemes section, here is an example for Google.

You have to create an OAuth 2.0-Client-IDs in the google developer console. You have to define the redirect_uri in this process and you must use 
`http://localhost:3500/signin-google`

the redirect urls for other authentication providers are:

 * `http://localhost:3500/signin-twitter`
 * `http://localhost:3500/signin-facebook`
 * `http://localhost:3500/signin-github`

![Authentication Schemes](../../images/started/identity/authentication-schemes.png)

## 4. External clients
When you want to connect an external application to Squidex identity you have to configure a client. This is a little bit complicated, but you can find all settings here: http://docs.identityserver.io/en/latest/reference/client.html

### Squidex as an external client
    
You can also setup Squidex as an external client, so that the same users can also login to manage content.

In the first step you have to create a new client:

![Self-Hosted](../../images/started/identity/self-hosted-1.png)

![Self-Hosted](../../images/started/identity/self-hosted-2.png)

In the second step you have to update the Squidex configuration at `Squidex/appsettings.json`

```json
"identity": {
    ...
    "oidcName": "selfHostedName",
    "oidcAuthority": "http://localhost:3500/",
    "oidcClient": "client:selfHosted",
    "oidcSecret": "xxx",
    ...
}  
```  

Then you can register at Squidex identity.

![Self-Hosted](../../images/started/identity/self-hosted-register.png)
