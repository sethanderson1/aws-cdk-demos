import * as cdk from "aws-cdk-lib";
import { ECRStack } from "../lib/ecr-stack";
import { LiferayEcsDemoStack } from "../lib/liferay-ecs-demo-stack";

const app = new cdk.App();
new ECRStack(app, "ECRStack");
new LiferayEcsDemoStack(app, "LiferayEcsDemoStack");
