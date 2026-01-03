# Next.js Blog Application with Sanity CMS

A production-ready blog application built with Next.js (Pages Router), TypeScript, and Sanity CMS using GROQ queries.

## Features

- ✅ **Homepage with Blog Listing** - Displays all blogs fetched from Sanity using GROQ queries
- ✅ **Dynamic Blog Detail Pages** - Individual blog pages using Next.js dynamic routing
- ✅ **Edit/Delete Functionality** - Update and delete blog posts directly from the detail page
- ✅ **Static Site Generation** - Uses `getStaticProps` and `getStaticPaths` for optimal performance
- ✅ **Fully Responsive** - Mobile, tablet, and desktop friendly UI
- ✅ **TypeScript** - Fully typed for better developer experience

## Tech Stack

- **Next.js 14** (Pages Router)
- **TypeScript**
- **Sanity CMS** with GROQ queries
- **Tailwind CSS** for styling
- **Portable Text** for rich content rendering

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-01-01
SANITY_API_TOKEN=your_api_token
```

**Important:** Create the `.env.local` file manually in the root directory with your Sanity credentials. The file is already in `.gitignore` to prevent committing sensitive data.

### 3. Sanity CMS Schema Setup

The blog schema is defined in `sanity/schemas/blog.ts`. To use this schema in your Sanity Studio:

1. Install Sanity CLI (if not already installed):
   ```bash
   npm install -g @sanity/cli
   ```

2. Initialize Sanity in your project (if not already done):
   ```bash
   sanity init
   ```

3. Add the blog schema to your Sanity Studio's schema folder and import it in your `schemas/index.ts`:
   ```typescript
   import blog from './blog';
   
   export default [blog];
   ```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## GROQ Queries Explanation

All GROQ queries are defined in `lib/queries.ts`:

### `allBlogsQuery`
Fetches all blog posts ordered by publication date (newest first):
```groq
*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  author
}
```

### `blogBySlugQuery`
Fetches a single blog post by its slug:
```groq
*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  content,
  publishedAt,
  author,
  excerpt
}
```

### `allBlogSlugsQuery`
Fetches all blog slugs for static path generation:
```groq
*[_type == "blog"] {
  slug {
    current
  }
}
```

## Project Structure

```
nextblog/
├── pages/
│   ├── api/
│   │   └── blog/
│   │       └── [id].ts          # API routes for edit/delete
│   ├── blog/
│   │   └── [slug].tsx           # Dynamic blog detail page
│   ├── _app.tsx                 # App wrapper
│   └── index.tsx                # Homepage with blog listing
├── lib/
│   ├── sanity.ts                # Sanity client configuration
│   └── queries.ts               # GROQ queries
├── types/
│   └── blog.ts                  # TypeScript interfaces
├── sanity/
│   └── schemas/
│       └── blog.ts              # Sanity schema definition
├── styles/
│   └── globals.css              # Global styles with Tailwind
└── .env.local                   # Environment variables (not committed)
```

## Static Site Generation (SSG)

The application uses Next.js Static Site Generation for optimal performance:

- **Homepage (`index.tsx`)**: Uses `getStaticProps` to fetch all blogs at build time with ISR (revalidates every 60 seconds)
- **Blog Detail Pages (`[slug].tsx`)**: Uses `getStaticPaths` to pre-generate all blog pages and `getStaticProps` to fetch individual blog data

## Edit/Delete Functionality

- **Edit**: Click the "Edit" button on any blog detail page to update the title, excerpt, and author
- **Delete**: Click the "Delete" button to remove a blog post (with confirmation)
- Both operations use API routes (`/api/blog/[id]`) that interact with Sanity CMS using the write client

**Note**: For production, consider adding authentication/authorization to protect these endpoints. A commented example is provided in the API route.

## Deployment on Vercel

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_TOKEN`
4. Deploy!

## Assumptions & Trade-offs

1. **Content Editing**: Full content editing (Portable Text blocks) is not implemented in the edit form - only title, excerpt, and author can be edited. Full content editing should be done in Sanity Studio.

2. **Authentication**: Edit/Delete endpoints are currently unprotected. For production, implement proper authentication (e.g., token-based auth as shown in commented code).

3. **Image Handling**: The schema supports images in Portable Text, but image URL building is set up in `lib/sanity.ts` for future use.

4. **Error Handling**: Basic error handling is implemented. For production, consider more robust error handling and user feedback.

5. **Revalidation**: ISR is set to 60 seconds. Adjust based on your content update frequency.

## License

This project is created for internship assignment purposes.

