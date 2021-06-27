---
description: Install on Heroku
---

# Install on Heroku

## 1. Use the 1-click deploy button

[![Deploy to Heroku](https://img.shields.io/badge/-Deploy%20to%20Heroku-430098?style=for-the-badge&logo=heroku&logoColor=ffffff)](https://heroku.com/deploy?template=https://github.com/Squidex/squidex)

## 2. Fill in the details

Make sure to fill in the `App name` field with something unique, and then fill the `DOMAIN` variable with the external domain you wish your Squidex instance to be available on.

You can ignore `MONGO_USERNAME` and `MONGO_PASSWORD` for now.

![Fill Details](../../../.gitbook/assets/heroku-2.png)

When you are done, click `Deploy App`.

## 3. Wait for the deployment to complete

![Deployment Started](../../../.gitbook/assets/heroku-3-1.png)

![Deployment Finished](../../../.gitbook/assets/heroku-3-2.png)

When it's finished, click `Manage app`.

## 4. Create MongoDB database and credentials

On the Dashboard, click `ObjectRocket for MongoDB`.

![Open ObjectRocket Dashboard](../../../.gitbook/assets/heroku-4-1.png)

On the ObjectRocket Dashboard, click `DATABASES` and then `Add Database`.

![Open Databases](../../../.gitbook/assets/heroku-4-2.png)

Enter the database name (must be `squidex`), the username and the password. Keep note of those, as you will be needing them for the next step.

![Create Database](../../../.gitbook/assets/heroku-4-3.png)

## 5. Fill in the database credentials

Back at the Heroku Dashboard, click `Settings`, then click `Reveal Config Vars`.

![Settings](../../../.gitbook/assets/heroku-5-1.png)

Fill the fields `MONGO_USERNAME` and `MONGO_PASSWORD` with the same credentials you provided in the previous step.

![Config Vars](../../../.gitbook/assets/heroku-5-2.png)

You should then be ready to go!

## Troubleshooting

Please check the logs by clicking `More`, and then `View logs`.

![Logs](../../../.gitbook/assets/heroku-troubleshooting.png)

### Restart dynos

In case the deployment gets stuck, go to the top right of the dashboard, click `More` and then `Restart all dynos`.

### More issues?

It is very likely a configuration problem and not related to hosting under Docker. Checkout

{% page-ref page="../configuration.md" %}

