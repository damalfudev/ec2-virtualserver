#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Ec2ProjectStack } from '../lib/ec2-project-stack';

const app = new cdk.App();
new Ec2ProjectStack(app, 'Ec2ProjectStack', {


  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },

  stackName: `${process.env.ENV}-${process.env.PROJECT}-stack`

});

//tag
cdk.Tags.of(app).add('env', process.env.ENV as string);
cdk.Tags.of(app).add('PROJECT', process.env.PROJECT as string);