

# Next.js Blog Application with Sanity CMS & GitHub Auth

A production-ready blog application built using **Next.js (Pages Router)**, **TypeScript**, **Sanity CMS**, and **NextAuth.js** with **GitHub OAuth** authentication.

---

## ✨ Features

* ✅ **Homepage with Blog Listing** (Sanity + GROQ)
* ✅ **Dynamic Blog Detail Pages**
* ✅ **Create / Edit / Delete Blogs**
* ✅ **Static Site Generation (SSG + ISR)**
* ✅ **GitHub Authentication (NextAuth.js)**
* ✅ **User Profiles**
* ✅ **Image Upload Support**
* ✅ **Fully Responsive UI**
* ✅ **TypeScript for Type Safety**

---

## 🛠 Tech Stack

* **Next.js 14** (Pages Router)
* **TypeScript**
* **Sanity CMS** (GROQ Queries)
* **NextAuth.js** (Authentication)
* **GitHub OAuth**
* **Tailwind CSS**
* **Portable Text**

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Environment Variables

Create a **`.env.local`** file in the root directory:

```env
# ===============================
# Sanity Configuration
# ===============================
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-01-01
SANITY_API_TOKEN=your_sanity_api_token

# ===============================
# GitHub OAuth (NextAuth)
# ===============================
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ===============================
# NextAuth Configuration
# ===============================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

⚠️ **Important**

* Never commit `.env.local`
* All secrets must stay private
* `.env.local` is already included in `.gitignore`

---

### 3️⃣ GitHub OAuth Setup

1. Go to: **[https://github.com/settings/developers](https://github.com/settings/developers)**
2. Create a **New OAuth App**
3. Set:

   * **Homepage URL:** `http://localhost:3000`
   * **Authorization callback URL:**

     ```
     http://localhost:3000/api/auth/callback/github
     ```
4. Copy **Client ID** and **Client Secret** into `.env.local`

---

### 4️⃣ Sanity CMS Setup

The schema files are located in:

```
sanity/schemas/
```

To initialize Sanity Studio:

```bash
npm install -g @sanity/cli
sanity init
```

Ensure schemas are exported properly:

```ts
import blog from "./blog";
import author from "./author";
import comment from "./comment";

export default [blog, author, comment];
```

---

### 5️⃣ Run Development Server

```bash
npm run dev
```

Open 👉 **[http://localhost:3000](http://localhost:3000)**

---

### 6️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 🔍 GROQ Queries

Located in `lib/queries.ts`

### Fetch All Blogs

```groq
*[_type == "blog"] | order(publishedAt desc)
```

### Fetch Blog by Slug

```groq
*[_type == "blog" && slug.current == $slug][0]
```

### Fetch All Slugs

```groq
*[_type == "blog"].slug.current
```

---

## 📁 Project Structure

```
nextblog/
├── pages/
│   ├── api/
│   │   ├── auth/                # NextAuth routes
│   │   ├── blog/                # CRUD APIs
│   │   └── upload-image.ts
│   ├── blog/[slug].tsx
│   ├── profile/[id].tsx
│   ├── _app.tsx
│   └── index.tsx
├── components/
├── lib/
│   ├── sanity.ts
│   └── queries.ts
├── sanity/
│   └── schemas/
├── styles/
├── types/
└── .env.local (ignored)
```

---

## 🔐 Authentication (GitHub + NextAuth)

* Login via GitHub
* Session handled by NextAuth
* User profiles auto-created in Sanity
* Auth routes located at:

  ```
  /api/auth/[...nextauth]
  ```

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import project into **Vercel**
3. Add environment variables in Vercel dashboard
4. Deploy 🎉

---

## ⚠️ Notes

* Edit/Delete routes **require authentication** (recommended for production)
* Full Portable Text editing should be done via Sanity Studio
* ISR revalidation set to **60 seconds**
* Image uploads handled via API route

---

## 📄 License

Created for learning and internship project purposes.

