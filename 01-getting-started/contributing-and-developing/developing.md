---
description: >-
  If you want to contribute to Squidex or write custom extensions for it, this
  page will give you an introduction how to setup your development environment.
---

# Developing

You can find the source code on GitHub: [https://github.com/squidex/squidex](https://github.com/squidex/squidex)

## Required Tools

To work with the source code you need the following tools.

### Docker

We generally recommend to install Docker on your Developer machine. It makes your live much easier.

* [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/)
* [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/)

{% hint style="info" %}
Personally I was not able to run newer versions of Docker on Windows 10 Home. If you do not have a Windows 10 PRO license, I recommend not to invest the money. Get a cheap build server for a few bucks per month or just install MongoDB manually. It takes around 15 minutes only.
{% endhint %}

### For the backend

* [.NET 6  SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
* [.NET 5 SDK](https://dotnet.microsoft.com/download/dotnet/5.0) (for version <= 6.1.)
* [.NET Core 2.2 SDK](https://dotnet.microsoft.com/download/dotnet-core/2.2) or [.NET Core 3.0 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.0) (for older versions of Squidex)
* [MongoDB](https://www.mongodb.com)
* Optionally: [RabbitMQ](https://www.rabbitmq.com/download.html)
* Optionally: [EventStore](https://eventstore.org)

#### Setup

We also provide ready to use docker configurations: [https://github.com/squidex/squidex-docker](https://github.com/squidex/squidex-docker).

Just execute the following commands to get a MongoDB installation for development:

```bash
git clone https://github.com/squidex/squidex-docker
cd squidex-docker/development
docker-compose up -d
```

### For the frontend

* [NodeJS](https://nodejs.org/en/) (>= 10.0)

Usually newer versions are better but we have the experience that newer versions of NodeJS consume a lot of memory during build or when running webpack dev server.

### IDE and editors

You can use any editor you want, but our recommendation is to use:

* [Visual Studio 2022 Community Edition](https://visualstudio.microsoft.com/de/vs/community/) for the backend OR
* [Visual Studio 2019 Community Edition ](https://visualstudio.microsoft.com/vs/?rr=https%3A%2F%2Fwww.google.com%2F)for the backend.
* [Visual Studio Code](https://code.visualstudio.com) for the frontend with the following plugins installed:
  * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (to run linting for typescript)
  * [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) (to run linting for scss / css)
  * [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)

## How to run Squidex

You have to run both, frontend and backend, independently. The first time it feels redundant and annoying and we also had some code to run the webpack dev server automatically when the application is started. But you will recognize that it takes a minute for the webpack dev server to start. Therefore we decoupled the commands, so that you can keep the webpack dev server running, even when you have to restart the backend application.

{% hint style="info" %}
Before you start you should also ensure that the certificates for the test environment are installed. They can be found under `/dev` in the Squidex folder.
{% endhint %}

### Frontend

The frontend is written with [Angular](https://angular.io) and [webpack](https://webpack.js.org). Therefore you have to run the [webpack web dev server](https://webpack.js.org/configuration/dev-server/). It is a server application that builds the website and watches the file system. Whenever you make a change to a file, the server will run the build process and reload the website automatically. It tries to compile only the files that have changed and can even reload the style sheets without reloading the site in some cases.

#### How to run the Webpack Dev Server?

```
cd frontend # Go to the frontend
npm i # Install all dependencies, only needed the first time
npm start
```

{% hint style="info" %}
Installing the dependencies is only needed once or when the **project.json** file has changed.
{% endhint %}

Optionally:

1. `npm rebuild node-sass --force` (Only if you have issues with node-sass)
2. `npm test` (Runs the unit tests and listens for changes)
3. `npm run test:coverage` (Runs the unit tests and calculates the test coverage).

Btw: As the name _webpack dev server_ indicates, it is only used for development. For production we bundle and minimize all typescript, html and sass files and add the bundles to the deployment package. So don't be worried when the frontend downloads hundred of files during development.

### Backend

```bash
cd backend
cd src/Squidex
dotnet restore # Install all dependencies
dotnet run
```

Ensure that the `ASPNETCORE_ENVIRONMENT` environment variable is set to `Development`, either through a `launchSettings.json` or through your IDE's settings.

Open [https://localhost:5001](https://localhost:5001) to run Squidex.

You can also run and debug the backend with Visual Studio 2019. But here are some things you should do before you start your debug session:

1. Recommended: Ensure that you run the `Squidex` project, which means that you use the integrated Kestrel web server, which starts faster than IIS Express.
2. Recommended: Uncheck the `Launch browser` setting. You just want to keep Squidex open during development and not close and open the window all the time to make debugging the frontend with your browser easier.
