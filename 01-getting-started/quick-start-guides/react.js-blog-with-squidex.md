---
description: Quickly Deploy a Simple React.js Blog with Squidex
---

# React.js Blog with Squidex

This articles provides you with instructions on how to quickly deploy a React.js blog with Squidex Cloud. The same approach can also be used for a self-hosted Squidex. For installation instructions click [here](../installation/).

## Prerequisites

* Account at [cloud.squidex.io](https://cloud.squidex.io/) (or a self-hosted Squidex).
* Account at [app.netlify.com](https://app.netlify.com).
* Account at [github.com](https://github.com/).
* For local deployment / development:
  * nodejs 16 or above.
  * npm 8 or above.

## Creating the Squidex App

For this quick-start you can create the App with pre-populated schemas directly in Squidex. To do this follow the steps below:

1. Navigate to [https://cloud.squidex.io](https://cloud.squidex.io) and login. (If you do not have an account, create one).
2.  Click **Starter Sample Blog** (1), give it a unique **Name** (2) such as `reactjs-blog-with-squidex-[your_initials]` and click **Create** (3). \


    <figure><img src="../../.gitbook/assets/2023-01-11_43-09.png" alt=""><figcaption><p>Creating the Starter Sample Blog App on Squidex</p></figcaption></figure>
3.  Click on the newly-created App to navigate into it. You should make a note of the _App Name_ as it will be required later in the instructions.\


    <figure><img src="../../.gitbook/assets/2023-01-11_48-09.png" alt=""><figcaption><p>Accessing the Squidex App</p></figcaption></figure>

## Creating a Client in the Squidex App

In this step, let's create a client that will be used by the React.js code to talk to Squidex. \
When an App is created, there is a default client already present however it has an _Owner_ role by default and so it's best not to use it as a best practice.

1.  Navigate to **Settings** (4) > **Clients** (5) in the App. Next enter a **Name** for the client (6) and click **Add Client** (7).\


    <figure><img src="../../.gitbook/assets/2023-01-02_12-18.png" alt=""><figcaption><p>Create a client for React.js</p></figcaption></figure>
2.  This creates a new client with the role of _Editor_. **Copy** (8) the _Client Id_ and _Client Secret_ as they will also be required along with the _App Name_ later in the instructions.\


    <figure><img src="../../.gitbook/assets/2023-01-02_00-17.png" alt=""><figcaption><p>Copy the Client Id &#x26; Client Secret</p></figcaption></figure>

You are now ready to use this App with the code. &#x20;

If you wish to run the sample code locally, proceed with these steps [here](react.js-blog-with-squidex.md#running-the-vue.js-blog-locally), otherwise, continue to deploy the blog to an online platform.

## Deploying the React.js Blog

You can deploy the React.js code using various methods such as self-hosting and as a Docker container, in Kubernetes etc. You can also deploy to various modern, fast and developer-friendly serverless platforms such as _Netlify_. The instructions here cover the latter:&#x20;

### Deploying to Netlify

_Netlify_ is a platform that helps you quickly build and deploy sites to a global network with a host of features and you can get stated for free!

When you click the **Deploy to Netlify** button below, the following steps will occur:

1. You will be redirected to _Netlify_ and prompted to sign in. (If you do not have an account visit [https://app.netlify.com/signup](https://app.netlify.com/signup) and create an account first).
2. Next, you will be asked to connect to your GitHub account. This step is required as the deployment process will clone the code to a repository in your own account.&#x20;
3. Finally, you will be prompted to enter a name for the repository and the environment variables for the Squidex App. Enter the values noted down from before. \
   <mark style="color:orange;background-color:orange;">Your values will be different than the values in the screenshot.</mark>&#x20;

<figure><img src="../../.gitbook/assets/2023-01-03_00-45.png" alt=""><figcaption><p>Configuring the Netlify site</p></figcaption></figure>

4. Next, _Netlify_ will deploy the App and provide a URL to access the App. (_Netlify_ runs the App in a Starter plan which is free).

Click[![Deploy to Netlify Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sangramrath/squidex-reactjs-blog-starter) to get started.

### Running the Code Locally

1. Start by cloning the React.js sample blog code to your machine.\
   `git clone https://github.com/sangramrath/squidex-reactjs-blog-starter.git`\

2.  Next, create the environment variables files using the example file available i.e. `.env.example`. To separate your variables from development and production you can create `.env.development` and `.env.production`.\
    \
    Add the _App Name_, _Client ID_ and _Client Secret_ values noted down earlier. For the _URL_ use `https://cloud.squidex.io` if using Squidex Cloud or the URL to your Squidex instance, e.g. `http://localhost:5000` if you run it locally.\
    \
    The final file may look something like this:

    <figure><img src="../../.gitbook/assets/2023-01-02_00-51.png" alt=""><figcaption><p>Environment file example</p></figcaption></figure>
3. Run `npm install` to install the node modules and setup the project.
4.  Run `npm start` to compile and run it in development mode. This will serve the App at `http://localhost:3000/`. (sample screenshot below):\


    <figure><img src="../../.gitbook/assets/2023-01-02_00-48.png" alt=""><figcaption><p>Successfully running React.js App</p></figcaption></figure>

    \
    The development mode supports hot-reload for any live changes.
5.  Access your App locally, it should display your content fetched from Squidex. The _Starter Sample Blog_ App at Squidex has only one post.\


    <figure><img src="../../.gitbook/assets/2023-01-02_00-44.png" alt=""><figcaption><p>Blog running locally</p></figcaption></figure>
