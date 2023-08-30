

## Initial Setup

### Configure AWS CLI

If you're using the Pluralsight sandbox, you'll first need to configure your AWS CLI. Open your terminal and run:

```bash
aws configure --profile pluralsight-sandbox
```

and follow the prompts.

### Edit scripts/setenv.sh

Edit the ROOT_DIR in setenv.sh to represent the root directory of the project.

## Deploy the stacks:
Navigate to scripts dir
```bash
cd scripts
```

then 

```bash
. ./deploy.sh
```

This will create an ECR repo, build and push the apache and liferay images to it, then deploy an ecs cluster running those images.