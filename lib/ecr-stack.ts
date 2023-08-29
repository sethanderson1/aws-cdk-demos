import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class ECRStack extends cdk.Stack {
  public readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repoName = process.env.REPO_NAME || "default-repo-name";

    this.repository = new ecr.Repository(this, "DemoRepo", {
      repositoryName: repoName,
      lifecycleRules: [
        {
          maxImageAge: cdk.Duration.days(30),
        },
      ],
    });

    this.repository.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken",
        ],
        principals: [new iam.ServicePrincipal("ecs-tasks.amazonaws.com")],
      })
    );
  }
}
