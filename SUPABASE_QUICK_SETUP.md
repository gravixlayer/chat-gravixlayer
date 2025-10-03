# Supabase Quick Setup (5 Minutes)

## Step 1: Create Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (free, no credit card)

## Step 2: Create Database
1. Click "New project"
2. Choose organization (create if needed)
3. Enter project name: "gravix-chat"
4. Enter database password (save this!)
5. Choose region (closest to your users)
6. Click "Create new project"
7. Wait 2-3 minutes for setup

## Step 3: Get Connection String
1. Go to Settings (gear icon)
2. Click "Database" 
3. Scroll to "Connection string"
4. Copy the "URI" format
5. Replace [YOUR-PASSWORD] with your password

## Step 4: Update Your App
Add to your .env.local:
```bash
POSTGRES_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

## Step 5: Run Migrations
```bash
# Install dependencies (if not already)
pnpm install

# Run database migrations to create tables
pnpm db:migrate
```

## Step 6: Remove In-Memory Storage
1. Comment out the in-memory storage warnings in lib/db/queries.ts
2. The app will now use the real database!

## That's it! 🎉
Your app now has a production-ready database that can handle thousands of users for FREE!