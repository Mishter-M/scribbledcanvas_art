#!/bin/bash

# Script to inject API endpoint into HTML files after CloudFormation deployment
# This ensures the frontend knows how to connect to the backend API

set -e

echo "🔧 Injecting API endpoint into HTML files..."

# Get the API endpoint from CloudFormation stack outputs
STACK_NAME="${STACK_NAME:-artforge-portfolio-prod}"
echo "📡 Getting API endpoint from CloudFormation stack: $STACK_NAME"

API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`ContentManagementAPI`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -z "$API_ENDPOINT" ]; then
    echo "⚠️  Warning: Could not retrieve API endpoint from CloudFormation stack"
    echo "    Using placeholder endpoint. API integration will not work until deployment is complete."
    API_ENDPOINT="https://placeholder-api-endpoint.com"
else
    echo "✅ API endpoint found: $API_ENDPOINT"
fi

# Function to inject API endpoint into HTML file
inject_api_endpoint() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "⚠️  File not found: $file"
        return 1
    fi
    
    echo "📝 Injecting API endpoint into: $file"
    
    # Create a temporary file with the API endpoint injected
    # Look for the closing </head> tag and insert our meta tag before it
    sed "s|</head>|  <meta name=\"api-endpoint\" content=\"${API_ENDPOINT}\" />\n  </head>|g" "$file" > "$temp_file"
    
    # Replace original file if sed was successful
    if [ $? -eq 0 ]; then
        mv "$temp_file" "$file"
        echo "✅ Successfully injected API endpoint into $file"
    else
        echo "❌ Failed to inject API endpoint into $file"
        rm -f "$temp_file"
        return 1
    fi
}

# Inject API endpoint into all HTML files in the out directory
if [ -d "out" ]; then
    echo "📂 Processing HTML files in out/ directory..."
    
    # Find all HTML files and inject the API endpoint
    find out -name "*.html" -type f | while read -r html_file; do
        inject_api_endpoint "$html_file"
    done
    
    echo "🎉 API endpoint injection completed!"
    echo "🔗 API Endpoint: $API_ENDPOINT"
else
    echo "❌ Error: out/ directory not found. Make sure to run 'npm run build' first."
    exit 1
fi

# Also create a file with the API endpoint for reference
echo "$API_ENDPOINT" > out/api-endpoint.txt
echo "📄 API endpoint saved to out/api-endpoint.txt"

echo "✨ Setup complete! The frontend will now connect to the backend API."
