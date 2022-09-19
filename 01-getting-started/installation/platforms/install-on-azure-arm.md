---
Description: >-
  Learn how to quickly deploy Squidex (with MongoDB & Caddy) on Azure using Azure Container Instances Group.
---

# Deploy to Azure on Container Instances using ARM template

This version of the installation tutorial deploys Squidex along with MongoDB (for datastore) and Caddy (for reverse proxy along with SSL) as a [Container Group](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-container-groups) in Azure using an [Azure Resource Manager or ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) template. The approach is called Infrastructure as Code.

The tutorial does not cover the basics of Azure. You should be familiar with them before you begin with the installation instructions. 

This tutorial runs MongoDB as a single container and is recommended for non-production or trial environments. For production environments it is recommended to use one of the MongoDB Atlas (or Enterprise) offerings from [Azure marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=mongodb&page=1), which provides capabilities such as High Availability.

Use this tutorial as a getting started guide in Azure to explore Squidex and use it as a Dev/Sandbox environment. This setup may not be recommended for a production environment. 

## Pre-requisites

Before you begin, ensure you meet the following requirements:

1. An active Azure subscription.
2. The following providers registered in your Azure subscription:
   * Microsoft.ContainerInstance
   * Microsoft.Storage 

## Deployment Specifications & Other Details

The ARM template creates the following Azure resources:
* An Azure Storage Account
  * Azure Container
  * Azure Share
* Azure Container Instances (Group)
  * Squidex Web App Container (latest image)
  * MongoDB Container (latest image)
  * Caddy container (latest image)

**Important Details**
  * Default resource allocations
    * Squidex container: **1 vCPU and 1.5 GiB memory**
    * MongoDB container: **2 vCPU and 2 GiB memory**
    * Caddy container: **1 vCPU and 1.5 GiB memory**
  * Squidex and MongoDB containers remain private and are not exposed to public.
  * Squidex talks to MongoDB without authentication (mongodb://localhost:27017). Since MongoDB is private it cannot be accessed from outside, hence secure to an extent. **With the current setup you cannot connect using an external client like MongoDB Compass. You can however connect from Azure Container Instance, click [here](#connecting-to-mongodb-instance) for instructions**
  * Caddy reverse proxies to the Squidex Web App container.
  * An FQDN is provided by Azure Container Instance, _Caddy_ provides SSL for this as the FQDN does not come with SSL. This FQDN is set as the `URLS__BASEURL` and `VIRTUAL_HOST` for Squidex configuration.

**NOTE: A future version of this template will support bringing your own domain and other customizations.**

## 1. Launch the ARM Template

Simply click **Deploy to Azure** button to load the template in Azure Portal, fill in a few details (instructions below) and deploy Squidex.

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fsangramrath%2Fsquidex-docs2%2Fmaster%2Fscripts%2Fsquidex-minimal-azure-arm.json)

## 2. Configure Details

On the Custom deployment page complete the following steps to submit the deployment.

1. Select your **Subscription** from the list.
2. Select an existing **Resource group** or click **Create new** to create a new Resource group.
   * If creating a new Resource group, enter a name and click Ok.
3. Select your preferred **Region** from the list.
4. Enter a name for the Container Group in **Container Name** field. (It uses the Resource Group name by default but you are free to change it)
5. Click **Review + create**.

![Deploy ARM Template](../../../images/started/azure/squidex-arm-01.png)

6. Ensure that the _validation_ is successful.
7. Click **Create** to submit the deployment.

![Review ARM Template](../../../images/started/azure/squidex-arm-02.png)

The deployment process will take a few minutes.

## 3. Access Squidex

1. Click **Outputs** (8) in the deployment page to retrieve the URL.
2. Copy the URL (9).

![Deployment Complete](../../../images/started/azure/squidex-arm-03.png)

3. Open the URL in a browser to load the _Squidex Installation Page_.

**It may take a few minutes before the certificates are generated and the URL starts working**

5. Create the Admin User to complete the installation and login to Squidex.

## Azure Troubleshooting

1. Validation failed

   * Ensure all the fields have been populated. 
   * If you are rerunning the ARM template (either another installation or due to a previous failure) and using the same names, change them (or delete previously created resources).

2. Deployment failed

In the Microsoft template deployment window click _Deployment failed. Click here for more details_ to view the error details and look for clues. This tutorial does not go into the details of Azure troubleshooting.

**NOTE: Use _Redeploy_ to resubmit the deployment again (after fixing errors). This continues the operation instead of creating a fresh deployment.**

3. Containers in _waiting_, _failed_ or _terminated_ status. 

   * Restart the Azure Container Instance

![Deployment Complete](../../../images/started/azure/squidex-aci-restart-01.png)

## Squidex Issues
It is very likely a configuration problem and not related to Azure. Please visit the following page:&#x20;

[Configuration](./configuration.md)

## Connecting to MongoDB instance

1. On the Azure Portal, navigate to Container Instances page
2. Click on your Container Instance (e.g. squidex-crm)
3. Select _Containers_ from the left navigation menu
4. Select the MongoDB container (i.e. etc-squidex-assets-mongodb) by clicking on it
5. Select the _Connect_ tab
6. Ensure _/bin/bash_ is selected
7. Click _Connect_ again

![Connect to MongoDB ACI](../../../images/started/azure/squidex-mongodb-connect-aci-01.png)

This will drop you into the Container Shell. Type **mongosh** to connect to MongoDB shell.
