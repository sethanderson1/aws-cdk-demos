import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2"; // Import ELBv2 module

import { Construct } from "constructs";

export class LiferayEcs extends Construct {
  constructor(scope: Construct, id: string, image: ecs.ContainerImage) {
    super(scope, id);

    // Create ECS service using the provided image
    const service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      "LiferayCeApp",
      {
        cpu: 4096,
        desiredCount: 1,
        memoryLimitMiB: 8192,
        taskImageOptions: {
          image: image,
          containerPort: 8080,
          containerName: "Liferay",
          enableLogging: true,
        },
        publicLoadBalancer: true,
      }
    );

    // Accessing the created target group
    const targetGroup = service.targetGroup as elbv2.ApplicationTargetGroup;

    // Modifying the target group's health check settings
    targetGroup.configureHealthCheck({
      port: "8080", // Aligning with the container's port
    });


    // Create a policy statement
    const policyStatement = new iam.PolicyStatement({
      actions: [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetAuthorizationToken",
      ],
      resources: ["*"], // Adjust this to limit to specific resources if needed
    });

    // Add the policy statement to the execution role
    service.taskDefinition.executionRole?.addToPrincipalPolicy(policyStatement);
  }
}
