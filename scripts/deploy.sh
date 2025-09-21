#!/bin/bash

# ARTFORGE Portfolio - AWS Deployment Script
set -e

# Configuration
PROJECT_NAME="artforge-portfolio"
ENVIRONMENT="prod"
AWS_REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install it first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install it first."
    exit 1
fi

print_status "Starting ARTFORGE Portfolio deployment..."

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the project
print_status "Building the project..."
npm run build

# Deploy CloudFormation stack
print_status "Deploying AWS infrastructure..."
STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}"

aws cloudformation deploy \
    --template-file aws/cloudformation-template.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        ProjectName=$PROJECT_NAME \
        Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION

if [ $? -ne 0 ]; then
    print_error "CloudFormation deployment failed!"
    exit 1
fi

print_success "Infrastructure deployed successfully!"

# Get stack outputs
print_status "Retrieving stack outputs..."
WEBSITE_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
    --output text \
    --region $AWS_REGION)

CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region $AWS_REGION)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text \
    --region $AWS_REGION)

API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
    --output text \
    --region $AWS_REGION)

# Upload website files to S3
print_status "Uploading website files to S3..."
aws s3 sync out/ s3://$WEBSITE_BUCKET --delete --region $AWS_REGION

if [ $? -ne 0 ]; then
    print_error "S3 upload failed!"
    exit 1
fi

print_success "Website files uploaded successfully!"

# Invalidate CloudFront cache
print_status "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --region $AWS_REGION

if [ $? -ne 0 ]; then
    print_warning "CloudFront invalidation failed, but deployment was successful"
fi

# Create environment file for frontend
print_status "Creating environment configuration..."
cat > .env.local << EOF
NEXT_PUBLIC_API_ENDPOINT=$API_ENDPOINT
NEXT_PUBLIC_AWS_REGION=$AWS_REGION
AWS_S3_BUCKET=$WEBSITE_BUCKET
AWS_CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID
EOF

print_success "Environment configuration created!"

# Print deployment summary
echo ""
echo "=========================================="
echo "🚀 ARTFORGE Portfolio Deployment Complete!"
echo "=========================================="
echo ""
print_success "Website URL: $WEBSITE_URL"
print_success "API Endpoint: $API_ENDPOINT"
print_success "S3 Bucket: $WEBSITE_BUCKET"
print_success "CloudFront Distribution ID: $CLOUDFRONT_DISTRIBUTION_ID"
echo ""
print_status "Your digital art portfolio is now live! 🎨"
echo ""

# Check website status
print_status "Checking website status..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $WEBSITE_URL)
if [ $HTTP_STATUS -eq 200 ]; then
    print_success "Website is accessible and responding!"
else
    print_warning "Website returned HTTP $HTTP_STATUS. It may take a few minutes to propagate."
fi

print_status "Deployment completed successfully! 🎉"
