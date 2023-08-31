import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from "constructs";

export class ApacheEcs extends Construct {
  constructor(scope: Construct, id: string, image: ecs.ContainerImage, proxyPassHost: string) {
    super(scope, id);

    // Create ECS service using the provided image
    const service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      "ApacheWebServer",
      {
        cpu: 256,
        desiredCount: 1,
        memoryLimitMiB: 512,
        taskImageOptions: {
          image: image,
          containerPort: 80,
          containerName: "Apache",
          enableLogging: true,
          environment: {
            PROXY_PASS_HOST: proxyPassHost
          }
        },
        circuitBreaker: {
          rollback: true,
        },
        publicLoadBalancer: true,
      }
    );
    // Uncomment below if useing ECR instead of Docker Hub
    // // Create a policy statement
    // const policyStatement = new iam.PolicyStatement({
    //   actions: [
    //     "ecr:GetDownloadUrlForLayer",
    //     "ecr:BatchCheckLayerAvailability",
    //     "ecr:GetAuthorizationToken",
    //   ],
    //   resources: ["*"], // Adjust this to limit to specific resources if needed
    // });

    // // Add the policy statement to the execution role
    // service.taskDefinition.executionRole?.addToPrincipalPolicy(policyStatement);
  }
}
