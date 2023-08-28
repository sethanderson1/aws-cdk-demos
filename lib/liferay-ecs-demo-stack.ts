import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import { ApacheEcs } from "./apache-ecs-construct";
import { LiferayEcs } from "./liferay-ecs-construct";
import { Construct } from "constructs";

export class LiferayEcsDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the ECS apache container image from the docker hub repository
    const apacheImage = ecs.ContainerImage.fromRegistry('dockerwhale987/myrepo:apache2-basic1')
    // // Create the ECS liferay container image from the docker hub repository
    const liferayCeImage = ecs.ContainerImage.fromRegistry('dockerwhale987/myrepo:liferay-7.4.3.u88-with-all-hosts')

    // Create the ECS service using the apache container image
    new ApacheEcs(this, "ApacheEcsImage", apacheImage);
    // Create the ECS service using the liferay container image
    new LiferayEcs(this, "LiferayCeImage", liferayCeImage);
  }
}
