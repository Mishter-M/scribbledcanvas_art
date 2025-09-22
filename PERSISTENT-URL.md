# Persistent CloudFront URL Configuration

This document explains how your ScribbledCanvas Art Portfolio maintains a persistent URL even when the CloudFormation stack is updated or redeployed.

## CloudFront Distribution Persistence

Your CloudFormation template is configured with:
- `DeletionPolicy: Retain` - Prevents CloudFront distribution deletion
- `UpdateReplacePolicy: Retain` - Preserves distribution during updates

## Admin Page Routing

The CloudFront distribution includes URL rewriting to properly handle admin page access:
- `https://your-domain.com/admin` → serves `/admin/index.html`
- `https://your-domain.com/admin/` → serves `/admin/index.html`
- Works with both custom domains and CloudFront domain names

## Getting Your Persistent URL

Run this command to get your current CloudFront URL:
```bash
./scripts/get-url.sh
```

This URL will remain stable across deployments and both the main site and admin page will work correctly.
