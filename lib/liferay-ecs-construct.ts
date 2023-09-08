import * as cdk from 'aws-cdk-lib';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2"; // Import for the VPC
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2"; // Import ELBv2 module
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface LiferayEcsProps {
  image: ecs.ContainerImage;
  dbHost: string;
  dbSecret: secretsmanager.ISecret; 
  vpc: ec2.IVpc; 
}

export class LiferayEcs extends Construct {
  public readonly loadBalancerDnsName: string;

  constructor(scope: Construct, id: string, props: LiferayEcsProps) {
    super(scope, id);

    // Create ECS service using the provided image
    const service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      "LiferayCeApp",
      {
        vpc: props.vpc,
        cpu: 4096,
        desiredCount: 1,
        memoryLimitMiB: 8192,
        taskImageOptions: {
          image: props.image,
          containerPort: 8080,
          containerName: "Liferay",
          enableLogging: true,
          environment: {
            DB_HOST: props.dbHost,
          },
          secrets: {
            DB_USERNAME: ecs.Secret.fromSecretsManager(props.dbSecret, 'username'),
            DB_PASSWORD: ecs.Secret.fromSecretsManager(props.dbSecret, 'password')
          },
        },
        publicLoadBalancer: false,
      }
    );

    this.loadBalancerDnsName = service.loadBalancer.loadBalancerDnsName;

    // Accessing the created target group
    const targetGroup = service.targetGroup as elbv2.ApplicationTargetGroup;

    // Modifying the target group's health check settings
    targetGroup.configureHealthCheck({
      port: "8080", // Aligning with the container's port
      healthyHttpCodes: "200", // Success codes
      healthyThresholdCount: 2, // Healthy threshold
      unhealthyThresholdCount: 5, // Unhealthy threshold
      timeout: cdk.Duration.seconds(30), // Timeout
      interval: cdk.Duration.seconds(40) // Interval
    });

  }
}
