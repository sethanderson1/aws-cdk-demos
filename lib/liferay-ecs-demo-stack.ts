import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { ApacheEcs } from "./apache-ecs-construct";
import { LiferayEcs } from "./liferay-ecs-construct";
import { Construct } from "constructs";

export class LiferayEcsDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, "MyVpc", {});

    // Create a secret to store the RDS credentials
    const secret = new secretsmanager.Secret(this, "MyRdsSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: "admin",
        }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: "password",
      },
    });

    // Create a security group for RDS
    const rdsSecurityGroup = new ec2.SecurityGroup(this, "rds-security-group", {
      vpc,
      allowAllOutbound: true,
    });

    // Allow connections to RDS from ECS tasks
    rdsSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(3306)
    );

    // Create an RDS instance
    const rdsInstance = new rds.DatabaseInstance(this, "RDS", {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,
      }),
      credentials: rds.Credentials.fromSecret(secret), // Use the secret for credentials
      vpc,
      securityGroups: [rdsSecurityGroup],
    });

    // Get the RDS endpoint address
    const rdsEndpoint = rdsInstance.dbInstanceEndpointAddress;

    // // Create the ECS liferay container image from the docker hub repository
    const liferayCeImage = ecs.ContainerImage.fromRegistry(
      "dockerwhale987/liferay-ce:liferay-7.4.3.u88-dynamic-mysql"
    );
    // Create the ECS apache container image from the docker hub repository
    const apacheImage = ecs.ContainerImage.fromRegistry(
      "dockerwhale987/apache:2-with-dynamic-proxypass"
    );

    // Create the ECS service using the liferay container image
    const liferayService = new LiferayEcs(this, "LiferayCeImage", {
      image: liferayCeImage,
      dbHost: rdsEndpoint,
      dbSecret: secret,
      vpc,
    });

    // Create the ECS service using the apache container image
    new ApacheEcs(this, "ApacheEcsImage", {
      image: apacheImage,
      proxyPassHost: liferayService.loadBalancerDnsName,
      vpc,
    });
  }
}
