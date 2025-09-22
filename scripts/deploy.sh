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

# Clean up previous AWS resources
print_status "Checking for existing CloudFormation stack to delete..."
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION &> /dev/null; then
  print_status "Deleting existing stack $STACK_NAME..."
  aws cloudformation delete-stack --stack-name $STACK_NAME --region $AWS_REGION
  aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME --region $AWS_REGION
  print_success "Previous CloudFormation stack deleted."
else
  print_warning "No existing CloudFormation stack found, skipping deletion."
fi

print_status "Cleaning up S3 bucket contents if bucket exists..."
print_status "Deleting all object versions and delete markers..."

# Clean up website bucket
WEBSITE_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-website"
ARTWORK_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-artwork"

for BUCKET_NAME in "$WEBSITE_BUCKET" "$ARTWORK_BUCKET"; do
  print_status "Cleaning bucket: $BUCKET_NAME"
  
  # Check if bucket exists first
  if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    print_status "Bucket $BUCKET_NAME exists, cleaning..."
    
    # Delete all object versions
    VERSIONS=$(aws s3api list-object-versions --bucket "$BUCKET_NAME" --query 'Versions[].{Key:Key,VersionId:VersionId}' --output json 2>/dev/null || echo "[]")
    if [ "$VERSIONS" != "[]" ] && [ "$VERSIONS" != "null" ] && [ -n "$VERSIONS" ]; then
      echo "$VERSIONS" > /tmp/delete-versions.json
      aws s3api delete-objects --bucket "$BUCKET_NAME" --delete file:///tmp/delete-versions.json
    fi
    
    # Delete all delete markers
    MARKERS=$(aws s3api list-object-versions --bucket "$BUCKET_NAME" --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' --output json 2>/dev/null || echo "[]")
    if [ "$MARKERS" != "[]" ] && [ "$MARKERS" != "null" ] && [ -n "$MARKERS" ]; then
      echo "$MARKERS" > /tmp/delete-markers.json
      aws s3api delete-objects --bucket "$BUCKET_NAME" --delete file:///tmp/delete-markers.json
    fi
    
    # Remove any remaining objects
    aws s3 rm "s3://$BUCKET_NAME" --recursive 2>/dev/null || true
    
    print_success "Bucket $BUCKET_NAME cleaned successfully"
  else
    print_status "Bucket $BUCKET_NAME does not exist, skipping cleanup"
  fi
done

# Clean up temp files
rm -f /tmp/delete-versions.json /tmp/delete-markers.json

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
AWS_REGION=$AWS_REGION
AWS_S3_BUCKET=$WEBSITE_BUCKET
AWS_CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID
EOF

# Build and export static site using updated environment variables
print_status "Building the project..."
npm run build
print_status "Exporting static site..."
npm run export

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
