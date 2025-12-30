# CRAMPT - Quick Start Guide

## ✅ Setup Complete!

Your CRAMPT project has been initialized with:
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS configured
- ✅ Prisma ORM with comprehensive schema
- ✅ Core dependencies installed
- ✅ Project documentation
- ✅ Git repository initialized

## 🚀 Next Steps

### 1. Set Up Your Database

You have two options:

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL if not already installed
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb crampt

# Update .env with your connection string
DATABASE_URL="postgresql://yourusername@localhost:5432/crampt"
```

#### Option B: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Update `.env`:
```
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### 2. Initialize Database
```bash
cd /Volumes/prism-shared/DEVELOPMENT/crampt

# Generate Prisma Client
npx prisma generate

# Create first migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to see your database
npx prisma studio
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Key Files to Understand

1. **`README.md`** - Project overview and installation
2. **`docs/PROJECT_CONTEXT.md`** - Business context and requirements
3. **`docs/COLLABORATION.md`** - Coding standards and workflow
4. **`prisma/schema.prisma`** - Complete database schema
5. **`app/page.tsx`** - Homepage (start here for UI)

## 🎯 What to Build First

### Phase 1: Authentication & Layout (Week 1)
- [ ] Set up NextAuth.js or Clerk
- [ ] Create dashboard layout
- [ ] Add navigation menu
- [ ] Implement RBAC

### Phase 2: Risk Register (Week 2)
- [ ] Create `/app/(dashboard)/risks/page.tsx`
- [ ] Build Risk CRUD API routes
- [ ] Create Risk components
- [ ] Add risk scoring logic

### Phase 3: Controls Library (Week 3)
- [ ] Seed database with pre-built controls
- [ ] Create controls browsing interface
- [ ] Build risk-control linking UI
- [ ] Implement mitigation calculations

## 🔧 Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Test production build
npm run lint                # Check code quality

# Database
npx prisma studio          # Database GUI
npx prisma migrate dev     # Create migration
npx prisma db push         # Quick schema sync (dev only)

# Git
git status                 # Check changes
git add .                  # Stage all
git commit -m "message"    # Commit
git log --oneline -5       # Recent commits
```

## 📚 Learning Resources

### Essential Reading
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### FCA Context
- [SYSC Sourcebook](https://www.handbook.fca.org.uk/handbook/SYSC)
- [CASS Sourcebook](https://www.handbook.fca.org.uk/handbook/CASS)
- [MIFIDPRU Sourcebook](https://www.handbook.fca.org.uk/handbook/MIFIDPRU)

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Prisma Client not generated
```bash
npx prisma generate
```

### Database connection failed
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check network/firewall settings

### TypeScript errors
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎨 UI Components

Once ready, add shadcn/ui components:
```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add dialog
# etc.
```

## 📬 Questions?

Review the documentation in `/docs`:
- `PROJECT_CONTEXT.md` - Why we're building this
- `COLLABORATION.md` - How to code effectively

## 🎉 You're All Set!

Your CRAMPT development environment is ready. Time to build something amazing!

---

**Project**: CRAMPT - Compliance Risk Assessment & Monitoring Platform Tool
**Created**: October 2025
**Developer**: Adrian Rader
