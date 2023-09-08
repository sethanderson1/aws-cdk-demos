#!/bin/bash

# Set env vars
. ./setenv.sh

cd "$ROOT_DIR"

# echo "Starting cdk bootstrap..."
# cdk bootstrap

echo "Deploying ECS stack..."
cdk deploy LiferayEcsDemoStack --require-approval never

echo "Deployment complete!"
