#!/bin/bash

# Script to fix admin page routing for static export
# This creates the necessary files for CloudFront to serve admin page correctly

echo "Creating admin routing files..."

# Create admin.html that redirects to admin/
cat > out/admin.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=./admin/">
    <script>
        window.location.href = './admin/';
    </script>
</head>
<body>
    <p>Redirecting to admin page...</p>
</body>
</html>
EOF

echo "Admin routing fix applied successfully!"
echo "Files created:"
echo "- out/admin.html (redirects /admin to /admin/)"
ls -la out/admin*
