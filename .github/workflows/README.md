# GitHub Actions Workflows

This directory contains automated workflows for the ANHD-NeuroFabric-Cognitive-Framework project.

## 📋 Available Workflows

### Deploy Next.js to GitHub Pages (`deploy-nextjs.yml`)

Automatically builds and deploys the NeuroFabric UI demo application to GitHub Pages.

**Triggers:**
- Push to `main` branch (when files in `demo/neurofabric-ui/` change)
- Manual trigger via GitHub Actions UI

**What it does:**
1. Checks out the repository
2. Sets up Node.js 20.x with npm caching
3. Installs dependencies
4. Builds the Next.js app as a static export
5. Deploys to GitHub Pages

## 🚀 Setup Instructions for GitHub Pages

To enable GitHub Pages deployment for the first time:

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/andy3520/ANHD-NeuroFabric-Cognitive-Framework`
2. Click on **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions** from the dropdown
5. Click **Save**

### Step 2: Configure Repository Permissions

The workflow requires specific permissions to deploy:

1. In **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests** (optional)
5. Click **Save**

### Step 3: Trigger the Workflow

The workflow will automatically run when you:
- Push changes to the `main` branch that affect files in `demo/neurofabric-ui/`

Or you can manually trigger it:
1. Go to the **Actions** tab
2. Click on **Deploy Next.js to GitHub Pages**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

### Step 4: Access Your Deployed Site

Once the workflow completes successfully:
- Your site will be available at: `https://andy3520.github.io/ANHD-NeuroFabric-Cognitive-Framework/`

## 📖 Understanding the Configuration

### Next.js Configuration (`demo/neurofabric-ui/next.config.ts`)

The Next.js app is configured for static export with:

```typescript
{
  output: 'export',                                    // Generate static HTML
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',  // Repository name path
  images: { unoptimized: true }                       // No server-side image optimization
}
```

**Why these settings?**
- `output: 'export'` - Creates static files that don't need a Node.js server
- `basePath` - GitHub Pages serves at `/repo-name/`, not root `/`
- `images.unoptimized` - GitHub Pages can't run the Next.js image optimization API

### Local Development

When developing locally, the site runs at `http://localhost:3000` (no basePath).

When deployed to GitHub Pages, it runs at `https://andy3520.github.io/ANHD-NeuroFabric-Cognitive-Framework/` (with basePath).

## 🔍 Monitoring Deployments

### View Workflow Runs

1. Go to the **Actions** tab in your repository
2. Click on a workflow run to see details
3. View logs for each step to debug issues

### Common Issues and Solutions

**Build fails with TypeScript errors:**
- Fix the errors locally first with `npm run build` in `demo/neurofabric-ui/`
- The workflow will fail if the build fails

**Site loads but assets are missing (404 errors):**
- Verify `basePath` in `next.config.ts` matches your repository name
- Check that `images.unoptimized: true` is set

**Deployment doesn't update:**
- Clear browser cache
- Check that workflow completed successfully in Actions tab
- Verify GitHub Pages source is set to "GitHub Actions"

**Workflow doesn't trigger:**
- Ensure changes are pushed to the `main` branch
- Check that modified files match the `paths` filter in the workflow

## 🛠️ Customization

### Change Deployment Branch

To deploy from a different branch, edit `.github/workflows/deploy-nextjs.yml`:

```yaml
on:
  push:
    branches:
      - main        # Change to your branch name
```

### Deploy on Every Push

Remove the `paths` filter to run on any change:

```yaml
on:
  push:
    branches:
      - main
    # Remove the paths section
```

### Add Environment Variables

To pass environment variables to the build:

```yaml
- name: Build Next.js application
  working-directory: ./demo/neurofabric-ui
  run: npm run build
  env:
    NEXT_PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}
    NEXT_PUBLIC_API_URL: https://api.example.com  # Add your vars here
```

## 📚 Learn More

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 💡 Tips

- **Caching**: The workflow caches npm dependencies to speed up builds
- **Manual Triggers**: Use `workflow_dispatch` to re-deploy without new commits
- **Concurrency**: Only one deployment runs at a time to prevent conflicts
- **Monitoring**: Check the Actions tab for real-time deployment status

## 🆘 Getting Help

If you encounter issues:
1. Check the workflow logs in the Actions tab
2. Verify all setup steps were completed
3. Review the troubleshooting section in `deploy-nextjs.yml`
4. Check GitHub Pages status at https://www.githubstatus.com/
