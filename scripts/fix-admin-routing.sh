#!/bin/bash

# Script to fix admin page routing for static export
# This creates the necessary files for CloudFront to serve admin page correctly

echo "Creating admin routing files..."

# Create 404 and 403 error pages
echo "Creating error pages..."
cat > out/404.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Page Not Found - ScribbledCanvas Art</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #1a1a1a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffd700;
        }
        .container { text-align: center; padding: 2rem; }
        .back-button {
            background: linear-gradient(45deg, #ffd700, #ffb347);
            color: #000;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 700;
            text-decoration: none;
            display: inline-block;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" class="back-button">← Back to Portfolio</a>
    </div>
</body>
</html>
EOF

cat > out/403.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Access Forbidden - ScribbledCanvas Art</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #1a1a1a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffd700;
        }
        .container { text-align: center; padding: 2rem; }
        .back-button {
            background: linear-gradient(45deg, #ffd700, #ffb347);
            color: #000;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 700;
            text-decoration: none;
            display: inline-block;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>403 - Access Forbidden</h1>
        <p>You don't have permission to access this resource.</p>
        <a href="/" class="back-button">← Back to Portfolio</a>
    </div>
</body>
</html>
EOF

# Create a direct copy of admin/index.html as admin file (no extension)  
# This allows CloudFront to serve /admin directly
if [ -f "out/admin/index.html" ]; then
    echo "Creating direct admin page for /admin path..."
    
    # Create a file named 'admin' (no extension) with the admin page content
    cp out/admin/index.html out/admin-direct
    
    # Also ensure the admin.html redirect works
    echo "- out/admin-direct (for direct /admin access)"
    echo "- out/admin.html (redirect page)"
    echo "- out/admin/index.html (for /admin/ access)"
fi

# Create user-friendly admin.html that provides clear navigation
cat > out/admin.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Admin Access - ScribbledCanvas Art</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #1a1a1a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffd700;
        }
        .container {
            text-align: center;
            background: rgba(255, 215, 0, 0.05);
            backdrop-filter: blur(20px);
            padding: 3rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            max-width: 500px;
            margin: 20px;
        }
        .admin-button {
            background: linear-gradient(45deg, #ffd700, #ffb347);
            color: #000000;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            margin: 1rem 0;
        }
        .admin-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
        }
        .redirect-info {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 12px;
            font-size: 0.9rem;
            color: rgba(255, 215, 0, 0.7);
        }
    </style>
    <script>
        // Auto-redirect after 3 seconds
        setTimeout(function() {
            window.location.href = './admin/';
        }, 3000);
    </script>
</head>
<body>
    <div class="container">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
        <h1 style="margin-bottom: 1rem; font-weight: 700;">Admin Dashboard</h1>
        <p style="color: rgba(255, 215, 0, 0.7); margin-bottom: 2rem; line-height: 1.6;">
            Access your portfolio management dashboard to add, edit, and organize your artwork.
        </p>
        <a href="./admin/" class="admin-button">
            🔑 Enter Admin Dashboard
        </a>
        <div class="redirect-info">
            <p><strong>Auto-redirecting in 3 seconds...</strong></p>
            <p>Or click the button above to access the admin panel immediately.</p>
        </div>
    </div>
</body>
</html>
EOF

echo "Admin routing fix applied successfully!"
echo "Files created:"
ls -la out/admin*
