# User & Firm Management - Technical Specification

## Executive Summary
This document outlines the technical architecture for implementing comprehensive user and firm management with FCA-compliant audit trails in CRAMPT.

---

## 1. Enhanced Database Schema

### 1.1 Enhanced Organization Model
```prisma
model Organization {
  id                    String   @id @default(cuid())
  name                  String
  fcaFrn                String?  @unique

  // Firm Details
  tradingName           String?
  registeredAddress     String?  @db.Text
  businessAddress       String?  @db.Text
  phoneNumber           String?
  companyNumber         String?  @unique
  incorporatedDate      DateTime?

  // Regulatory Information
  regulatedActivities   String[] // Array of FCA permissions
  smcrRegime            SmcrRegime? // Full, Enhanced, Core
  tier                  FirmTier?   // SNI, Small, Medium, Large

  // Status
  status                OrgStatus @default(ACTIVE)
  subscriptionTier      String?   // For SaaS pricing
  subscriptionExpiry    DateTime?

  // Metadata
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  createdById           String?

  // Relations
  users                 User[]
  smfHolders            SmfHolder[]
  risks                 Risk[]
  controls              Control[]
  breaches              Breach[]
  calendarItems         CalendarItem[]
  auditLogs             AuditLog[]
}

enum SmcrRegime {
  CORE        // Core regime
  ENHANCED    // Enhanced regime
  FULL        // Banking/insurance
}

enum FirmTier {
  SNI         // Small Non-Interconnected
  SMALL
  MEDIUM
  LARGE
}

enum OrgStatus {
  ACTIVE
  SUSPENDED
  TRIAL
  EXPIRED
}
```

### 1.2 Enhanced User Model
```prisma
model User {
  id                    String   @id @default(cuid())
  email                 String   @unique

  // Authentication (NextAuth.js integration)
  emailVerified         DateTime?
  hashedPassword        String?
  image                 String?

  // Personal Details
  firstName             String
  lastName              String
  jobTitle              String?
  phoneNumber           String?
  mobileNumber          String?

  // Employment Details
  employmentStartDate   DateTime?
  employmentEndDate     DateTime?
  lineManagerId         String?
  lineManager           User?    @relation("LineManagement", fields: [lineManagerId], references: [id])
  directReports         User[]   @relation("LineManagement")

  // Permissions & Access
  role                  UserRole @default(USER)
  permissions           String[] // Granular permissions array
  isSMF                 Boolean  @default(false)
  smfFunction           SmfFunction?

  // Status
  status                UserStatus @default(PENDING)
  lastLoginAt           DateTime?
  invitedAt             DateTime?
  invitedBy             String?

  // Organization Link
  organizationId        String
  organization          Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  // Metadata
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relations
  sessions              Session[]
  accounts              Account[]
  auditLogs             AuditLog[] @relation("UserActions")
  createdAuditLogs      AuditLog[] @relation("AuditCreatedBy")
}

enum UserRole {
  OWNER               // Firm owner - full access
  ADMIN               // System admin - nearly full access
  COMPLIANCE_OFFICER  // MLRO, Compliance Officer
  SMF_HOLDER          // SMF function holder
  MANAGER             // Department manager
  AUDITOR             // Internal/external auditor (read-only+)
  USER                // Standard user
  READONLY            // View-only access
}

enum UserStatus {
  PENDING             // Invited, not yet accepted
  ACTIVE              // Active user
  SUSPENDED           // Temporarily suspended
  INACTIVE            // Left organization
}

enum SmfFunction {
  SMF1   // Chief Executive
  SMF2   // Chief Finance Officer
  SMF3   // Executive Director
  SMF16  // Compliance Oversight
  SMF17  // Money Laundering Reporting Officer
  SMF18  // Other Overall Responsibility
  SMF19  // Head of Overseas Branch
  SMF20  // Chief Operations Officer
  SMF21  // EEA Branch Senior Manager
  SMF22  // Proprietary Trader
  SMF23  // Chief Risk Officer
  SMF24  // Chief Internal Auditor
  SMF27  // Partner
}
```

### 1.3 SMF Holder Registry
```prisma
model SmfHolder {
  id                String       @id @default(cuid())
  userId            String
  user              User         @relation(fields: [userId], references: [id])
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])

  // SMF Details
  smfFunction       SmfFunction
  prescribedResponsibilities String[] // Array of PRS
  statementOfResponsibilities String? @db.Text

  // Dates
  appointmentDate   DateTime
  approvalDate      DateTime?
  leavingDate       DateTime?

  // Status
  status            SmfStatus @default(PENDING_APPROVAL)
  fcaIndividualReference String? // FCA IRN

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([userId, smfFunction])
  @@index([organizationId])
  @@index([userId])
}

enum SmfStatus {
  PENDING_APPROVAL
  APPROVED
  ACTIVE
  RESIGNED
  WITHDRAWN
}
```

### 1.4 Enhanced Audit Log
```prisma
model AuditLog {
  id                String       @id @default(cuid())

  // What happened
  action            AuditAction
  entity            String       // Risk, Breach, Control, User, etc.
  entityId          String
  description       String?      // Human-readable description

  // Who did it
  userId            String?
  user              User?        @relation("UserActions", fields: [userId], references: [id], onDelete: SetNull)
  userName          String?      // Cached for deleted users
  userEmail         String?      // Cached for deleted users

  // Where & When
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  timestamp         DateTime     @default(now())

  // Technical Details
  ipAddress         String?
  userAgent         String?

  // Change Tracking
  changesBefore     Json?        // Snapshot before
  changesAfter      Json?        // Snapshot after
  changedFields     String[]     // List of changed field names

  // Metadata
  severity          AuditSeverity @default(INFO)
  category          AuditCategory?

  @@index([organizationId])
  @@index([entity, entityId])
  @@index([userId])
  @@index([timestamp])
  @@index([action])
  @@index([severity])
}

enum AuditAction {
  // CRUD Operations
  CREATE
  READ
  UPDATE
  DELETE

  // User Actions
  LOGIN
  LOGOUT
  LOGIN_FAILED
  PASSWORD_CHANGE
  PASSWORD_RESET
  EMAIL_VERIFY

  // Authorization
  PERMISSION_GRANT
  PERMISSION_REVOKE
  ROLE_CHANGE

  // Data Export
  EXPORT_CSV
  EXPORT_PDF
  EXPORT_MARKDOWN

  // Breach Actions
  BREACH_REPORT
  BREACH_INVESTIGATE
  BREACH_CLOSE
  BREACH_NOTIFY_FCA

  // System Actions
  BACKUP
  RESTORE
  IMPORT
}

enum AuditSeverity {
  INFO      // Normal operations
  WARNING   // Unusual but not critical
  ERROR     // Failed operations
  CRITICAL  // Security-relevant events
}

enum AuditCategory {
  AUTHENTICATION
  AUTHORIZATION
  DATA_CHANGE
  COMPLIANCE
  SECURITY
  SYSTEM
}
```

### 1.5 NextAuth.js Integration Models
```prisma
// For NextAuth.js session management
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## 2. Authentication Strategy

### Recommended: NextAuth.js

**Why NextAuth.js?**
✅ Industry standard for Next.js apps
✅ Built-in security best practices
✅ Supports email/password + OAuth
✅ Session management out of the box
✅ Prisma adapter available
✅ JWT or database sessions

**Implementation:**
```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true }
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          // Log failed login attempt
          await logAudit({
            action: "LOGIN_FAILED",
            userId: user.id,
            entity: "User",
            entityId: user.id,
            severity: "WARNING",
          })
          throw new Error("Invalid credentials")
        }

        // Check user status
        if (user.status !== "ACTIVE") {
          throw new Error("Account is not active")
        }

        // Log successful login
        await logAudit({
          action: "LOGIN",
          userId: user.id,
          entity: "User",
          entityId: user.id,
          severity: "INFO",
        })

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          organizationId: user.organizationId,
          isSMF: user.isSMF,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.organizationId = user.organizationId
        token.isSMF = user.isSMF
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.organizationId = token.organizationId
        session.user.isSMF = token.isSMF
      }
      return session
    }
  }
}
```

---

## 3. Authorization & Permissions

### Role-Based Access Control (RBAC)

```typescript
// lib/permissions.ts

export const PERMISSIONS = {
  // User Management
  USERS_VIEW: "users:view",
  USERS_CREATE: "users:create",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",

  // Organization Management
  ORG_VIEW: "org:view",
  ORG_EDIT: "org:edit",
  ORG_SETTINGS: "org:settings",

  // Risk Management
  RISKS_VIEW: "risks:view",
  RISKS_CREATE: "risks:create",
  RISKS_EDIT: "risks:edit",
  RISKS_DELETE: "risks:delete",

  // Controls
  CONTROLS_VIEW: "controls:view",
  CONTROLS_CREATE: "controls:create",
  CONTROLS_EDIT: "controls:edit",
  CONTROLS_DELETE: "controls:delete",

  // Breaches
  BREACHES_VIEW: "breaches:view",
  BREACHES_CREATE: "breaches:create",
  BREACHES_EDIT: "breaches:edit",
  BREACHES_DELETE: "breaches:delete",
  BREACHES_NOTIFY_FCA: "breaches:notify",

  // Calendar
  CALENDAR_VIEW: "calendar:view",
  CALENDAR_EDIT: "calendar:edit",

  // Reports & Export
  REPORTS_VIEW: "reports:view",
  REPORTS_EXPORT: "reports:export",

  // Audit Logs
  AUDIT_VIEW: "audit:view",
  AUDIT_EXPORT: "audit:export",

  // Analytics
  ANALYTICS_VIEW: "analytics:view",
} as const

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  OWNER: Object.values(PERMISSIONS), // All permissions

  ADMIN: [
    ...Object.values(PERMISSIONS).filter(p =>
      !p.startsWith('org:settings') // Can't change org settings
    )
  ],

  COMPLIANCE_OFFICER: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ORG_VIEW,
    PERMISSIONS.RISKS_VIEW,
    PERMISSIONS.RISKS_CREATE,
    PERMISSIONS.RISKS_EDIT,
    PERMISSIONS.CONTROLS_VIEW,
    PERMISSIONS.CONTROLS_CREATE,
    PERMISSIONS.CONTROLS_EDIT,
    PERMISSIONS.BREACHES_VIEW,
    PERMISSIONS.BREACHES_CREATE,
    PERMISSIONS.BREACHES_EDIT,
    PERMISSIONS.BREACHES_NOTIFY_FCA,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.CALENDAR_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  SMF_HOLDER: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ORG_VIEW,
    PERMISSIONS.RISKS_VIEW,
    PERMISSIONS.CONTROLS_VIEW,
    PERMISSIONS.BREACHES_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  MANAGER: [
    PERMISSIONS.RISKS_VIEW,
    PERMISSIONS.RISKS_EDIT,
    PERMISSIONS.CONTROLS_VIEW,
    PERMISSIONS.CONTROLS_EDIT,
    PERMISSIONS.BREACHES_VIEW,
    PERMISSIONS.BREACHES_CREATE,
    PERMISSIONS.BREACHES_EDIT,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  AUDITOR: [
    PERMISSIONS.RISKS_VIEW,
    PERMISSIONS.CONTROLS_VIEW,
    PERMISSIONS.BREACHES_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  USER: [
    PERMISSIONS.RISKS_VIEW,
    PERMISSIONS.CONTROLS_VIEW,
    PERMISSIONS.BREACHES_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],

  READONLY: [
    PERMISSIONS.RISKS_VIEW,
    PERMISSIONS.CONTROLS_VIEW,
    PERMISSIONS.BREACHES_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
  ],
}

export function hasPermission(user: User, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  return rolePermissions.includes(permission) || user.permissions.includes(permission)
}
```

---

## 4. Audit Trail Implementation

### Automatic Audit Logging Middleware

```typescript
// lib/audit.ts

interface AuditContext {
  action: AuditAction
  entity: string
  entityId: string
  userId?: string
  organizationId: string
  description?: string
  changesBefore?: any
  changesAfter?: any
  severity?: AuditSeverity
  category?: AuditCategory
  ipAddress?: string
  userAgent?: string
}

export async function logAudit(context: AuditContext) {
  try {
    // Get changed fields
    const changedFields = context.changesBefore && context.changesAfter
      ? Object.keys(context.changesAfter).filter(key =>
          JSON.stringify(context.changesBefore[key]) !== JSON.stringify(context.changesAfter[key])
        )
      : []

    // Get user details for caching
    let userName: string | undefined
    let userEmail: string | undefined
    if (context.userId) {
      const user = await prisma.user.findUnique({
        where: { id: context.userId },
        select: { firstName: true, lastName: true, email: true }
      })
      if (user) {
        userName = `${user.firstName} ${user.lastName}`
        userEmail = user.email
      }
    }

    await prisma.auditLog.create({
      data: {
        action: context.action,
        entity: context.entity,
        entityId: context.entityId,
        description: context.description,
        userId: context.userId,
        userName,
        userEmail,
        organizationId: context.organizationId,
        changesBefore: context.changesBefore,
        changesAfter: context.changesAfter,
        changedFields,
        severity: context.severity || 'INFO',
        category: context.category,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      }
    })
  } catch (error) {
    console.error('Failed to log audit:', error)
    // Don't throw - audit logging failure shouldn't break the app
  }
}

// Prisma middleware for automatic audit logging
export function enableAuditMiddleware() {
  prisma.$use(async (params, next) => {
    const result = await next(params)

    // Only log certain models
    const auditedModels = ['Risk', 'Control', 'Breach', 'User', 'Organization', 'CalendarItem']
    if (!auditedModels.includes(params.model || '')) {
      return result
    }

    // Get current user from context (set by API middleware)
    const currentUser = getCurrentUser() // Implement this based on your session management

    if (['create', 'update', 'delete'].includes(params.action)) {
      let action: AuditAction
      let changesBefore: any
      let changesAfter: any

      switch (params.action) {
        case 'create':
          action = 'CREATE'
          changesAfter = result
          break
        case 'update':
          action = 'UPDATE'
          // Fetch the before state
          changesBefore = await prisma[params.model].findUnique({
            where: params.args.where
          })
          changesAfter = result
          break
        case 'delete':
          action = 'DELETE'
          changesBefore = await prisma[params.model].findUnique({
            where: params.args.where
          })
          break
        default:
          return result
      }

      await logAudit({
        action,
        entity: params.model!,
        entityId: result?.id || params.args.where?.id,
        userId: currentUser?.id,
        organizationId: result?.organizationId || currentUser?.organizationId,
        changesBefore,
        changesAfter,
        severity: 'INFO',
        category: 'DATA_CHANGE',
      })
    }

    return result
  })
}
```

---

## 5. User Flows

### 5.1 User Invitation & Onboarding
1. Admin goes to Users page → "Invite User"
2. Admin enters: email, role, job title, optional SMF function
3. System generates secure invitation link (24-hour expiry)
4. Invitation email sent with link
5. User clicks link → lands on registration page
6. User enters: first name, last name, password, phone number
7. Email verification sent
8. User verifies email → account activated
9. User can now log in

### 5.2 First-Time Org Setup
1. Organization created (manual or via signup flow)
2. First user (OWNER) invited
3. Owner sets up:
   - Firm details (FCA FRN, address, etc.)
   - Regulated activities
   - SMF regime
4. Owner invites other users
5. Owner designates SMF holders

### 5.3 SMF Designation Flow
1. User account created with isSMF flag
2. Admin creates SmfHolder record:
   - Links user to SMF function
   - Sets appointment date
   - Uploads statement of responsibilities
   - Sets prescribed responsibilities
3. Status starts as PENDING_APPROVAL
4. Once FCA approved, status → APPROVED → ACTIVE
5. SMF holder gains elevated permissions

---

## 6. UI Implementation Recommendations

### 6.1 Navigation Structure
```
Settings (Dropdown)
├── Organization Profile
├── Users & Permissions
│   ├── Active Users
│   ├── Pending Invitations
│   ├── Invite User
│   └── SMF Registry
├── My Profile
├── Security
│   ├── Change Password
│   ├── Two-Factor Auth (future)
│   └── Active Sessions
└── Audit Trail
```

### 6.2 Key Pages to Build
1. **Organization Profile** (`/settings/organization`)
   - View/edit firm details
   - FCA FRN, address, contact details
   - Regulated activities selection
   - SMF regime indicator

2. **Users & Permissions** (`/settings/users`)
   - Table of all users with role, status, last login
   - Filter by role, status
   - Actions: Edit, Suspend, Delete
   - "Invite User" button

3. **User Detail** (`/settings/users/[userId]`)
   - Personal details
   - Role & permissions
   - SMF designation (if applicable)
   - Activity log (user-specific audit trail)
   - Login history

4. **SMF Registry** (`/settings/smf`)
   - Table of all SMF holders
   - SMF function, holder name, appointment date, status
   - Statement of responsibilities document link
   - FCA IRN

5. **Audit Trail** (`/settings/audit`)
   - Filterable table: date range, user, action type, entity
   - Export to CSV/PDF
   - Detail modal showing before/after changes

6. **My Profile** (`/settings/profile`)
   - User's own details
   - Change password
   - Contact preferences

---

## 7. Implementation Phases

### Phase 1: Core Authentication & User Management (Week 1-2)
- [ ] Enhanced Prisma schema migration
- [ ] NextAuth.js setup
- [ ] Login/logout functionality
- [ ] User CRUD operations
- [ ] Basic RBAC implementation
- [ ] User invitation flow

### Phase 2: Organization Management (Week 2-3)
- [ ] Organization profile page
- [ ] Firm details editing
- [ ] SMF holder registry
- [ ] SMF designation flow

### Phase 3: Audit Trail (Week 3-4)
- [ ] Audit logging middleware
- [ ] Audit trail UI
- [ ] Audit export functionality
- [ ] Integrate audit logging into existing modules

### Phase 4: Advanced Features (Week 4+)
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Activity notifications
- [ ] User analytics dashboard
- [ ] API key management (if building API)

---

## 8. Security Considerations

### 8.1 Password Security
- ✅ Use bcryptjs for hashing (12+ rounds)
- ✅ Enforce strong password requirements
- ✅ Rate-limit login attempts
- ✅ Lockout after failed attempts

### 8.2 Session Security
- ✅ JWT with short expiry (30 days max)
- ✅ Secure, httpOnly cookies
- ✅ CSRF protection (NextAuth.js built-in)
- ✅ Log all login/logout events

### 8.3 Data Protection
- ✅ Organization data isolation (RLS)
- ✅ Soft delete for users (retain audit trail)
- ✅ Encrypt sensitive fields (optional)
- ✅ Regular backup schedule

### 8.4 FCA Compliance
- ✅ Complete audit trail (who, what, when)
- ✅ Immutable audit logs (no delete)
- ✅ User authentication logs
- ✅ Data export for regulatory review
- ✅ SMF accountability framework

---

## 9. Technical Recommendations

### 9.1 Libraries to Install
```bash
npm install next-auth @prisma/adapter
npm install bcryptjs
npm install @types/bcryptjs -D
npm install zod # For form validation
npm install react-hook-form @hookform/resolvers
```

### 9.2 Environment Variables
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Email (for invitations)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourapp.com
```

### 9.3 Database Indexes (Critical for Performance)
Already well-indexed in the schema above, but ensure:
- Organization: fcaFrn (unique)
- User: email (unique), organizationId, status
- AuditLog: organizationId, timestamp, userId, entity+entityId

---

## 10. Testing Strategy

### 10.1 Unit Tests
- Permission checking logic
- Audit logging functions
- Password hashing/validation

### 10.2 Integration Tests
- User registration flow
- Login/logout flow
- Role-based access control
- Audit log creation on data changes

### 10.3 Manual Testing Checklist
- [ ] Can invite user
- [ ] Can register with invitation link
- [ ] Can log in/out
- [ ] Cannot access unauthorized pages
- [ ] Audit logs created for all changes
- [ ] Can view audit trail
- [ ] Can designate SMF holder
- [ ] Organization data properly isolated

---

## 11. Future Enhancements

### 11.1 Short-term (3-6 months)
- Two-factor authentication (TOTP)
- Email notifications for audit events
- User activity dashboard
- Advanced permission customization

### 11.2 Long-term (6-12 months)
- SSO integration (SAML, OAuth)
- API access with key management
- Mobile app with push notifications
- Advanced analytics on user behavior
- Automated compliance reporting

---

## Conclusion

This specification provides a comprehensive, FCA-compliant user and firm management system with full audit trails. The phased approach allows for incremental delivery while maintaining security and compliance throughout.

**Key Benefits:**
✅ FCA-compliant audit trail
✅ Robust authentication & authorization
✅ Multi-tenant architecture with org isolation
✅ SMF accountability framework
✅ Scalable and secure by design
✅ Industry-standard technologies (NextAuth.js, Prisma)

