# Production Database Setup Options

## Option 1: Vercel Postgres (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Create Postgres database
vercel storage create postgres

# This will give you a POSTGRES_URL
# Add it to your .env.local and Vercel environment variables
```

## Option 2: Supabase (Free tier available)
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
# 4. Add to .env.local:
POSTGRES_URL="postgresql://[user]:[password]@[host]:5432/[database]"
```

## Option 3: PlanetScale (MySQL)
```bash
# 1. Go to https://planetscale.com
# 2. Create database
# 3. Get connection string
# 4. Update schema.ts for MySQL compatibility
```

## Option 4: Railway (PostgreSQL)
```bash
# 1. Go to https://railway.app
# 2. Create PostgreSQL service
# 3. Get connection string from Variables tab
```

## Required Changes:
1. Uncomment database imports in lib/db/queries.ts
2. Add POSTGRES_URL to environment variables
3. Run database migrations: `pnpm db:migrate`
4. Remove in-memory storage code