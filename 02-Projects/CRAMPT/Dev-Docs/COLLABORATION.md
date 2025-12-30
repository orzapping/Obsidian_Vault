# CRAMPT - Collaboration Guide

This document helps Claude Code (and future team members) understand how to work effectively on this project.

## Project Overview

**CRAMPT** = Compliance Risk Assessment & Monitoring Platform Tool
- FCA compliance tool for UK investment firms
- Built with Next.js 14 + TypeScript + Prisma + PostgreSQL
- Solo developer project (Adrian Rader)

## Development Workflow

### When Starting Work
1. Read `README.md` for project overview
2. Review `docs/PROJECT_CONTEXT.md` for business context
3. Check `prisma/schema.prisma` for data model
4. Review recent git commits for latest changes

### Coding Standards

**TypeScript**
- Strict mode enabled
- Use interfaces for object shapes
- Use types for unions/primitives
- Explicit return types on functions
- No `any` types (use `unknown` if needed)

**React/Next.js**
- Functional components only
- Use hooks (useState, useEffect, etc.)
- Server Components by default
- Client Components when needed (use 'use client')
- Co-locate related files

**File Naming**
- Components: PascalCase (e.g., `RiskCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- API routes: lowercase (e.g., `route.ts`)
- Pages: lowercase (e.g., `page.tsx`)

**Component Structure**
```typescript
// 1. Imports
import { useState } from 'react'
import type { Risk } from '@prisma/client'

// 2. Types/Interfaces
interface RiskCardProps {
  risk: Risk
  onUpdate: (risk: Risk) => void
}

// 3. Component
export function RiskCard({ risk, onUpdate }: RiskCardProps) {
  // Hooks
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }
  
  // Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}
```

### Database Changes

**Always use Prisma migrations:**
```bash
# 1. Modify prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name descriptive_name

# 3. Generate Prisma Client
npx prisma generate
```

**Never:**
- Modify database directly
- Skip migrations
- Use raw SQL (unless absolutely necessary)

### Git Workflow

**Commit Messages:**
```
feat: Add breach register CRUD operations
fix: Correct risk mitigation calculation
docs: Update README with setup instructions
refactor: Simplify control linking logic
test: Add tests for calendar recurrence
chore: Update dependencies
```

**Branching (when needed):**
- `main` - Production-ready code
- `dev` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes

### API Design

**REST Conventions:**
```
GET    /api/risks          - List all risks
GET    /api/risks/:id      - Get single risk
POST   /api/risks          - Create risk
PUT    /api/risks/:id      - Update risk
DELETE /api/risks/:id      - Delete risk
```

**Response Format:**
```typescript
// Success
{
  data: T,
  message?: string
}

// Error
{
  error: string,
  details?: any
}
```

### Error Handling

```typescript
try {
  const result = await someOperation()
  return { data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { error: 'Failed to complete operation' }
}
```

### Testing Strategy (Future)

**Unit Tests:**
- Utils and pure functions
- Validation schemas

**Integration Tests:**
- API routes
- Database operations

**E2E Tests:**
- Critical user journeys
- Risk register workflow
- Breach logging workflow

## FCA Compliance Considerations

### Always Include:
1. **Audit Logging** - Who did what, when
2. **Soft Deletes** - Never truly delete data
3. **Timestamps** - createdAt, updatedAt on all models
4. **Handbook References** - Link to FCA Handbook sections

### Data Validation:
- Validate on client AND server
- Use Zod schemas for consistency
- Sanitize user inputs
- Validate foreign keys

### Security:
- Authentication on all protected routes
- RBAC checks before data access
- No sensitive data in logs
- Environment variables for secrets

## Common Tasks

### Add a New Feature
1. Update Prisma schema if needed
2. Run migration
3. Create API route
4. Create Zod validation schema
5. Build React components
6. Test manually
7. Commit with descriptive message

### Fix a Bug
1. Reproduce the issue
2. Identify root cause
3. Write fix
4. Test thoroughly
5. Commit with `fix:` prefix

### Update Dependencies
```bash
npm update
npm audit fix
# Test everything still works
```

## Helpful Commands

```bash
# Development
npm run dev                    # Start dev server
npx prisma studio             # Open database GUI

# Database
npx prisma migrate dev        # Create migration
npx prisma generate          # Generate Prisma Client
npx prisma db push           # Push schema (dev only)
npx prisma db seed           # Seed database

# Code Quality
npm run lint                 # Run ESLint
npm run type-check           # TypeScript check
npm run build                # Test production build

# Git
git status                   # Check changes
git add .                    # Stage all
git commit -m "message"      # Commit
git log --oneline -10        # Recent commits
```

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [FCA Handbook](https://www.handbook.fca.org.uk)

### Tools
- Prisma Studio - Database GUI
- VS Code - Recommended IDE
- Cursor - AI-assisted development

## Questions/Issues

When stuck:
1. Check existing code for patterns
2. Review Prisma schema
3. Check Next.js/Prisma docs
4. Ask Adrian for clarification

## Maintenance

### Weekly
- Update dependencies
- Review audit logs
- Check database size

### Monthly
- Review and archive old data
- Database backup verification
- Performance review

### Quarterly
- Security audit
- Dependency vulnerability scan
- User feedback review

---

**Last Updated**: October 2025
**Maintainer**: Adrian Rader
