# Quick Setup Guide

## Step 1: Create Environment File

Create a `.env.local` file in the root directory with the following content:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=2uoiibke
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-01-01
SANITY_API_TOKEN=skhmkNpVUeLwZ0YJSL8Ct84xfsXcsfKVmef1x0Ujg1kkuo31DYpDOHZA74dCbHlRBcr6tKjlli3ntEMaA0nLTjbGOct2ekdAxFKddr9A5u3qIhdbXdbsn2uLisTP482a3R6vjA6yG9X7nyFhsLXvjagg87kpVluybjKdAMttpY2To9Eh7nkO
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 4: Set Up Sanity Schema

1. Make sure you have the blog schema set up in your Sanity Studio
2. The schema definition is in `sanity/schemas/blog.ts`
3. Create some blog posts in Sanity Studio to see them on your site

## That's it!

Your blog application is ready to use. For more details, see the main [README.md](./README.md) file.


