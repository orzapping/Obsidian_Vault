# PRISM Platform - Comprehensive Code Review Report

**Review Date**: December 29, 2025
**Codebase**: `/home/obsidan/Development/PRISM-SANDBOX/project-prism-sandbox`
**Reviewer**: Claude Code (code-reviewer agent)

---

## Executive Summary

I have conducted a thorough review of the PRISM Platform codebase. The codebase demonstrates solid architectural foundations with well-structured modules, comprehensive Prisma schema design, and consistent API patterns. However, there are several **critical security issues** and **important improvements** that should be addressed.

**Overall Assessment**: The codebase shows mature development practices but has notable gaps in multi-tenancy enforcement on certain API endpoints that pose security risks in a production environment.

---

## Critical Issues (Confidence: 90-100%)

### 1. CRITICAL: Missing organizationId Filter in Financial Data API

**File**: `src/app/api/core/financial-data/route.ts`
**Lines**: 10-32 (GET handler), 67-205 (POST handler)

**Issue**: The Financial Data API does NOT require or filter by `organizationId` in the GET request, violating the project's multi-tenancy isolation requirement. This could allow cross-tenant data access.

```typescript
// Current code (line 10-32):
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firmId = searchParams.get('firmId')  // <-- No organizationId!
    const asOfDate = searchParams.get('asOfDate')

    const where: any = {
      isCurrentVersion: true
    }

    if (firmId) where.firmId = firmId
    // Missing: organizationId filter!
```

**CLAUDE.md Rule Violated**: "CRITICAL: Always validate organizationId" and "Every query: MUST filter by organizationId"

**Fix**: Add `organizationId` as a required query parameter and filter all database queries by it.

---

### 2. CRITICAL: Missing organizationId in Financial Data POST Handler

**File**: `src/app/api/core/financial-data/route.ts`
**Lines**: 67-205

**Issue**: The POST handler does not require `organizationId` in the request body, and the `prisma.financialData.create` call on line 105 does not include `organizationId` at all. This will cause Prisma to reject the insert (required field) or use a default, breaking multi-tenancy.

```typescript
// Current code (line 86-102):
const existing = await prisma.financialData.findFirst({
  where: {
    firmId: body.contextualInfo.firmId || null,  // Missing organizationId!
    isCurrentVersion: true
  }
})
```

**Fix**: Add organizationId validation and include it in all database operations.

---

### 3. CRITICAL: Wind-Down API Has No Multi-Tenancy

**File**: `src/app/api/calculations/winddown/route.ts`
**Lines**: 17-88 (POST handler), 90-111 (GET handler)

**Issue**: The Wind-Down API has **no multi-tenancy support at all**. It also contains TODO comments indicating database integration is incomplete:

```typescript
// Line 77-78:
// TODO: Store calculation in database
// await db.winddownCalculations.create({ data: { ...body, result } })

// Line 96-99 (GET handler):
// TODO: Retrieve stored calculations from database
// For now, return empty array
return NextResponse.json({
  calculations: [],
  message: 'Database integration pending'
}, { status: 200 })
```

**Impact**: Calculations are not persisted, and when they are, there's no organizationId isolation planned.

---

## Important Issues (Confidence: 80-89%)

### 4. Custom CSS Class Usage Violating Project Convention

**Files**:
- `src/modules/core/firm-data/components/FirmDataForm.tsx` (lines 100-108)
- `src/modules/core/financial-data/components/FinancialDataForm.tsx`
- `src/modules/calculators/risk-assessment/components/RiskAssessmentMain.tsx`

**Issue**: Multiple components use custom CSS classes like `card-section`, `section-header`, `aurora-btn-primary`, `ra-card`, `ra-metric-card`, `ra-btn-primary`, `formula-box` instead of inline Tailwind classes.

```tsx
// FirmDataForm.tsx lines 100-108:
<div className="card-section">  // <-- Custom class
  <h2
    className={`section-header ${isCollapsed('identity') ? 'collapsed' : ''}`}
    onClick={() => toggleSection('identity')}
  >
```

```tsx
// RiskAssessmentMain.tsx line 177:
<div className="ra-card p-6 mb-6">  // <-- Custom class
```

**CLAUDE.md Rule Violated**: "ALWAYS USE INLINE TAILWIND CLASSES. NEVER CREATE CUSTOM CSS CLASSES."

**Note**: These appear to be intentional design system components. The project should either:
1. Define these in a shared component library (acceptable)
2. Convert to inline Tailwind (as per CLAUDE.md)

---

### 5. OFAR Calculator Not Using Database/Multi-Tenancy

**File**: `src/modules/calculators/ofar/components/OFARCalculatorMain.tsx`

**Issue**: The OFAR Calculator Main component (the "keystone module" per CLAUDE.md) operates entirely client-side without database persistence or multi-tenancy awareness. It maintains state only in React `useState`:

```typescript
// Lines 8-33:
const [formData, setFormData] = useState<OFARFormData>({
  firmConfiguration: {
    firmType: 'dealing',
    // ...
  },
  // ...
})
```

While an API route exists at `/api/calculators/ofar`, the main component does not appear to use it for data loading/saving.

**Impact**: OFAR calculations are not persisted and will be lost on page refresh.

---

### 6. Risk Assessment Uses localStorage Without organizationId Scoping

**File**: `src/modules/calculators/risk-assessment/components/RiskAssessmentMain.tsx`
**Lines**: 47-54

```typescript
const getRecent = () => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('ra_recent_controls') || '[]')
  } catch {
    return []
  }
}
```

**Issue**: The localStorage key `ra_recent_controls` is global and not scoped to organization. In a multi-tenant context, this could leak recent controls data between tenants.

**Fix**: Scope localStorage keys by organizationId: `ra_recent_controls_${organizationId}`

---

### 7. Type Safety Issue with `any` Type in API Routes

**Files**: Multiple API routes

**Issue**: Extensive use of `any` type in database where clauses and helper functions:

```typescript
// /api/core/firm-data/route.ts line 31:
const where: any = {
  organizationId,
  isCurrentVersion: true
}

// /api/calculators/kfr/route.ts line 323:
function calculateKFRTotals(
  rtmFactors: any,
  rtcFactors: any,
  rtfFactors: any,
  // ...
)
```

**Impact**: Loss of type safety could lead to runtime errors. Should use Prisma generated types.

---

## Medium Priority Improvements

### 8. Inconsistent Error Message Exposure

**Files**: All API routes

**Issue**: Error details including stack traces are returned to clients in production:

```typescript
// Pattern found in all API routes:
return NextResponse.json(
  {
    error: 'Failed to fetch firm data',
    details: error instanceof Error ? error.message : 'Unknown error'
  },
  { status: 500 }
)
```

**Recommendation**: In production, sanitize error messages and log detailed errors server-side only.

---

### 9. Missing Input Validation on Number Fields

**File**: `src/app/api/calculations/winddown/route.ts`
**Lines**: 29-34

**Issue**: Limited validation on numeric inputs. The wind-down period is validated, but other numeric fields like `totalCosts` are not validated for reasonable bounds.

---

### 10. Potential Division by Zero in OFAR Calculator

**File**: `src/modules/calculators/ofar/components/OFARCalculatorMain.tsx`
**Line**: 113

```typescript
const headroomRatio = (headroom / data.firmConfiguration.ownFunds) * 100
```

**Issue**: If `ownFunds` is 0, this will result in `Infinity` or `NaN`.

**Note**: The API route correctly handles this case, but the client-side component does not.

---

## Code Quality Observations

### Positive Patterns Observed

1. **Consistent Versioning Pattern**: All major models correctly implement `isCurrentVersion`, `supersededBy`, `supersededAt` pattern for audit trails.

2. **Comprehensive Audit Logging**: API routes correctly create audit log entries with user context, changes, and request metadata.

3. **Well-Structured Prisma Schema**: The schema at `/prisma/schema.prisma` properly defines relationships, indexes, and multi-tenancy fields.

4. **Good Separation of Concerns**: Clear separation between API routes, hooks, types, and components.

5. **Real-Time Calculation Pattern**: Components use `useEffect` for immediate recalculation as per CLAUDE.md guidelines.

6. **Zod Validation Schemas**: Firm Data validation in `src/modules/core/firm-data/validation/schema.ts` is comprehensive.

### Areas for Improvement

1. **Test Coverage**: Only a few test files found. Critical paths need more coverage.

2. **Backup Folders**: Folders like `risk-assessment-backup-20251016` and `wind-down-backup-20251016` should be removed from the codebase.

3. **Dead Code**: File `KTCDCalculatorMainOld.tsx` should be removed.

---

## Architecture Notes

### Integration Completeness

Per the CLAUDE.md integration map, the following modules are NOT fully integrated:

| Module | Status | Issue |
|--------|--------|-------|
| Wind-Down | Incomplete | No database integration (TODO comments) |
| OFAR | Incomplete | Component doesn't use API for persistence |
| Financial Data API | Broken | Missing multi-tenancy |
| Stress Testing API | Missing | No API route found for OFAR integration |

### Recommended Integration Priority

1. **Immediate**: Fix multi-tenancy in Financial Data API
2. **High**: Complete Wind-Down database integration
3. **High**: Wire OFAR component to its API route
4. **Medium**: Create Stress Testing API for OFAR integration

---

## Summary of Findings by Severity

| Severity | Count | Action Required |
|----------|-------|-----------------|
| Critical (90-100%) | 3 | Immediate fix required |
| Important (80-89%) | 4 | Fix before production |
| Medium (70-79%) | 3 | Plan for next sprint |

---

## Files Requiring Immediate Attention

1. **`src/app/api/core/financial-data/route.ts`** - Add organizationId requirement and filtering
2. **`src/app/api/calculations/winddown/route.ts`** - Complete database integration with multi-tenancy
3. **`src/modules/calculators/ofar/components/OFARCalculatorMain.tsx`** - Wire to API for persistence

---

## Next Steps

1. Address the 3 critical multi-tenancy issues before any production deployment
2. Schedule integration sprint for OFAR ↔ component wiring
3. Clean up backup folders and dead code
4. Consider adding integration tests for critical data flows

---

**Report generated by**: Claude Code (code-reviewer agent)
**Agent ID**: ac577cd
