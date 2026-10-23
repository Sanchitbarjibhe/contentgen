# HookTos AI - Content Generator 🚀

HookTos AI is a modern, AI-powered content generation web application built with **Next.js**, **Clerk Authentication**, **Tailwind CSS**, and **Prisma**.

---

## 🌟 Key Features

- **AI Content Generation**: Fast and customizable AI-generated hooks and content (`/api/generate`).
- **Authentication**: Secure user login, signup, and session management using **Clerk**.
- **Modern UI/UX**: Styled with **Tailwind CSS** and **PostCSS** for clean, responsive interfaces.
- **Robust Validation**: Schema validation powered by **Zod** and **Valibot**.
- **Database Management**: Integrated with **Prisma** for database querying and schema management.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: Tailwind CSS, PostCSS
- **Database / ORM**: Prisma
- **Validation**: Zod, Valibot
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone -b dev [https://github.com/Sanchitbarjibhe/Content-generator.git](https://github.com/Sanchitbarjibhe/Content-generator.git)
cd contentgen
```

## Trending audio and hashtags

The trending pages use sample data by default. To load live results, set these server-side environment variables and configure each Apify task to return the corresponding trend records:

```env
APIFY_API_KEY=your_apify_api_key
APIFY_TRENDING_AUDIO_TASK_ID=your_audio_task_id
APIFY_TRENDING_HASHTAG_TASK_ID=your_hashtag_task_id
```

The API responses are cached and revalidated every two hours. Keep these credentials server-side; they are not needed to use the sample data.

# Project Tech Stack Rules

- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Important:** Do NOT use Mongoose or MongoDB. Stick strictly to Prisma Client.
