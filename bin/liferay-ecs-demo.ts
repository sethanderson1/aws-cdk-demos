import * as cdk from "aws-cdk-lib";
import { MyCdkRdsAppStack } from "../lib/rds-app-stack";

const app = new cdk.App();
new MyCdkRdsAppStack(app, "MyCdkRdsAppStack");
