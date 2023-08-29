#!/bin/zsh

# Set env vars
source ./setenv.sh

cd "$ROOT_DIR"

echo "Starting cdk bootstrap..."
cdk bootstrap

echo "Deploying ECR stack..."
cdk deploy ECRStack --require-approval never

echo "Build/push apache image to ECR..."
source "$ROOT_DIR"/scripts/pushApacheImage.sh

echo "Build/push liferay image to ECR..."
source "$ROOT_DIR"/scripts/pushLiferayImage.sh

cd "$ROOT_DIR"

echo "Deploying ECS stack..."
cdk deploy LiferayEcsDemoStack --require-approval never

echo "Deployment complete!"
