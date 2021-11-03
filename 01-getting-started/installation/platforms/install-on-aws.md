---
description: Install on AWS
---

# Install on AWS

## 1. Use the AWS Marketplace Image

[![Deploy on AWS](https://img.shields.io/badge/-Deploy%20to%20AWS-232F3E?style=for-the-badge\&logo=amazon-aws\&logoColor=ffffff)](https://aws.amazon.com/marketplace/pp/prodview-zvohj6i2bye7w)

## 2. Subscribe

Squidex is free, but you still need to subscribe to the Amazon Marketplace listing.

In the listing page, click **Continue to Subscribe** (1).

![Subscribe](../../../.gitbook/assets/aws-2-1.png)

Read the EULA and accept the terms by clicking **Accept Terms** (1).

![Accept EULA](../../../.gitbook/assets/aws-2-2.png)

Wait until AWS process your subscription.

![Process Subscription](../../../.gitbook/assets/aws-2-3.png)

Once that is ready, click **Continue to Configuration** (1).

![Continue to Configuration](../../../.gitbook/assets/aws-2-4.png)

## 3. Instance Configuration

Pick an **architecture** (1), a **software version** (2) and a **region** (3), then click **Continue to Launch** (4).

![Software Configuration](../../../.gitbook/assets/aws-3-1.png)

This will take you to the configuration of the EC2 instance to be launched.

Pick the **EC2 Instance Type** (1). We recommend at least a **m5.large**.

![Instance Type](../../../.gitbook/assets/aws-3-2.png)

Select the **VPC**, **Subnet**, **Security Group** and **Key Pair**, and then click **Launch**.

![Network Config](../../../.gitbook/assets/aws-3-3.png)

Once the instance is launched, go to the **EC2 Console** (1).

![EC2 Console](../../../.gitbook/assets/aws-3-4.png)

## 4. Connect

Once the instance is ready, take it's **Public IP** (1) and connect to it using SSH and the key pair you selected previously.

![Public IP](../../../.gitbook/assets/aws-4-1.png)

```bash
ssh -i path/to/keypair.pem ubuntu@[PUBLIC IP]
```

Once you are logged in, run the setup command and follow the on-screen instructions.

```bash
/opt/squidex/setup-squidex.sh
```

You will be asked to enter the domain here. All other values are optional. The installation script will start docker-compose then and download all images and start them in the right order.

After you make sure the domain you configured is pointing to the public IP of your instance and that the DNS changes propagated, go to [https://your\_domain.com](https://your\_domain.com) and you should be ready to go.

For further help, go to [Configuration](https://docs.squidex.io/01-getting-started/installation/configuration).

## Troubleshooting

It is very likely a configuration problem and not related to hosting under Docker. Checkout

{% content-ref url="../configuration.md" %}
[configuration.md](../configuration.md)
{% endcontent-ref %}
