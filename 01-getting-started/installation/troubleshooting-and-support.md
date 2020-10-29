---
description: >-
  This page describes how to solve issues and how to leverage the support in the
  best way for everybody.
---

# Troubleshooting and Support

## Before you start

It is recommended to think twice whether you want to install Squidex on your own machines or if it would not be better to use the cloud. In general the cloud is cheaper if you take into account the time you spend for installation, maintenance and updates.

If you are sure that you want to install Squidex on your own machine, there are a few things that are essential:

1. Understand how to use logging in your environment. Especially if you are running Squidex with multiple instances it is crucial to aggregate all the logs into one stream, that can be searched and analyzed. Many cloud providers have very good solution for this. There are also free products like the ELK \(Elastic +, Kibana\) stack \([https://www.elastic.co/log-monitoring](https://www.elastic.co/log-monitoring)\).
2. Understand how to monitor your installation. Very often the logging infrastructure already provides a solution for this problem, but you can also use alternatives like statping \([https://github.com/statping/statping](https://github.com/statping/statping)\). We use this awesome tool as a [public status page](https://status.squidex.io/), but also have internal monitoring solutions.
3. In case you have a very complicated setup it is really recommended to have an APM \(Application Performance Monitoring\) in place to analyze performance issues. Squidex provides an integration to Datadog APM \([https://www.datadoghq.com/product/apm/](https://www.datadoghq.com/product/apm/)\) and Azure Application Insights.

The previous points are in prioritized order.

## I need help and support

If you do not have a paid support contract, the only option is the support forum: [https://support.squidex.io](https://support.squidex.io). In the past we also had other support channels like Github, Email and Slack but it took to much time to answer all the support requests. The only option to give good support for free is to do it over a single, public channel so that other users with the same problem can search the forum. Therefore we also do not solve support issues via private messages. If you would like to use another channel you can purchase a support contract.

### How to ask for help

The support forum provides a template for support requests with placeholders for information that are needed to give support. It is very important to fill in these information. Most of the time we would ask for these information anyway and it just takes your time and our time if these information are not available from the beginning. If everything is prepared it usually takes very few hours only to solve the issue.

#### What do we ask?

1. **Information about your environment**: Very often problems are related to a specific environment, for example when the root cause is a networking issue in docker. Therefore this information is essential.
2. **Your browser**: This is very often needed when you issues with the user interface or authentication. It helps a lot to reproduce the issue.
3. **Squidex Versions**: Some issues are already known and have been fixed already. If you give use the Squidex installation from beginning, the issue can very often resolved much faster. If you do not know the Squidex version it is helpful to give us the exact date and time when you have installed Squidex. The version is available in the Squidex dashboard when you use docker.

Furthermore we need logs from your installation:

### Prepare server logs

We have developed Squidex and we know every line of code and have a lot of experience how our product behaves in different environments. But of course we have not tested every environment or cloud provider ourselves and not all issues are known. Otherwise we would have fixed them of course. Therefore your Squidex installation is like a black box for us and we can only guess what goes wrong.

This means that it is very important to get an insight about your installation via logs.

#### How to get logs

Squidex is logging everything to the standard output stream \(`stdout` \). This is a recommended pattern for cloud-ready applications and described in the 12-factors--app manifest: [https://12factor.net/logs](https://12factor.net/logs).

Most cloud providers redirect the standard output stream to a storage and make the logs available in their cloud portal. Please read the documentation from your cloud provider.

Here are also few hints how to retrieve logs:

* If you install Squidex under IIS in Windows you should read the following article from Microsoft: [https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/aspnet-core-module?view=aspnetcore-3.1\#log-creation-and-redirection](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/aspnet-core-module?view=aspnetcore-3.1#log-creation-and-redirection)
* If you use docker you should read the following article: [https://docs.docker.com/config/containers/logging/](https://docs.docker.com/config/containers/logging/). It also describes how to setup a log driver that can be used to redirect all logs to a centralized logging service.

#### Search in logs

Before you upload the logs, search for the `exception` keyword. Perhaps you already find the solution to your problem in the logs.

Sometimes the identity systems masks Personally Identifiable Information \(PII\) in the logs. If you see such a case in your log file and you think that relevant information are missing you can turn off this behavior with the following setting: [https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json\#L580](https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L580)

The environment variable for this setting is `IDENTITY__SHOWPII=true`. 

Read more about how to configure Squidex here:

{% page-ref page="configuration.md" %}

#### How to provide logs

Please provide the logs as an easy to read file. You can upload them to Dropbox, Google Drive or another file sharing offering and provide the link as a private message in the support forum.

If the logs are less than 10 MB you can just provide the full logs. Otherwise you can provide a subset of the logs around the timestamp when you have experienced the issue. The more logs you can provide the better. It can also be helpful to restart Squidex and to reproduce your issue and then collect the logs from this test. Then we get a full history from the time Squidex was started to the time you have reproduced the issue.

If you have a few lines only, you can add them to the post, but please ensure that the logs are formatted properly with code blocks.

{% hint style="info" %}
Do not insert long logs as a plain text or formatted code block to your topic. The topic becomes just hard to read and very often the logs are not complete.
{% endhint %}

### Prepare browser logs

Also check your browser console for errors. It is very likely that you are a software developer and frontend engineer so you probably know how to do that.

{% hint style="info" %}
Usually browser logs contain only a handful of useful log lines. Therefore you can post them directly in the support ticket as code block.
{% endhint %}

### Prepare a backup of your mongo database

Sometimes it is useful to have a backup of your database ready. Squidex provides its own backup tool but these backups are not useful for troubleshooting because the final result could differ from the state of your database.

Therefore use `mongodump` to create a backup: [https://docs.mongodb.com/database-tools/mongodump/\#mongodump-options](https://docs.mongodb.com/database-tools/mongodump/#mongodump-options)

1. Ensure that you have access to your mongo database. It might be necessary to open ports temporarily.
2. Create a backup of your mongo databases. Do not use the `archive`flag.
3. Create a ZIP-file of the generated dump folder and upload it to a online storage like Dropbox.
4. Ensure that the ZIP-archive can be downloaded as anonymous user.
5. Click the profile picture of the supporting developer in the support forum and send the link to the archive as private message.
6. Also provide the name of the app that causes the problems.

### What else?

Here are a few other things that are relevant:

1. If you have code examples or logs use code blocks to format them properly.
2. If you have relevant screenshots for UI problems you should also upload them. But do not upload screenshots for error messages because we cannot copy and paste them to search for the error message in our code or somewhere else.
3. Provides as many details as possible.

Please keep in mind that you are getting free support. Respect the time of everybody and prepare your support request properly. The more information you provide, the more likely it is that your issue can be resolved. It takes less time for all participants.

{% hint style="info" %}
If it is very obvious that an topic creator has not read this guidelines, we will just delete the topic. We just do not have the time to ask for logs over and over again.
{% endhint %}





