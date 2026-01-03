# Sanity Schema Setup

This directory contains the blog schema definition for Sanity CMS.

## How to Use This Schema

1. If you haven't set up Sanity Studio yet, initialize it:
   ```bash
   npm install -g @sanity/cli
   sanity init
   ```

2. Copy the `blog.ts` schema file to your Sanity Studio's `schemas` folder (usually in `studio/schemas/` or similar).

3. Import it in your `schemas/index.ts`:
   ```typescript
   import blog from './blog';
   
   export default [blog];
   ```

4. The schema includes:
   - **Title** (required): Blog post title
   - **Slug** (required): URL-friendly identifier (auto-generated from title)
   - **Excerpt**: Short description
   - **Content** (required): Rich text content using Portable Text
   - **Published At** (required): Publication date
   - **Author**: Author name

## Schema Features

- Auto-generated slugs from titles
- Rich text content with support for images
- Date/time picker for publication dates
- Preview configuration for better CMS experience


