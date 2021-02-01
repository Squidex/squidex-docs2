---
description: >-
  Workflows define the different statuses of a content item from the initial
  status to the Published status , when the content item is available in the
  public API.
---

# Workflows

## Introduction

This documentation is based on the common Use Case. Please follow the link and open it side by side to this page to understand the examples.

{% page-ref page="../introduction-and-use-case.md" %}

## What is a Workflow?

A workflow defines the different statuses of a content item from the initial status to the Published status. Workflows are typically used when contributors work together to create and publish content items and when the contributors have different roles, such as Writer, Reviewer and Publisher. They are very flexible and you can have an unlimited number of workflows per App.

### Terms

A content workflow is represented as a [graph](https://en.wikipedia.org/wiki/Graph_%28discrete_mathematics%29) of statuses \(nodes\) that are connected with transitions \(edges\). The **status** of a content item is defined by the workflow that is configured for the content schema.

* A **status** is a unique name that represents the status of your content item and has a color to identify them in the user interface.
* A **transition** defines the next possible statuses of your content item. A transition defines the next status and can have an optional expression and roles.

Workflows do not exist in older Squidex installations, but you can implement them with scripting.

{% page-ref page="../developer-guides/workflows.md" %}

## How to create a workflow

Do the following steps to create a new workflow

1. Go to your App.
2. Go to the app settings.
3. Go to the workflow settings of your App.
4. Enter a new name for your workflow. This name is only used in this screen and can be changed later.
5. Just press the button to create a new workflow with a default setup.

![How to create a new workflow](../../.gitbook/assets/image%20%2844%29.png)

Typically your list of workflows is empty, which means that the default workflow is applied to all your schemas. The default workflow has the same structure as the new workflow that you just created. If a schemas has no matching workflow, this default workflow is also applied.

#### The default workflow

If you go to the Visualize \(1\) tab you see a graphical representation of your workflow:

![The default workflow.](../../.gitbook/assets/image%20%2823%29.png)

* **\(2\)  Draft** is the initial status for each content item. The initial status is visualized by an arrow. From Draft you can either move a content item to "Published" or to "Archived".
* **\(3\) Archived** is a status that is used to mark deleted content items without actually deleting them. It is a soft delete. Archived content items cannot be updated. From "Archived" you cannot go to "Published" immediately, you always have to go to "Draft" first.
* **\(4\) Published** is a special status that cannot be removed. Only content items where the status is set to "Published" are available in the normal API. If you do not need a workflow at all you can delete all other statuses.

## How to edit a workflow

Hopefully the user interface is good enough that you do not need detailed instructions. But there are some special cases that needs explanation.

### Change the initial status

The initial status is indicated with a small arrow icon \(1\). You can change this when you move the mouse over a status. Then the same arrow icon will pop up, which can be clicked to set the status.

![](../../.gitbook/assets/image%20%2826%29.png)

### Change the color of a status

The steps of colors can be changed. Just click to the colored circle next to each step to change the color.

![Change the color of a status](../../.gitbook/assets/image%20%2833%29.png)

### Restrict transitions with Roles

You can assign one or more roles to a transition. When a role is assigned only contributors that have the correct role can move a content item to the target status that is defined by this transition. When no role is assigned all contributors can do that. This is restricted by permissions, so when a user has cannot update content items at all, the workflow does not change that.

Lets have a look to the following example:

![A Use Case with a review status](../../.gitbook/assets/image%20%2827%29.png)

Please note that the screenshot has been modified and some UI elements have been removed to make it more compact.

In our use case we have described three user groups:

1. **Editors** write content. When they are done, they move content item to the **Ready** status. They cannot review or publish content items.
2. **Reviewers** review content items, when they are ready. They either move the content item to **Reviewed**, when the review process is successful or back to "Draft" otherwise.
3. **Publisher** publish reviewed content items by moving these content items to "Published"**.**

This workflow can be extended even more and multiple review steps can be implemented.

{% hint style="info" %}
Workflows can be combined with Permissions to restrict who can create content items.
{% endhint %}

### Restrict transitions with Expressions

You can write an Javascript expression. This expressions is evaluated each time a content is updated to evaluate whether a transitions to another status is possible.

For example you have a schema for different kind of editorial content items such as articles, blog posts an news. This type of the item is defined a by a string field.

In this case we extend the example from the previous section where we use Roles.

![Workflow Expressions](../../.gitbook/assets/image%20%2842%29.png)

A content item where the type field is set to **News** does not need a review and can be published directly. Articles need the review process and the previous rules will be applied.

When you design the Expression you have only access to the content data which is directly part of the content. For example when you have a relationship, only the IDs of the referenced items are stored in the content and not the content of the references itself.

The data has the same structure as it is also used for queries and for the API.

```javascript
{
    "data": {
        // More fields
        "type": {
            "iv": "News"
        }
    }
}
```

The structure has been explained in detail the use case:

{% page-ref page="../introduction-and-use-case.md" %}

### Assign a workflow to schemas

Workflows can be assigned to schemas. If no schema is assigned, this workflow handles all schemas where no other workflow is assigned for. Other schemas, that have no assigned workflow have an implicit default workflow with.

![Assigned schemas](../../.gitbook/assets/image%20%2845%29.png)

You have to pay attention that you do not assign the same schema to multiple workflows. This can happen when you have multiple workflows that have no assigned schemas 

![Multiple workflows with no schemas assigned](../../.gitbook/assets/image%20%2824%29.png)

or when multiple workflows have the same schema assigned.

![Multiple workflows for the same schema](../../.gitbook/assets/image%20%2825%29.png)

In both cases you get a warning which should be resolved. You can save workflows and create and update content items as normal but it is not defined which workflow is used when a content item is updated. It can even change over time and the behavior is unpredictable.

### Prevent Updates

You can prevent updates when a content item has a certain status. You can also define an optional Expression or Roles to restrict the updates only in some cases or for a subset of your contributors.

![Prevent updates](../../.gitbook/assets/image%20%2846%29.png)

In the default workflow this is used to make "Archived" content items read-only, but you can also use this feature to prevent updates in the review process.

