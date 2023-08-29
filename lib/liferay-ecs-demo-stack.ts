import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { ApacheEcs } from "./apache-ecs-construct";
import { LiferayEcs } from "./liferay-ecs-construct";
import { Construct } from "constructs";

export class LiferayEcsDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repoName = process.env.REPO_NAME || "default-repo-name";

    // Define the ECR repository by name
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "LiferayceEcsStack",
      repoName
    );

    // Create the ECS apache container image from the ECR repository
    const apacheImage = ecs.ContainerImage.fromEcrRepository(repository, "apache2");
    // Create the ECS liferay container image from the ECR repository
    const liferayCeImage = ecs.ContainerImage.fromEcrRepository(repository, "liferay-ce-7.4.3.u88");

    // Create the ECS service using the apache container image
    new ApacheEcs(this, "ApacheEcsImage", apacheImage);
    // Create the ECS service using the liferay container image
    new LiferayEcs(this, "LiferayCeImage", liferayCeImage);
  }
}
