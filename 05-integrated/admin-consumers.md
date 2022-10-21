Consumers are background processes that consume events and run updates based on the events.

The following consumers are implemented:

* **AppPermanentDeleter**: Deletes all assets, contents, schemas and rules and every other artifact that belongs to an app, when an app is deleted. You have to enable permanent deletion in the settings or via environment variables.
* **AssetUsageTracker**: Updates the table with usage data about the assets. Only relevant for Squidex Cloud.
* **HistoryService**: Creates the history items that you see in the right sidebar on the most screens. 
* **MongoSchemasHash**: Calculates a hash from all schemas of an app. This is used for efficient caching of GraphQL schemas.
* **NotificationEmailSender**: Sends invitation emails when a user has been added to an app or team as a contributor.
* **RecursiveDeleter**: Deletes all child folders or assets in an asset folder, when this asset folder has been deleted. Because the deletion creates new events, this is a recursive operation, which eventually deletes all the 
* **RuleEnqueuer**: Evaluates the rules and creates one or more jobs, when a trigger matchs to an event.
* **Subscriptions**: Sends an event to all active GraphQL subscriptions.
* **TextIndexer5**:  Updates the full text index whenever a content has been created, updated or deleted.