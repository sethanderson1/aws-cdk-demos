#!/bin/zsh

source ./setenv.sh

cd $ROOT_DIR

echo "Starting cdk bootstrap..."
cdk bootstrap

echo "Deploying ECR stack..."
cdk deploy ECRStack --require-approval never
