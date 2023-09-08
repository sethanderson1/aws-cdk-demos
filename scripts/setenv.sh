#!/bin/zsh

echo "Setting environment variables..."
export AWS_PROFILE="personal"
export REGION=$(aws configure get region --profile $AWS_PROFILE)
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile $AWS_PROFILE)
export REPO_NAME="demo-repo"
export ROOT_DIR="/home/sethlin/projects/aws-cdk/liferay-ecs-demo"
