import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

interface Ec2Props {
    readonly environment: string;
    readonly project: string;
    readonly vpc: ec2.Vpc;
    readonly securityGroup: ec2.SecurityGroup;
}
export default class Ec2 extends Construct {

    public readonly instance: ec2.Instance;

    constructor(scope: Construct, id: string, props: Ec2Props) {
        super(scope, id);


        const roleec2 = new iam.Role(this, "Ec2Role", {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),

            ],
            description: 'Role for EC2 instance to access SSM',
        });


        this.instance = new ec2.Instance(this, "Ec2Instance", {
            vpc: props.vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            securityGroup: props.securityGroup,
            vpcSubnets: props.vpc.selectSubnets({
                subnetType: ec2.SubnetType.PUBLIC, // Use public subnets
            }),
            role: roleec2,
            requireImdsv2: true,
            associatePublicIpAddress: true, // Ensure the instance has a public IP
        });

    }
}
