import * as cdk from 'aws-cdk-lib';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2"; // Import ELBv2 module
import { Construct } from "constructs";

export interface ApacheEcsProps {
  image: ecs.ContainerImage;
  proxyPassHost: string;
  vpc: ec2.IVpc;
}

export class ApacheEcs extends Construct {
  constructor(scope: Construct, id: string, props: ApacheEcsProps) {
    super(scope, id);

    // Create ECS service using the provided image
    const service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      "ApacheWebServer",
      {
        vpc: props.vpc,
        cpu: 256,
        desiredCount: 1,
        memoryLimitMiB: 512,
        taskImageOptions: {
          image: props.image,
          containerPort: 80,
          containerName: "Apache",
          enableLogging: true,
          environment: {
            PROXY_PASS_HOST: props.proxyPassHost,
          },
        },
        circuitBreaker: {
          rollback: true,
        },
        publicLoadBalancer: true,
      }
    );

    // Accessing the created target group
  const targetGroup = service.targetGroup as elbv2.ApplicationTargetGroup;

  // Modifying the target group's health check settings
  targetGroup.configureHealthCheck({
    port: "80", // Aligning with the container's port
    healthyHttpCodes: "200", // Success codes
    healthyThresholdCount: 2, // Healthy threshold
    unhealthyThresholdCount: 5, // Unhealthy threshold
    timeout: cdk.Duration.seconds(30), // Timeout
    interval: cdk.Duration.seconds(40) // Interval
  });

  }
}
