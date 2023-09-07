import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

import { Construct } from "constructs";

export class MyCdkRdsAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new VPC (or use an existing one)
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3,
    });

    // Create Security Group with inbound rule for port 3306
    const securityGroup = new ec2.SecurityGroup(this, 'MyRdsSecurityGroup', {
      vpc,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3306));

    // Create a secret to store the RDS credentials
    const secret = new secretsmanager.Secret(this, 'MyRdsSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: 'admin',
        }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
      },
    });

    // Create the RDS instance
    new rds.DatabaseInstance(this, 'MyRdsInstance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,
      }),
      credentials: rds.Credentials.fromSecret(secret), // Use the secret for credentials
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [securityGroup], // Add the security group
      publiclyAccessible: true, // Allow public access
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });
  }
}
