# Persistent CloudFront URL Configuration

This document explains how your ScribbledCanvas Art Portfolio maintains a persistent URL even when the CloudFormation stack is updated or redeployed.

## CloudFront Distribution Persistence

Your CloudFormation template is configured with:
- `DeletionPolicy: Retain` - Prevents CloudFront distribution deletion
- `UpdateReplacePolicy: Retain` - Preserves distribution during updates

## Admin Page Access

The admin page maintains full portfolio management functionality:

### Access Methods:
- **Direct Admin Dashboard**: `https://your-domain.com/admin/` 
- **Admin Landing Page**: `https://your-domain.com/admin` (redirects to dashboard)

### Admin Capabilities Preserved:
- ✅ **Full React Application**: Complete admin dashboard with all components
- ✅ **Portfolio Management**: Add, edit, delete artwork entries
- ✅ **Image Upload**: Upload and manage artwork images  
- ✅ **User Authentication**: Secure login system
- ✅ **Real-time Updates**: Dynamic content management
- ✅ **AWS Integration**: Connected to S3, DynamoDB, and Lambda functions

### Demo Credentials:
- **Admin**: admin@scribbledcanvas.com / admin123
- **Editor**: editor@scribbledcanvas.com / editor123

## Getting Your Persistent URL

Run this command to get your current CloudFront URL:
```bash
./scripts/get-url.sh
```

This URL will remain stable across deployments and both the main site and admin page will work correctly.
