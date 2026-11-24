<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->



Set up a dynamic Prisma database schema and server actions for the HookTos Marketplace and Billboard feature (`app/marketplace/page.tsx`).

Requirements:

1. Update `prisma/schema.prisma`:

   - Define a `BusinessListing` model:

     * id (String @id @default(cuid()))
     * name (String)
     * slug (String @unique)
     * category (String) // e.g., SaaS, Retail, Food, Services
     * tag (String) // e.g., "AI Automation", "Artisan Cafe"
     * websiteUrl (String)
     * logoUrl (String?)
     * description (String?)
     * isApproved (Boolean @default(true))
     * createdAt (DateTime @default(now()))
   - Define an `AdSlot` model for Virtual Billboard:

     * id (String @id @default(cuid()))
     * title (String)
     * category (String)
     * tier (String) // "FEATURED", "MEDIUM", "STANDARD"
     * pricePerWeek (Int)
     * views (Int @default(0))
     * clicks (Int @default(0))
     * imageUrl (String?)
     * websiteUrl (String?)
     * isLive (Boolean @default(true))
     * expiresAt (DateTime?)
     * createdAt (DateTime @default(now()))
2. Create Prisma Seed Script (`prisma/seed.ts`):

   - Populate initial mock data for both `BusinessListing` (for the auto-scrolling marquee rows) and `AdSlot` (for the treemap billboard grid) so the marketplace renders live dynamic data.
3. Server Actions & API Fetching:

   - Create `app/actions/marketplace.ts` with server functions to fetch live billboard slots and active business listings.
   - Update `app/marketplace/page.tsx` (or `app/directory/page.tsx`) to fetch data directly from Prisma DB with fallbacks.
4. Run Migration & Seed:

   - Execute `npx prisma db push` and `npx prisma db seed` to establish the database connection.
