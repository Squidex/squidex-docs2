---
description: >-
  An Introduction on Setting Up Your Development Environment (this step is
  required if you want to contribute to Squidex or write customized extensions
  for it)
---

# Developing

You can find the source code on GitHub: [https://github.com/squidex/squidex](https://github.com/squidex/squidex)

## Required Tools

To work with the source code you need the following tools.

### Docker

We recommend using Docker on your developer machine, it makes life much easier!

* [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
* [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
* [Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)

{% hint style="info" %}
Note, we weren't able to run newer versions of Docker on Windows 10 Home. If you don't have a Windows 10 PRO license, we recommend not wasting your money. Get a cheap build server for a few bucks per month instead, or just install MongoDB manually. It only takes around 15 minutes to install.
{% endhint %}

### For the Backend

* [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
* [.NET 5 SDK](https://dotnet.microsoft.com/download/dotnet/5.0) (for version <= 6.1)
* [.NET Core 2.2 SDK](https://dotnet.microsoft.com/download/dotnet-core/2.2) or [.NET Core 3.0 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.0) (for older versions of Squidex)
* [MongoDB](https://www.mongodb.com)
* Optionally: [RabbitMQ](https://www.rabbitmq.com/download.html)
* Optionally: [EventStore](https://eventstore.org)

#### Setup

You'll find ready to use Docker configurations for development at [https://github.com/squidex/squidex-docker](https://github.com/squidex/squidex-docker).

Execute the following commands to get a MongoDB installation for development.

```bash
git clone https://github.com/squidex/squidex-docker
cd squidex-docker/development
docker-compose up -d
```

### For the Frontend

* [NodeJS](https://nodejs.org/en/) (>= 10.0)

Usually, newer versions are better, but the newer versions of NodeJS are renowned for consuming a lot of memory during a build or when running _Webpack Dev Server_.

### IDEs and Editors

You can use any editor you want, but our recommendation is to use:

* [Visual Studio 2022 Community Edition](https://visualstudio.microsoft.com/de/vs/community/) OR [Visual Studio 2019 Community Edition ](https://visualstudio.microsoft.com/vs/?rr=https%3A%2F%2Fwww.google.com%2F)for the backend.
* [Visual Studio Code](https://code.visualstudio.com) for the frontend with the following plugins installed:
  * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (to run linting for typescript).
  * [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) (to run linting for scss / css).
  * [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).

## How to Run Squidex

To run Squidex, you must run both frontend and backend independently. This might feel redundant and annoying at first (we also had to use some code to run the the _Webpack Dev Server_ automatically when the application started), but it only takes a minute for the _Webpack Dev Server_ to begin. We have decoupled the commands so you can keep the _Webpack Dev Server_ running, even when you have to restart the backend application.

{% hint style="info" %}
Before you start, ensure that the certificates for the test environment are installed. They can be found under `/dev` in the Squidex folder.
{% endhint %}

### Frontend

The frontend is written with [Angular](https://angular.io) and [webpack](https://webpack.js.org). Therefore you have to run the [webpack web dev server](https://webpack.js.org/configuration/dev-server/). It's a server application that builds the website and watches the file system. Whenever you make a change to a file, the server runs the build process and reloads the website automatically. It only tries to compile the files that have changed and in some cases, can even reload the style sheets without reloading the site.

#### How to run the Webpack Dev Server?

```
cd frontend # Go to the frontend
npm i # Install all dependencies, only needed the first time
npm start
```

{% hint style="info" %}
Installing the dependencies is only needed once or when the `project.json` file has changed.
{% endhint %}

Optionally:

1. `npm rebuild node-sass --force` (Only if you have issues with node-sass)
2. `npm test` (Runs the unit tests and listens for changes)
3. `npm run test:coverage` (Runs the unit tests and calculates the test coverage).

As the name _Webpack Dev Server_ indicates, it's only used for development. For production we bundle and minimise all typescript, html and sass files and add the bundles to the deployment package. During development, the frontend downloads hundreds of files, this is a completely normal process.

### Backend

```bash
cd backend
cd src/Squidex
dotnet restore # Install all dependencies
dotnet run
```

Ensure that the `ASPNETCORE_ENVIRONMENT` environment variable is set to `Development`, either through the `launchSettings.json` file or through your IDE's settings.

Open [https://localhost:5001](https://localhost:5001) to run Squidex.

You can also run and debug the backend with Visual Studio 2019. Here are some **recommended** steps you should undertake before starting your debug session:

1. Ensure that you run the `Squidex` project, which means that you use the integrated Kestrel web server (this begins faster than IIS Express).
2. Uncheck the `Launch browser` setting. You just want to keep Squidex open during development (and not constantly close and open the window) to make debugging the frontend with your browser easier.
