---
Description: >-
  Learn how to quickly deploy Squidex (with MongoDB) on Google Cloud Platform using Cloud Run & MongoDB Atlas.
---

# Deploy Squidex on Google Cloud Platform using Cloud Run, Cloud Storage & MongoDB Atlas

This version of the installation tutorial deploys Squidex as a container on [Cloud Run](https://cloud.google.com/run/) in Google Cloud Platform. The approach is PaaS or Managed service.

The tutorial does not cover the basics of GCP. You should be familiar with them before you begin with the installation instructions. It uses the following services from GCP:
* [Google Cloud Storage](https://cloud.google.com/storage)
* [Google Cloud Run](https://cloud.google.com/run/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/mongodb-google-cloud) running on Google Cloud

This tutorial runs MongoDB in a free tier mode is recommended for non-production or trial environments. For production environments it is recommended to go for the Pay-as-you-go model available at the Google Cloud [marketplace](https://console.cloud.google.com/marketplace/product/mongodb/mdb-atlas-self-service).

Use this tutorial as a getting started guide in GCP to explore Squidex or use it as a Dev/Sandbox environment. This setup may not be recommended for a production environment. 

## Pre-requisites

Before you begin, ensure you meet the following requirements:

1. An active Google Cloud account.
2. A _Project_ in GCP

## Deployment Specifications & Other Details

Over the course of this installation you will create the following resources:
* A Cloud Storage bucket
* A Cloud Run instance
* And a free MongoDB Atlas cluster at [https://cloud.mongodb.com/](https://cloud.mongodb.com/)

**Important Details**
  * Default resource allocations
    * Squidex instance: **1 vCPU and 1.5 GiB memory**
  * 

## 1. Create MongoDB Atlas Cluster

1. Visit [MongoDB Atlas on Google Cloud](https://www.mongodb.com/cloud/atlas/mongodb-google-cloud) and click **Start Free** (1).

![Create MongoDB Step 1](/images/started/gcp/2022-10-20_07-33.png)

2. Register by clicking **Sign up with Google** (2) and sign-in using your existing Google Cloud credentials. This is the fastest way to register.

![Create MongoDB Step 2](/images/started/gcp/2022-10-20_07-37.png)

3. On successful registration and login you will be redirected to cloud.mongodb.com portal _Projects_ page.
4. Start by creating a project. Click **New Project** (3).

![Create MongoDB Step 3](/images/started/gcp/2022-10-20_07-46.png)

5. Provide a project name such as _Squidex_ (4) and click **Next** (5) to continue.

![Create MongoDB Step 4](/images/started/gcp/2022-10-20_07-51.png)

6. Finish project creation by clicking **Create Project** (6).

![Create MongoDB Step 5](/images/started/gcp/2022-10-20_07-53.png)

7. Next step is to create the MongoDB database. Click **Build a Database** (7) to start.

![Create MongoDB Step 6](/images/started/gcp/2022-10-20_07-56.png)

8. Select **Create** under _Shared_ which provides 1 free cluster.

![Create MongoDB Step 7](/images/started/gcp/2022-10-20_07-58.png)

9. Ensure again that **Free Shared** (9) option is selected, click **Google Cloud** (10), select a region of choice (11) and click **Create Cluster** (12).

![Create MongoDB Step 8](/images/started/gcp/2022-10-20_08-31.png)

10. In the next step, set Security details. Enter a Username (13) and Password (14) of choice (or click Autogenerate Secure Password to get one generated). Click **Create User** (15).

![Create MongoDB Step 10](/images/started/gcp/2022-10-20_08-12.png)

11. Finally, add network access permissions so Squidex can talk to it. Ensure **My Local Environment** (16) is selected, enter 0.0.0.0/0 (17) for IP Address and any Description (18). Click **Add Entry** (19).

![Create MongoDB Step 11](/images/started/gcp/2022-10-20_08-15.png)

12. Click **Finish and Close**. This will redirect you to the Database Deployments page similar to the screenshot below.

![Create MongoDB Step 12](/images/started/gcp/2022-10-20_12-45.png)

13. You will need the connection information for this MongoDB for use in the app configuration later. To copy the connection string click **Connect** (20) and then select **Connect your application** (21).

![Create MongoDB Step 13](/images/started/gcp/2022-10-20_12-41.png)

14. Select C#/.NET (22) & 2.13 or later (23), copy the connection string (24) and click **Close** (24)

![Create MongoDB Step 14](/images/started/gcp/2022-10-20_12-44.png)

This completes creating the free MongoDB Atlas cluster.

## 2. Upload Squidex image to Artifact Registry

The following steps require ![gcloud CLI](https://cloud.google.com/sdk/docs/install) which can be installed on your development machine or you can use the Cloud Shell. The later is preferred for convenience. To launch Cloud Shell click ![Cloud Shell icon](/images/started/gcp/2022-10-20_18-24.png) on the google cloud web console next to the search bar.

Run the following commands in sequence to create an Artifact Registry, download the latest Squidex from dockerhub and push it to Artifact Registry.

```
gcloud services enable artifactregistry.googleapis.com
```
```
export ARTIFACT_REGISTRY_NAME=squidex
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1
```
```
gcloud artifacts repositories create $ARTIFACT_REGISTRY_NAME --repository-format=docker --location=$REGION
```
```
docker pull squidex/squidex:latest
```
```
gcloud auth configure-docker $REGION-docker.pkg.dev
```
```
docker tag squidex/squidex:latest $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REGISTRY_NAME/squidex:latest
```
```
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REGISTRY_NAME/squidex:latest
```

## 3. Create Storage Bucket

Follow the steps below to create a Cloud Storage bucket for Squidex assets.

1. Sign into Google Cloud Console and navigate to Cloud Storage page.
2. Select **Buckets** (1) (should be already selected) and click **+ Create** (2).

![Create Bucket Step 2](/images/started/gcp/2022-10-20_00-32.png)

3. Enter a unique name (3) for the bucket and click **Create** (4). You can leave the rest of the settings as it is or feel free to modify them as per needs.

![Create Bucket Step 3](/images/started/gcp/2022-10-20_00-49.png)

4. You may be prompted with a message. Click **Confirm** (5).

![Create Bucket Step 4](/images/started/gcp/2022-10-20_00-52.png)

You will be taken to the bucket page. This completes the storage bucket creation step.


## 4. Create & Configure Cloud Run instance

1. Navigate to Cloud Run page in Google Cloud. Click **+ Create Service** (1) to begin.

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-21.png)

2. Click **Select** (2), choose **Artifact Registry** tab and select (3) the Squidex image added earlier. Click **Select** (4) to continue.

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-24.png)

3. A Service name (5) is already assigned, modify this if needed. Set **Minimum number of instance** to _1_ and **Maximum number of instance** to _1_ (6).

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-29.png)

4. Scroll down and select **Allow all traffic** (7) and **Allow unauthenticated invocations** (8). Then expand (9) the _Containers, Connections, Security_ section. 

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-31.png)

5. Set **Container port** to _5000_ (10) and set Memory to _1_ and CPU to _1_ (11).

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-34.png)

6. Finally we set the environment variables. Click **+Add Variable** (12) and set the following environment variables (13) one by one replacing the values with your actual values where applicable, click **Create** (14) when done.

| Key                                        | Value                                               | Notes                              |
| ------------------------------------------ | --------------------------------------------------- | ---------------------------------- |
| `[ASSETSTORE__TYPE]`                       | GoogleCloud                                         | Do not change this value           |
| `[ASSETSTORE__GOOGLECLOUD__BUCKET]`        | _[STORAGE BUCKET NAME]_                             | Provide your own value             |
| `[EVENTSTORE__MONGODB__CONFIGURATION]`     | _[MONGODB CONNECTION STRING]_                       | Provide your own value             |
| `[STORE__MONGODB__CONFIGURATION]`          | _[MONGODB CONNECTION STRING]_                       | Provide your own value             |
| `[ASPNETCORE_URLS]`                        | http://+:5000                                       | Do not change this value           |

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-42.png)

7. Wait until the deployment is complete and you have sucessful notification with a green check. Copy the URL (15) and click **Edit & Deploy New Version** (16). 

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-52.png)

8. Add a new environment variable by clicking **+Add Variable** (17) and then adding the following (18). Click **Deploy** (19) when done.

| Key                                        | Value                                               | Notes                              |
| ------------------------------------------ | --------------------------------------------------- | ---------------------------------- |
| `[URLS__BASEURL]`                          | _[CLOUD RUN URL]_                                   | Provide your own value             |

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_13-56.png)

9. This should deploy a new revision of the Cloud Run and update the Base URL value in the app.

![Create Cloud Run Step 1](/images/started/gcp/2022-10-20_16-45.png)

10. You can now open the URL in a browser and continue with Squidex setup.
