# PRISM - Technical Gotchas

> **Purpose**: Document pitfalls, lessons learned, and things that have bitten us before. Check this before making changes.

**Last Updated**: December 29, 2025

---

## Critical Gotchas

### 1. ALWAYS Use Inline Tailwind Classes

**Problem**: Custom CSS classes (like `modal-overlay`, `card-container`) don't exist in this codebase.

**Symptom**: Styling doesn't work, components appear unstyled.

**Solution**: Always use inline Tailwind classes directly on elements.

```tsx
// WRONG - Will break styling
<div className="modal-overlay">
<div className="modal-content">

// CORRECT - Use inline Tailwind
<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
<div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl">
```

---

### 2. ALWAYS Filter by organizationId

**Problem**: Multi-tenancy data isolation fails if organizationId is not included.

**Symptom**: Data bleeds across organizations, or API returns empty results.

**Solution**: Every database query MUST include `organizationId` filter.

```typescript
// WRONG
const data = await prisma.calculation.findFirst({
  where: { isCurrentVersion: true }
})

// CORRECT
const data = await prisma.calculation.findFirst({
  where: {
    organizationId,
    isCurrentVersion: true
  }
})
```

---

### 3. Check isCurrentVersion for Calculations

**Problem**: Old calculation versions get fetched instead of current.

**Symptom**: Outdated data appears after saving new calculations.

**Solution**: Always include `isCurrentVersion: true` when fetching the active record.

```typescript
// CORRECT
const current = await prisma.forCalculation.findFirst({
  where: {
    organizationId,
    isCurrentVersion: true
  },
  orderBy: { createdAt: 'desc' }
})
```

---

### 4. Use isHydratingRef to Prevent Auto-Save During Load

**Problem**: Forms immediately save empty/default values on initial load.

**Symptom**: Database gets overwritten with empty data when opening a form.

**Solution**: Use a ref to block saves during hydration.

```typescript
const isHydratingRef = useRef(true)

useEffect(() => {
  const loadData = async () => {
    const data = await fetchData()
    setFormState(data)

    // Allow a tick for state to settle
    setTimeout(() => {
      isHydratingRef.current = false
    }, 100)
  }
  loadData()
}, [])

// In save logic
const handleSave = () => {
  if (isHydratingRef.current) return  // Don't save during hydration
  // ... save logic
}
```

---

### 5. Trust Browser Console Over Build Errors

**Problem**: Next.js build can show phantom errors that don't affect runtime.

**Symptom**: Build fails with type errors, but app works perfectly in browser.

**Solution**:
1. Check browser console first
2. If app works in browser, the build errors may be stale cache
3. Run `rm -rf .next` if persistent phantom errors

**Quote from lessons learned**: "You could end up chasing a ghost and rearranging furniture for no reason."

---

### 6. Avoid React Fragments in Some Contexts

**Problem**: `<>...</>` or `<React.Fragment>` causes syntax errors in some files.

**Symptom**: Cryptic syntax errors when using fragment shorthand.

**Solution**: Use plain `<div>` wrappers instead of fragments when issues arise.

---

### 7. Never Hardcode Organization IDs

**Problem**: Using "temp-org-id" or hardcoded values breaks multi-tenancy.

**Symptom**: All data goes to same "test" organization, cross-tenant issues.

**Solution**: Always pass real organizationId from parent components or context.

---

### 8. Version Records Before Creating New Ones

**Problem**: Creating new records without versioning leaves orphan "current" records.

**Symptom**: Multiple records marked as `isCurrentVersion: true`.

**Solution**: Follow the versioning pattern:

```typescript
// 1. Find current version
const current = await prisma.model.findFirst({
  where: { organizationId, isCurrentVersion: true }
})

// 2. Mark it as superseded
if (current) {
  await prisma.model.update({
    where: { id: current.id },
    data: {
      isCurrentVersion: false,
      supersededAt: new Date()
    }
  })
}

// 3. Create new version
const newRecord = await prisma.model.create({
  data: { ...data, isCurrentVersion: true }
})
```

---

### 9. Real-Time Calculation Pattern (No Calculate Buttons)

**Problem**: Users expect instant feedback, not "Calculate" button clicks.

**Symptom**: Confusing UX where changes don't reflect until button clicked.

**Solution**: Use useEffect to trigger calculation on any input change.

```typescript
useEffect(() => {
  if (isHydratingRef.current) return  // Skip during load

  const result = calculateValue(input1, input2, input3)
  setResult(result)
}, [input1, input2, input3])
```

---

### 10. Modal Click Propagation

**Problem**: Clicking inside modal closes it because click propagates to overlay.

**Symptom**: Modal closes unexpectedly when interacting with content.

**Solution**: Stop propagation on the modal content div.

```tsx
<div
  className="fixed inset-0 z-50 bg-black/70"
  onClick={closeModal}  // Overlay click closes
>
  <div
    className="modal-content"
    onClick={e => e.stopPropagation()}  // Content click doesn't close
  >
    {/* Modal content */}
  </div>
</div>
```

---

## Performance Gotchas

### Large Component Files

The Stress Testing module has files with 16,000+ lines. These can:
- Slow down IDE
- Make context window management difficult
- Be hard to maintain

Consider: Component splitting for very large modules.

---

## Database Gotchas

### JSON Fields

Many models use JSON fields for flexible data (e.g., `calculatorStates`, `rtmFactors`).

**Remember**:
- JSON is not type-checked by Prisma
- Need manual validation/parsing
- Can't query inside JSON efficiently

---

## Add New Gotchas Here

When you encounter a new pitfall:
1. Document the problem
2. Document the symptom
3. Document the solution
4. Add it to this file

---

**Learn from the past. Don't repeat mistakes.**
