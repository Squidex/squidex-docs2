---
description: Quickly Deploy a Simple Vue.js Blog with Squidex
---

# Vue.js Blog with Squidex

This article provides you with instructions on how to quickly deploy a Vue.js blog with Squidex Cloud. The same approach can also be used for self-hosted Squidex. For installation instructions click [here](../installation/).

## Prerequisites

* Account at [cloud.squidex.io](https://cloud.squidex.io/) (or a self-hosted Squidex).
* Account at [app.netlify.com](https://app.netlify.com).
* Account at [github.com](https://github.com/).
* For local deployment / development:
  * nodejs 16 or above.
  * npm 8 or above.

## Creating the Squidex App

For this quick-start, you can create an App with pre-populated schemas directly in Squidex. To do so, follow the steps below:

1. Navigate to [https://cloud.squidex.io](https://cloud.squidex.io/) and login. (If you do not yet have an account, create one).
2.  Click **Starter Sample Blog** (1), give it a unique **name** (2) such as `vuejs-blog-with-squidex-[your_initials]` and click **Create** (3). \


    <div align="left">

    <figure><img src="../../.gitbook/assets/2022-12-31_21-09.png" alt=""><figcaption><p>Creating the Starter Sample Blog App on Squidex</p></figcaption></figure>

    </div>
3.  Click on the newly created App to navigate into it. You should also make a note of the _App Name_, as it will be required later in the instructions. \


    <div align="left">

    <figure><img src="../../.gitbook/assets/2023-01-01_12-36.png" alt=""><figcaption><p>Accessing the Squidex App</p></figcaption></figure>

    </div>

## Creating a Client in the Squidex App

In this step, we will create a client that will be used by the Vue.js code to talk to Squidex. \
When an App is created, there is a default client already present. However, it has an _Owner_ role by default, so as a best practice, we don't recommend that it's used.

1.  Navigate to **Settings** (4) > **Clients** (5) in the App. Next enter a **Name** for the client (6) and click **Add Client** (7).\


    <div align="left">

    <figure><img src="../../.gitbook/assets/2022-12-31_21-30.png" alt=""><figcaption><p>Create a client for Vue.js</p></figcaption></figure>

    </div>
2.  This creates a new client with the role of _Editor_. **Copy** (8) the _Client Id_ and _Client Secret_, as they will also be required along with the _App Name_ later in the instructions.\


    <div align="left">

    <figure><img src="../../.gitbook/assets/2022-12-31_21-36.png" alt=""><figcaption><p>Copy the Client Id &#x26; Client Secret</p></figcaption></figure>

    </div>

You are now ready to use this App with the code. &#x20;

If you prefer to run the sample code locally, proceed with these steps [here](vue.js-blog-with-squidex.md#running-the-vue.js-blog-locally).

## Deploying the Vue.js Blog

You can deploy the Vue.js code using various methods such as self-hosting, as a Docker container or in Kubernetes etc. You can also deploy them to various modern, fast and developer-friendly serverless platforms such as _Netlify_. The instructions here cover the latter:

### Deploying to Netlify

_Netlify_ is a platform that helps you to quickly build and deploy sites to a global network with a host of features and you can get stated for free!

When you click the **Deploy to Netlify** button below, the following steps will occur:

1. You will be redirected to _Netlify_ and prompted to sign in. (If you don't yet have an account visit [https://app.netlify.com/signup](https://app.netlify.com/signup) and create an account first).
2. Next, you will be asked to connect to your GitHub account. This step is required, as the deployment process will clone the code to a repository in your own account.&#x20;
3.  Finally, you will be prompted to enter a name for the repository and the environment variables for the Squidex App. Enter the values noted down from before. \
    <mark style="color:orange;background-color:orange;">Your values will be different than the values in the screenshot.</mark>&#x20;

    <figure><img src="../../.gitbook/assets/2023-01-03_00-45_1.png" alt=""><figcaption><p>Configuring the Netlify site</p></figcaption></figure>
4. Next, _Netlify_ will deploy the App and provide a URL to access the App. (_Netlify_ runs the App in a starter plan, which is free).

Click [![Deploy to Netlify Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sangramrath/squidex-vuejs-blog-starter) to get started.

### Running the Code Locally

1. Start by cloning the Vue.js sample blog code to your machine:\
   `git clone https://github.com/sangramrath/squidex-vuejs-blog-starter.git`\

2.  Next, create the environment variables files using the example file available i.e. `.env.example`. To separate your variables from development and production you can create `.env.development` and `.env.production`.\
    \
    Add the _App name_, _Client ID_ and _Client Secret_ values noted down earlier. For the _URL_, use `https://cloud.squidex.io` if using Squidex Cloud or the URL to your Squidex instance, e.g. `http://localhost:5000` if you run it locally.\
    \
    The final file may look something like this:

    <figure><img src="../../.gitbook/assets/2023-01-01_12-07.png" alt=""><figcaption><p>Environment file example</p></figcaption></figure>
3. Run `npm install` to install the node modules and setup the project.
4.  Run `npm run serve` to compile and run it in development mode. This will serve the App at `http://localhost:8080/`. (sample screenshot below):\


    <div align="left">

    <figure><img src="../../.gitbook/assets/2023-01-01_12-17.png" alt=""><figcaption><p>Successfully running Vue.js App</p></figcaption></figure>

    </div>

    \
    The development mode supports hot-reload for any live changes.
5.  Access your App locally, it should display your content fetched from Squidex. The _Starter Sample Blog_ App at Squidex has only one post.\


    <figure><img src="../../.gitbook/assets/2023-01-01_12-22.png" alt=""><figcaption><p>Blog running locally</p></figcaption></figure>
