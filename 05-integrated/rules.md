Rules allow you to react to events in your app and to synchronize contents and assets with other systems.

A rule has two elements:

1. **Trigger**: Define when a rule is executed, for example when a content is created.

2. **Action**: Defines what will be executed when the rule is triggered.

Almost all text settings for actions support placeholder. At the moment the following placehold are supported:

* `$APP_ID`: The id of your app (guid).
* `$APP_NAME`: The name of your app.
* `$USER_ID`: The id of the user (or client name).
* `$USER_NAME`: The display name of the user (or client name).
* `$USER_EMAIL`: The email address of the user (or client name).
* `$TIMESTAMP_DATE`: The date when the event has happened (usually different from the time when the rule is executed) in the following format: `yyyy-MM-dd`.
* `$TIMESTAMP_DATETIME`; The date when the event has happened (usually different from the time when the rule is executed) in the following format: `yyyy-MM-dd-hh-mm-ss`.

For *ContentChangedTrigger*:

* `$SCHEMA_ID`: The id of the schema.
* `$SCHEMA_NAME`: The name of the schema.
* `$CONTENT_URL`: The url to the content in the administration tool.
* `$CONTENT_ACTION`: The content event (created, updated, deleted).

You can also use javascript expressions with 

    `Script('<MY-SCRIPT>')`

Squidex will make several attempts to execute an rule:

1. After a few seconds.
2. After 5 minutes
3. After 1 hour.
4. After 6 hours.
6. After 12 hours.

A rule execution will be treated as failed if it does not complete successfully within 2 seconds. If your target system is slow (e.g. a webhook) you should use a queue between Squidex and your application.

Rule executions will be stored as events for 2 days for debugging and will be deleted automatically.

Read more about rules in the [Documentation](../04-concepts/rules).

## Webhooks

Webhooks are the most flexible rule actions and define a custom HTTP endpoint that will be invoked by Squidex with a POST request.

### Request Headers

* `X-Application` and `User-Agent`

Used to identity the sender and has the static value: `Squidex Webhook`

* `X-Signature`

The signature can be used to verify that a request is from Squidex and not from a potential attacker. The signature is calculated in the following way: 

    ToBase64String(Sha256(RequestBody + Secret))

Do **not expose** the secret to the public and keep it private.

### Request Body

The request body has the following format (example):

```json
{
   "type":"GreetingsCreated",
   "payload":{
      "$type":"EnrichedContentEvent",
      "type":"Created",
      "id":"39885f2a-0393-4c8f-ae48-5add0de0b0ef",
      "created":"2019-05-07T17:27:55Z",
      "lastModified":"2019-05-07T17:27:55Z",
      "createdBy":"subject:5cc82941de5c0c5aa46c9f04",
      "lastModifiedBy":"subject:5cc82941de5c0c5aa46c9f04",
      "data":{
         "text":{
            "iv":"Hello Squidex"
         }
      },
      "status":"Draft",
      "schemaId":"d5ebc338-4ce7-4c9e-a9c1-6f41b2c0c854,greetings",
      "actor":"subject:5cc82941de5c0c5aa46c9f04",
      "appId":"4111766f-4ae5-4831-9ce6-e89b5eb530a8,test2",
      "timestamp":"2019-05-07T17:27:55Z",
      "name":"GreetingsCreated",
      "version":0
   },
   "timestamp":"2019-05-07T17:27:55Z"
}
```