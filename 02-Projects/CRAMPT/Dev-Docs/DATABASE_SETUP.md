# CRAMPT Database Setup Guide

## Step-by-Step Supabase Setup

### 1. Create Supabase Account & Project

1. **Go to**: [https://supabase.com](https://supabase.com)
2. **Sign up** with GitHub (recommended) or email
3. **Click**: "New project"
4. **Configure project**:
   - **Organization**: Create new or select existing
   - **Name**: `crampt` or `crampt-dev`
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: Choose closest (e.g., `eu-west-2` for UK)
   - **Pricing Plan**: Free tier (perfect for development)
5. **Click**: "Create new project"
6. **Wait**: ~2 minutes for provisioning

### 2. Get Connection String

1. In Supabase dashboard, go to **Settings** (bottom left)
2. Click **Database** in the sidebar
3. Scroll to **Connection String** section
4. Select **URI** tab (NOT "Pooling" or "Transaction")
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Replace** `[YOUR-PASSWORD]` with your actual password

### 3. Update `.env` File

1. Open `/Volumes/prism-shared/DEVELOPMENT/crampt/.env`
2. Replace both `DATABASE_URL` and `DIRECT_URL` with your connection string:
   ```bash
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```
3. Save the file

### 4. Run Database Migrations

From terminal, navigate to project and run:

```bash
cd /Volumes/prism-shared/DEVELOPMENT/crampt

# Generate Prisma Client
npm run db:generate

# Create initial migration and apply to database
npm run db:migrate

# When prompted for migration name, enter: "init"
```

This will:
- ✅ Generate TypeScript types from Prisma schema
- ✅ Create SQL migration files
- ✅ Apply migrations to your Supabase database
- ✅ Create all tables (Organization, User, Risk, Control, etc.)

### 5. Seed Database with Demo Data

```bash
npm run db:seed
```

This will populate your database with:
- ✅ 1 demo organization ("Demo Investment Firm Ltd")
- ✅ 1 demo user (demo@crampt.com)
- ✅ 12 compliance controls (governance, CASS, policies, systems, training, monitoring)
- ✅ 3 demo risks (client money breach, inadequate governance, own funds shortfall)
- ✅ 4 compliance calendar items (CMAR, ICARA, best execution, board meeting)

### 6. Verify Setup

#### Option A: Using Prisma Studio (Recommended)
```bash
npm run db:studio
```

- Opens browser at `http://localhost:5555`
- Browse all tables and data
- Visual interface for database

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project
2. Click **Table Editor** (left sidebar)
3. You should see all CRAMPT tables
4. Click on tables to view seeded data

## Troubleshooting

### "Connection failed" Error

**Check**:
1. Database password is correct in `.env`
2. No extra spaces in connection string
3. Supabase project is fully provisioned (check dashboard)
4. Internet connection is working

**Fix**:
- Go back to Supabase → Settings → Database
- Copy connection string again
- Ensure password is correct

### "Prisma Client not generated" Error

**Run**:
```bash
npm run db:generate
```

### Migration Fails

**Check**:
1. `.env` file has correct `DATABASE_URL`
2. Supabase database is accessible
3. No syntax errors in `prisma/schema.prisma`

**Clean slate** (if needed):
```bash
# WARNING: This deletes all data!
npx prisma migrate reset
```

### Seed Fails

**Check**:
1. Migrations ran successfully first
2. No duplicate data (seed uses upsert for demo org)
3. Check error message for specific issue

**Re-run seed**:
```bash
npm run db:seed
```

## Database Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Create new migration
npm run db:migrate

# Push schema changes (dev only, skips migrations)
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Format schema file
npx prisma format
```

## Next Steps

Once database is set up:
1. ✅ Database is ready
2. ✅ Demo data is loaded
3. **Next**: Build the Risk Register UI
4. **Then**: Add authentication

## Supabase Features to Explore Later

- **Auth**: Built-in authentication (NextAuth alternative)
- **Storage**: File uploads for breach evidence
- **Realtime**: WebSocket subscriptions for live updates
- **Edge Functions**: Serverless functions alongside database
- **Backups**: Automated daily backups (paid plans)

## Connection Pooling (Production)

For production, use Supabase connection pooling:

1. In Supabase → Settings → Database → Connection String
2. Select **"Transaction"** mode
3. Use this for `DATABASE_URL`
4. Use **"URI"** mode for `DIRECT_URL`

```bash
DATABASE_URL="postgres://postgres.xxxxx:PASSWORD@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

---

**Questions?** Check:
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- `docs/COLLABORATION.md` for development workflow
