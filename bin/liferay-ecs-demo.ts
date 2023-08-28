import * as cdk from "aws-cdk-lib";
import { LiferayEcsDemoStack } from "../lib/liferay-ecs-demo-stack";

const app = new cdk.App();
new LiferayEcsDemoStack(app, "LiferayEcsDemoStack");
