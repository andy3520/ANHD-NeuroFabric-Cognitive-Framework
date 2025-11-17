import type { NextConfig } from "next";

// ============================================================================
// Next.js Configuration for GitHub Pages Deployment
// ============================================================================
//
// WHAT IS THIS FILE?
// This file configures how Next.js builds and runs your application.
// For GitHub Pages deployment, we need specific settings to generate
// a static site that can be hosted without a Node.js server.
//
// ============================================================================

const nextConfig: NextConfig = {
  // --------------------------------------------------------------------------
  // STATIC EXPORT CONFIGURATION
  // --------------------------------------------------------------------------
  // output: 'export' tells Next.js to generate a static site
  // This creates static HTML files that can be served by any web server
  // (including GitHub Pages) without needing a Node.js server
  output: 'export',

  // --------------------------------------------------------------------------
  // BASE PATH CONFIGURATION
  // --------------------------------------------------------------------------
  // GitHub Pages serves your site at: https://username.github.io/repo-name/
  // The basePath tells Next.js to prefix all routes and assets with "/repo-name"
  // 
  // For example:
  // - Without basePath: /about → https://username.github.io/about (404!)
  // - With basePath: /about → https://username.github.io/repo-name/about (works!)
  //
  // We use an environment variable so it works both locally and in production:
  // - Local dev: basePath is '' (empty), site works at http://localhost:3000
  // - GitHub Pages: basePath is '/repo-name', site works at the correct URL
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // --------------------------------------------------------------------------
  // IMAGE OPTIMIZATION
  // --------------------------------------------------------------------------
  // images.unoptimized: true disables Next.js's built-in Image Optimization API
  //
  // WHY IS THIS NEEDED?
  // Next.js normally optimizes images on-demand using a Node.js server.
  // Since GitHub Pages is static hosting (no server), we can't use this feature.
  // Setting this to true tells Next.js to use images as-is without optimization.
  //
  // ALTERNATIVE APPROACH:
  // For production, you might want to use a CDN or image optimization service
  // like Cloudinary, imgix, or next/image with a custom loader.
  images: {
    unoptimized: true,
  },

  // --------------------------------------------------------------------------
  // ADDITIONAL CONFIGURATIONS
  // --------------------------------------------------------------------------
  // Add any other Next.js configuration options below as needed
  // Examples: redirects, rewrites, headers, etc.
  // See: https://nextjs.org/docs/app/api-reference/next-config-js
};

export default nextConfig;
