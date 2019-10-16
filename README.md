![Squidex Logo](images/logo-wide.png)

# Introduction

> A content management hub for all your data.

Squidex is a content management hub to manage all your content, for example:

* Dynamic elements for your mobile apps.
* Blog posts and articles for your website.
* Configuration data for your backend.
* Rich and structured data for your application.

# Getting started

What do you want to do?

### I want to start immediately by using the Squidex Cloud

Learn how to create your first app in our [User Guide](01-getting-started/guide/_guide.md)

### I want to install Squidex on my own (virtual) machines

Follow our [installation instructions](01-getting-started/installation/_installation.md).

### I want to contribute as a developer or understand the architecture

Learn how to help to make Squidex even better in our [Contributors Introduction](01-getting-started/contributing/_contributing.md)

## How does it work?

The core of Squidex is a web service. It provides APIs to manage the structure of your content, languages, settings and of course the content itself. You can consume the content from your backend, mobile apps, website and other other client applications. Of course we also provide a rich user interface for end users (Management UI).

## Event Sourcing

We use event sourcing to store all information. Instead of just holding the actual state we generate events, whenever you make a change. For example when you update a content we create a ContentUpdatedEvent that holds the changed data. We never delete any data. When you delete a content element we just create a ContentDeletedEvent. This means you cannot lose any data and we have the full history of all changes. These events are also handled by event consumers which are responsible to create an optimized representation of your content which can be queried through the API.

## Custom content representation

We think it is impossible to develop a system that is able to handle every kind of queries in a fast and efficient way. You know best what technology you need for your business case. Think about sql database servers. You need to configure indices by yourself, because creating them automatically is a very hard problem. If you need your content in another representation or in another storage you can subscribe to the content events and push your content to another database, whenever it has changed. For example: If you build a travel portal you can manage your hotels in Squidex. To allow your users to search for hotels you can push the data to elastic search to make use of the full text search capabilities.

## Contact Us

You have the following options to contact us:

* Join our support forum: https://support.squidex.io
