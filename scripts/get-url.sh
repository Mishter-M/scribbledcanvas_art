#!/bin/bash

# Get the persistent CloudFront URL for ARTFORGE Portfolio
set -e

# Configuration
STACK_NAME="artforge-portfolio-prod"
AWS_REGION="us-east-1"

echo "🔍 Getting your persistent website URL..."

# Get the CloudFront distribution URL
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text \
    --region $AWS_REGION 2>/dev/null || echo "")

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region $AWS_REGION 2>/dev/null || echo "")

if [ -n "$WEBSITE_URL" ] && [ "$WEBSITE_URL" != "" ]; then
    echo ""
    echo "🎨 ARTFORGE Portfolio URLs:"
    echo "=================================="
    echo "🌐 Website URL: $WEBSITE_URL"
    echo "🔗 CloudFront ID: $CLOUDFRONT_ID"
    echo "📱 Status: This URL will stay the same across all deployments!"
    echo ""
    echo "💡 Tip: Bookmark this URL - it's your permanent website address"
else
    echo "❌ No deployment found. Please deploy first:"
    echo "   bash scripts/deploy.sh"
fi
