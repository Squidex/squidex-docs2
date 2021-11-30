---
description: >-
  Rule actions are used to integrate external systems to Squidex. In this guide
  we will show you how to extend the rule system with custom actions.
---

# Custom rule action

In this guide we use the webhook action as an example to show you the basic principles.

## Step 1: Get ready

To get started with your first rule action you might want to get an understanding about the rule system first. Please read the following documentation before you continue:

{% content-ref url="../../../02-documentation/concepts/rules.md" %}
[rules.md](../../../02-documentation/concepts/rules.md)
{% endcontent-ref %}

## Step 2. Define your action class

In the first step we have to define an action class.

The action class has several purposes:

1. It provides general metadata, such as the name of the action.
2. It holds all configuration values for your rule action.
3. It is used to automatically create the editor that is used to create or edit an action.

Lets have a look to the `WebhookAction`

```csharp
[RuleAction(
    Title = "Webhook",
    IconImage = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'><path d='M5.95 27.125h-.262C1.75 26.425 0 23.187 0 20.3c0-2.713 1.575-5.688 5.075-6.563V9.712c0-.525.35-.875.875-.875s.875.35.875.875v4.725c0 .438-.35.787-.7.875-2.975.438-4.375 2.8-4.375 4.988s1.313 4.55 4.2 5.075h.175a.907.907 0 0 1 .7 1.05c-.088.438-.438.7-.875.7zM21.175 27.387c-2.8 0-5.775-1.662-6.65-5.075H9.712c-.525 0-.875-.35-.875-.875s.35-.875.875-.875h5.512c.438 0 .787.35.875.7.438 2.975 2.8 4.288 4.988 4.375 2.188 0 4.55-1.313 5.075-4.2v-.088a.908.908 0 0 1 1.05-.7.908.908 0 0 1 .7 1.05v.088c-.612 3.85-3.85 5.6-6.737 5.6zM21.525 18.55c-.525 0-.875-.35-.875-.875v-4.813c0-.438.35-.787.7-.875 2.975-.438 4.288-2.8 4.375-4.987 0-2.188-1.313-4.55-4.2-5.075h-.088c-.525-.175-.875-.613-.787-1.05s.525-.788 1.05-.7h.088c3.938.7 5.688 3.937 5.688 6.825 0 2.713-1.662 5.688-5.075 6.563v4.113c0 .438-.438.875-.875.875zM1.137 6.737H.962c-.438-.087-.788-.525-.7-.963v-.087c.7-3.938 3.85-5.688 6.737-5.688h.087c2.712 0 5.688 1.662 6.563 5.075h4.025c.525 0 .875.35.875.875s-.35.875-.875.875h-4.725c-.438 0-.788-.35-.875-.7-.438-2.975-2.8-4.288-4.988-4.375-2.188 0-4.55 1.313-5.075 4.2v.087c-.088.438-.438.7-.875.7z'/><path d='M7 10.588c-.875 0-1.837-.35-2.538-1.05a3.591 3.591 0 0 1 0-5.075C5.162 3.851 6.037 3.5 7 3.5s1.838.35 2.537 1.05c.7.7 1.05 1.575 1.05 2.537s-.35 1.837-1.05 2.538c-.7.612-1.575.963-2.537.963zM7 5.25c-.438 0-.875.175-1.225.525a1.795 1.795 0 0 0 2.538 2.538c.35-.35.525-.788.525-1.313s-.175-.875-.525-1.225S7.525 5.25 7 5.25zM21.088 23.887a3.65 3.65 0 0 1-2.537-1.05 3.591 3.591 0 0 1 0-5.075c.7-.7 1.575-1.05 2.537-1.05s1.838.35 2.537 1.05c.7.7 1.05 1.575 1.05 2.538s-.35 1.837-1.05 2.537c-.787.7-1.662 1.05-2.537 1.05zm0-5.337c-.525 0-.963.175-1.313.525a1.795 1.795 0 0 0 2.537 2.538c.35-.35.525-.788.525-1.313s-.175-.963-.525-1.313-.787-.438-1.225-.438zM20.387 10.588c-.875 0-1.837-.35-2.537-1.05S16.8 7.963 16.8 7.001s.35-1.837 1.05-2.538c.7-.612 1.662-.962 2.537-.962s1.838.35 2.538 1.05c1.4 1.4 1.4 3.675 0 5.075-.7.612-1.575.963-2.538.963zm0-5.338c-.525 0-.962.175-1.313.525s-.525.788-.525 1.313.175.962.525 1.313c.7.7 1.838.7 2.538 0s.7-1.838 0-2.538c-.263-.438-.7-.612-1.225-.612zM7.087 23.887c-.875 0-1.837-.35-2.538-1.05s-1.05-1.575-1.05-2.537.35-1.838 1.05-2.538c.7-.612 1.575-.962 2.538-.962s1.837.35 2.538 1.05c1.4 1.4 1.4 3.675 0 5.075-.7.612-1.575.962-2.538.962zm0-5.337c-.525 0-.962.175-1.313.525s-.525.788-.525 1.313.175.963.525 1.313a1.794 1.794 0 1 0 2.538-2.537c-.263-.438-.7-.612-1.225-.612z'/></svg>",
    IconColor = "#4bb958",
    Display = "Send webhook",
    Description = "Send events like ContentPublished to your webhook.",
    ReadMore = "https://en.wikipedia.org/wiki/Webhook")]
public sealed class WebhookAction : RuleAction
{
    [Required]
    [Display(Name = "Url", Description = "The url to the webhook.")]
    [DataType(DataType.Text)]
    [Formattable]
    public Uri Url { get; set; }

    [Display(Name = "Shared Secret", Description = "The shared secret that is used to calculate the signature.")]
    [DataType(DataType.Text)]
    public string SharedSecret { get; set; }

    [Display(Name = "Payload", Description = "The optional custom request payload.")]
    [DataType(DataType.MultilineText)]
    [Formattable]
    public string Payload { get; set; }
}
```

### Metadata

The metadata is provided with the `[RuleAction]` attribute and is mainly used in the Management UI.&#x20;

You have to provide the following information:

| Metadata        | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| (3) Title       | A title that describes which system is integrated.                                       |
| (1) Icon        | The icon as SVG document. Should be white only.                                          |
| (1) IconColor   | The background color for your icon.                                                      |
| (2) Display     | A display name that describes what your action does.                                     |
| (4) Description | A short description about your action                                                    |
| (5) ReadMore    | An optional link to additional information, e.g. the website of the integrated solution. |

![The metadata in the rule overview](<../../../.gitbook/assets/image (72) (1).png>)

![The metadata when selecting an action.](<../../../.gitbook/assets/image (74) (1).png>)

### Configuration values and editors

The properties of your action class hold the configuration values. You can only use primitives that can serialized to JSON, such as `string`, `bool` or `int`.

Each property can also have a...

#### Name (1)

An optional name that is shown as label.

```csharp
[Display(Name = "My Name")]
```

#### Description (4)

An optional description that is rendered after the input field.

```csharp
[Display(Description = "My Description.")]
```

#### Required Hint (3)

A hint that the property is required. This will add validation to the API and the Management UI.

```csharp
[Required]
```

#### Formattable Hint (2)

A hint that describes whether the property supports formatting via scripting or placeholders. More about this later.

```csharp
[Formattable]
```

![The formatting options in the UI](<../../../.gitbook/assets/image (70) (1).png>)

#### Data Type

An optional data type to define the HTML control that is used:

| Control        | When                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| Checkbox       | Used when the type of the property is `bool`or `bool?`.                               |
| Number Input   | Used when the type of the property is `int` or `int?`.                                |
| URL Input      | <p>Used with with the attribute</p><p><code>[Editor(RuleFieldEditor.Url)]</code>.</p> |
| Password Input | <p>Used with the attribute</p><p><code>[Editor(RuleFieldEditor.Password)]</code>.</p> |
| Email Input    | <p>Used with the attribute</p><p><code>[Editor(RuleFieldEditor.Email)]</code>.</p>    |
| Textarea       | <p>Used with the attribute</p><p><code>[Editor(RuleFieldEditor.TextArea)]</code>.</p> |
| Input          | For all other cases.                                                                  |

## Step 3: Develop your action handler.

As you know from the documentation about the rule system, the rules are executed in two steps:

1. The event is converted to a job that includes all formatted data.
2. The job is then executed.

We see this structure in the action handlers:

```csharp
public sealed class WebhookActionHandler :
    RuleActionHandler<WebhookAction, WebhookJob>
{
    public WebhookActionHandler(RuleEventFormatter formatter)
        : base(formatter)
    {
    }
    protected override (string Description, WebhookJob Data) 
        CreateJob(EnrichedEvent @event, WebhookAction action)
    {
       // Step 1: Create job.
    }
    protected override async Task<Result> 
        ExecuteJobAsync(WebhookJob job, CancellationToken ct = default)
    {
       // Step 2: Execute job
    }
}

public sealed class WebhookJob
{
    public string RequestUrl { get; set; }
    public string RequestBody { get; set; }
}
```

The `WebhookJob` contains all data that we want to store in the database and is a simplified version in this example.

### Create the Job

The first method we need to override is used to create the Job:

```csharp
protected override (string Description, WebhookJob Data) 
     CreateJob(EnrichedEvent @event, WebhookAction action)
{
    var requestUrl = Format(action.Url, @event);
    var ruleDescription = $"Send event to webhook '{requestUrl}'";
    var ruleJob = new WebhookJob
    {
        RequestUrl = Format(action.Url.ToString(), @event),
        RequestBody = Format(action.Payload, @event)
    };
    return (ruleDescription, ruleJob);
}
```

As you can see, we create the job from the passed in action and also provide a short description about what we do. \
\
We use the `Format` method to call the `RuleEventFormatter` that has been passed in via the constructor to apply formatting rules to our configuration values.&#x20;

Whenever we do this, we should add the `[Formattable]` attribute to the properties to point out this behavior to the end users.

### Execute the Job

The second method is used to execute the job. We do not have access to our original configuration values anymore, therefore it is important to add all required information to the job:

```csharp
protected override async Task<Result>
    ExecuteJobAsync(WebhookJob job, CancellationToken ct = default)
{
    try
    {
        await HTTP(job.RequestUrl, job.RequestBody, ct);
		
	return Result.Success("My Request Dump");
    }
    catch (Exception ex)
    {
        return Result.Failed(ex, "My Request Dump");
    }
}
```

In this case we make a HTTP call with the provided request URL and body. We have to return a result object to indicate whether our Job was successful or not.

Exceptions are always handled anyway, but we can use the approach above to provide an optional request dump with all necessary information to make debugging easy. Such a request dump should contain the request body and response or headers.&#x20;

The passed in cancellation token should be used to handle timeouts correctly and the cancel long running requests when they have exceeded the allowed execution limit.

## Step 4: Register the rule action

We are almost done, we just have to register our rule action. We write a custom plugin for that:

```csharp
public sealed class WebhookPlugin : IPlugin
{
    public void ConfigureServices(IServiceCollection services, IConfiguration config)
    {
        services.AddRuleAction<WebhookAction, WebhookActionHandler>();
    }
}
```

That's it.

If you have written a custom rule action for a public system, like an SaaS solution, you can provide your implementation as a pull request.
