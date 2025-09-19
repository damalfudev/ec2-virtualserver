import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import Ec2 from './ec2';
import Network from './network';
import Parameters from './parameters';

export class Ec2ProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const parameters = new Parameters(this, 'Parameters');


    const network = new Network(this, "Network", {
      environment: parameters.environment,
      project: parameters.project,
    });

    new Ec2(this, "Ec2", {
      environment: parameters.environment,
      project: parameters.project,
      vpc: network.vpc,
      securityGroup: network.securityGroup,
    });
  }
}