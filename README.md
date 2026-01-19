# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Setup Instructions

1. Go to your repository settings on GitHub
2. Navigate to **Pages** under **Code and automation**
3. Under **Build and deployment**, set:
   - Source: **GitHub Actions**
4. Push changes to the `main` branch to trigger the deployment

The site will be available at: `https://<username>.github.io/studio/`

### How it Works

- The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys the app
- Next.js is configured with `output: 'export'` for static site generation
- The `basePath: '/studio'` ensures assets load correctly under the repository path
- The `.nojekyll` file prevents GitHub Pages from processing files with Jekyll
