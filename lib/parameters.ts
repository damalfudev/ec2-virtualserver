import { Construct } from 'constructs';
import { CfnParameter } from 'aws-cdk-lib';

export default class Parameters extends Construct {
    public readonly environment: string;
    public readonly project: string;



    constructor(scope: Construct, id: string) {
        super(scope, id);

        const environmentParam = new CfnParameter(this, 'Environment', {
            type: 'String',
            description: 'The environment for the deployment (e.g., dev, prod)',
            default: process.env.ENV,
        });

        const projectParam = new CfnParameter(this, 'Project', {
            type: 'String',
            description: 'The name of the project',
            default: process.env.PROJECT
        });

        this.environment = environmentParam.valueAsString;
        this.project = projectParam.valueAsString;
    }
}