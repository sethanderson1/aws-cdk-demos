#!/bin/bash

cd "$ROOT_DIR"

# Authenticate Docker to ECR
aws ecr get-login-password --region $REGION --profile $AWS_PROFILE | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build the Docker image
docker build -t $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/${REPO_NAME}:liferay-ce-7.4.3.u88 $ROOT_DIR/image/liferayCe

# Push the Docker image to ECR
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/${REPO_NAME}:liferay-ce-7.4.3.u88
