# EC2 Virtual Server with AWS CDK

A complete AWS CDK TypeScript project that deploys an EC2 instance with VPC, security groups, and SSM access for remote management.

## Architecture

This project creates:
- **VPC** with public subnets across 2 availability zones
- **EC2 Instance** (t2.micro) with Amazon Linux 2
- **Security Group** allowing outbound traffic
- **IAM Role** with SSM managed instance core policy for remote access
- **Internet Gateway** and routing for public access

## Prerequisites

### 1. AWS Account and Credentials
You need an AWS account with programmatic access. Set up credentials using one of these methods:

#### Option A: AWS CLI Configuration (Recommended)
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
```
Enter your:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region (e.g., us-east-1)
- Default output format (json)

#### Option B: Environment Variables
```bash
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_DEFAULT_REGION=us-east-1
```

#### Option C: AWS Credentials File
Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your-access-key-id
aws_secret_access_key = your-secret-access-key

[default]
region = us-east-1
```

### 2. Required Software
- **Node.js** (v18 or later): [Download here](https://nodejs.org/)
- **AWS CDK CLI**: `npm install -g aws-cdk`

### 3. Verify Setup
```bash
# Test AWS credentials
aws sts get-caller-identity

# Check CDK version
cdk --version
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/damalfudev/ec2-virtualserver.git
   cd ec2-virtualserver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables** (optional)
   ```bash
   export ENV=dev
   export PROJECT=ec2-project
   ```

4. **Bootstrap CDK** (first time only)
   ```bash
   npx cdk bootstrap
   ```

5. **Deploy the stack**
   ```bash
   npx cdk deploy
   ```

## AWS Permissions Required

Your AWS user/role needs these minimum permissions:
- EC2 full access (or specific EC2 permissions)
- VPC management permissions
- IAM role creation and management
- CloudFormation stack operations
- Systems Manager permissions

For development, you can use the `PowerUserAccess` managed policy, or create a custom policy with specific permissions.

## Environment Variables

The project uses CloudFormation parameters with default values:

- `ENV`: Environment name (default: from process.env.ENV)
- `PROJECT`: Project name (default: from process.env.PROJECT)

## Project Structure

```
├── bin/
│   └── ec2-project.ts          # CDK app entry point
├── lib/
│   ├── ec2-project-stack.ts    # Main stack definition
│   ├── parameters.ts           # CloudFormation parameters
│   ├── network.ts              # VPC and networking resources
│   └── ec2.ts                  # EC2 instance and IAM role
├── package.json
├── cdk.json
└── README.md
```

## Key Features

- **SSM Access**: Connect to your EC2 instance without SSH keys using AWS Systems Manager Session Manager
- **Public IP**: Instance gets a public IP for internet access
- **Security**: IMDSv2 enforced, restrictive security groups
- **Cost Optimized**: Uses t2.micro instance (eligible for free tier)

## Accessing Your Instance

After deployment, you can connect to your instance using:

1. **AWS Systems Manager Session Manager** (recommended):
   ```bash
   aws ssm start-session --target i-your-instance-id
   ```

2. **EC2 Instance Connect** (if configured):
   - Use the AWS Console EC2 Instance Connect feature

## Useful Commands

- `npm run build`   - Compile TypeScript to JavaScript
- `npm run watch`   - Watch for changes and compile
- `npm run test`    - Run Jest unit tests
- `npx cdk deploy`  - Deploy the stack to AWS
- `npx cdk diff`    - Compare deployed stack with current state
- `npx cdk synth`   - Generate CloudFormation template
- `npx cdk destroy` - Delete the stack and all resources

## Customization

### Modify Instance Type
Edit `lib/ec2.ts`:
```typescript
instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL)
```

### Add Security Group Rules
Edit `lib/network.ts`:
```typescript
this.securityGroup.addIngressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(80),
  'Allow HTTP traffic'
);
```

### Change VPC Configuration
Edit `lib/network.ts` to modify CIDR blocks, subnets, or availability zones.

## Cost Considerations

- t2.micro instance is free tier eligible (750 hours/month)
- VPC, Internet Gateway, and Security Groups are free
- Data transfer charges may apply
- Remember to destroy resources when not needed: `npx cdk destroy`

## Security Best Practices

- Instance uses IMDSv2 (Instance Metadata Service v2)
- No SSH keys required (uses SSM for access)
- Security group allows only outbound traffic by default
- IAM role follows principle of least privilege

## Troubleshooting

### Deployment Issues
- **Credentials**: Ensure AWS credentials are configured: `aws sts get-caller-identity`
- **Bootstrap**: Check CDK bootstrap: `npx cdk bootstrap`
- **Region**: Verify region settings in your AWS CLI configuration
- **Permissions**: Ensure your AWS user has sufficient permissions

### Access Issues
- Ensure SSM agent is running (pre-installed on Amazon Linux 2)
- Check IAM permissions for your user to use SSM
- Verify instance has internet connectivity for SSM endpoints

### Common Errors
- `Unable to resolve AWS account`: Configure AWS credentials
- `Need to perform AWS CDK bootstrap`: Run `npx cdk bootstrap`
- `Access Denied`: Check IAM permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the deployment
5. Submit a pull request

## License

This project is open source and available under the MIT License.
