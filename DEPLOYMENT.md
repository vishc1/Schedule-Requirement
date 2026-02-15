# Deployment Checklist for Vercel

## Pre-Deployment Checklist

### ✅ Local Testing
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` to verify the project builds successfully
- [ ] Run `npm run dev` and test all features locally
- [ ] Test image upload with sample course planning sheet
- [ ] Verify 4-year planner works and saves to localStorage
- [ ] Check duplicate detection is working
- [ ] Test all three views (Overview, Planner, By Category)

### ✅ Environment Variables
- [ ] Have your OpenAI API key ready (starts with `sk-`)
- [ ] Verify API key has sufficient credits (~$5 minimum recommended)
- [ ] Test API key works locally with `.env.local` file

### ✅ Git Repository
- [ ] All changes committed: `git status` should show clean
- [ ] Pushed to GitHub/GitLab/Bitbucket: `git push origin main`
- [ ] Repository is accessible (public or connected to Vercel)

### ✅ Code Quality
- [ ] No TypeScript errors: `npm run build` passes
- [ ] No console errors in browser
- [ ] All components render correctly
- [ ] Mobile responsive design works

## Deployment Steps

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub, GitLab, or email
- Free tier is sufficient for this project

### 2. Import Project
- Click "Add New..." → "Project"
- Select your Git provider (GitHub recommended)
- Choose your repository: `Schedule-Requirement` or similar
- Vercel auto-detects Next.js - no configuration needed

### 3. Configure Environment Variables
**Critical:** Set these before first deployment

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `OPENAI_API_KEY` | `sk-...` | Get from [OpenAI Platform](https://platform.openai.com/api-keys) |

Add to all environments: Production, Preview, Development

### 4. Deploy
- Click "Deploy" button
- Wait 1-2 minutes for build
- Check deployment logs for any errors

### 5. Verify Deployment
- [ ] Visit your deployed URL (`your-project.vercel.app`)
- [ ] Test image upload functionality
- [ ] Verify requirements tracking displays correctly
- [ ] Check 4-year planner saves and loads
- [ ] Test duplicate detection
- [ ] Try printing a schedule
- [ ] Test on mobile device

## Post-Deployment

### Optional: Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., `lynbrook-credits.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic, ~5 minutes)

### Monitoring
- **Vercel Dashboard:** Monitor deployments and performance
- **OpenAI Dashboard:** Track API usage and costs
- **Analytics:** Enable Vercel Analytics for traffic insights (optional)

## Automatic Updates

After initial deployment:
- Every `git push` to `main` deploys to production automatically
- Pull requests create preview deployments
- Rollback available in Vercel dashboard if issues occur

## Troubleshooting Deployment

### Build Fails
```bash
# Test locally first
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variable Issues
- Double-check variable name is exactly: `OPENAI_API_KEY`
- Verify API key doesn't have extra spaces
- Redeploy after adding environment variables

### API Errors in Production
- Check OpenAI API key is active and has credits
- Verify API key permissions include GPT-4o-mini
- Check Vercel function logs for error messages

## Cost Management

### Estimated Monthly Costs (for ~100 users)
- **Vercel Hosting:** $0 (Free tier: 100GB bandwidth)
- **OpenAI API:** $5-20 (depends on usage)
  - ~$0.01 per image upload
  - ~500-2000 uploads per month = $5-20

### Free Tier Limits
- **Vercel:** 100GB bandwidth, unlimited deployments
- **OpenAI:** Pay-as-you-go, no monthly fee

### Monitoring Usage
1. **Vercel:** Project → Analytics → Usage
2. **OpenAI:** [Platform Dashboard](https://platform.openai.com/usage) → Usage

## Security Notes

- ✅ API key stored securely in Vercel environment variables
- ✅ Never commit `.env` files to Git (already in `.gitignore`)
- ✅ Rate limiting handled by Vercel edge functions
- ✅ HTTPS enabled by default on Vercel

## Support

If deployment issues persist:
1. Check [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Contact Vercel Support (free tier has community support)

---

**Last Updated:** February 2026
