# 🔗 Persistent CloudFront URL

Your ARTFORGE Portfolio now uses a **persistent CloudFront URL** that stays the same across all deployments!

## 🌐 How It Works

- **CloudFront Distribution**: Protected with `DeletionPolicy: Retain`
- **Persistent URL**: Same `https://d123abc.cloudfront.net` URL every time
- **Zero Downtime**: Updates happen without changing the URL
- **Automatic Reuse**: New deployments automatically use the existing distribution

## 🚀 Usage

### Get Your Current URL
```bash
bash scripts/get-url.sh
```

### Deploy (URL stays the same)
```bash
bash scripts/deploy.sh
# OR via GitHub Actions (automatic on push to main)
```

### Check Status
```bash
# Via GitHub Actions
# Go to: https://github.com/Mishter-M/scribbledcanvas_art/actions

# Via AWS Console
aws cloudformation describe-stacks --stack-name artforge-portfolio-prod --region us-east-1
```

## 🛡️ Benefits

✅ **Bookmarkable**: Users can bookmark your site without URL changes  
✅ **SEO Friendly**: Search engines see the same URL consistently  
✅ **Professional**: No random URLs changing on each deployment  
✅ **Zero Downtime**: Updates happen seamlessly behind the same URL  

## 📊 Deployment Flow

1. **First Deploy**: Creates new CloudFront distribution
2. **Subsequent Deploys**: Reuses existing distribution
3. **Stack Deletion**: CloudFront distribution survives (retained)
4. **Content Updates**: New content pushed to same URL

Your website URL is now permanent! 🎉
