# 🚀 Vercel Deployment Guide for Siddhi Vinayak Steel

## Prerequisites
1. GitHub account
2. Vercel account
3. Domain: siddivinayakasteel.shop

## Step 1: GitHub Repository Setup
1. Create new repository on GitHub: `siddhi-vinayak-steel-website`
2. Upload all project files to repository
3. Commit and push changes

## Step 2: Vercel Project Setup
1. Go to vercel.com
2. Click "New Project"
3. Import from GitHub repository
4. Select your repository: `siddhi-vinayak-steel-website`

## Step 3: Environment Variables (IMPORTANT!)
Add these in Vercel Dashboard > Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://zplozjugevvsgxbbyhje.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbG96anVnZXZ2c2d4YmJ5aGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzE1OTIsImV4cCI6MjA3MzQ0NzU5Mn0.XIPl-A9VLM8F8-VVEnIYMWAoWjVDEegyRIo7E8hWE08
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbG96anVnZXZ2c2d4YmJ5aGplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzg3MTU5MiwiZXhwIjoyMDczNDQ3NTkyfQ.NRlDN9kOx2F8YxqPOnr2svJusfZZRVabRrX2u6ahHjw
RESEND_API_KEY=re_GSbmeLMo_Mae2brY8dm7BwAsDTTRaHNGH
```

## Step 4: Build Settings
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 18.x

## Step 5: Domain Configuration
1. Go to Vercel Dashboard > Domains
2. Add custom domain: `siddivinayakasteel.shop`
3. Add domain: `www.siddivinayakasteel.shop`

## Step 6: DNS Settings (Domain Provider)
Add these DNS records in your domain provider:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Step 7: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Test the live website

## Troubleshooting
- Check build logs for errors
- Verify environment variables
- Test API endpoints
- Check Supabase connection

## Support
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs