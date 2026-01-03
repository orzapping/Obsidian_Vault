---
date: {{date}}
type: bug-investigation
severity: critical|high|medium|low
status: investigating|identified|fixed|wontfix
project:
module:
tags: bug
---

# 🐛 Bug Investigation: {{title}}

## 📋 Bug Details

| Field | Value |
|-------|-------|
| **Bug ID** | |
| **Date Reported** | {{date}} |
| **Reported By** | |
| **Severity** | Critical / High / Medium / Low |
| **Status** | 🔴 Investigating / 🟡 Identified / 🟢 Fixed |
| **Project** | [[]] |
| **Module** | |
| **Environment** | Production / Staging / Development |

---

## 🔍 Problem Description

### User Report
> *What the user/system reported*

### Expected Behavior

### Actual Behavior

### Impact
- **Users Affected**:
- **Business Impact**:
- **Data Impact**:

---

## 🕵️ Investigation

### Reproduction Steps
1.
2.
3.
4.

### Can Reproduce?
- [ ] Locally
- [ ] Staging
- [ ] Production

### Error Messages
```
[Paste error messages/stack traces here]
```

### Relevant Logs
```log
[Paste relevant log entries]
```

---

## 🔬 Root Cause Analysis

### Timeline
- **First Occurrence**:
- **Pattern**: Intermittent / Consistent / Increasing
- **Trigger**:

### Code Investigation

#### File 1: `/Development/.../file.ts`
```typescript
// Line numbers and problematic code
```

**Issue**:

#### File 2: `/Development/.../file.ts`
```typescript
// Line numbers and problematic code
```

**Issue**:

### Root Cause
> *The actual underlying problem*

### Why It Happened (5 Whys)
1. Why?
2. Why?
3. Why?
4. Why?
5. Why?

---

## 💊 Solution

### Proposed Fix
```typescript
// Code fix here
```

### Files to Modify
- [ ] `/Development/.../file1.ts` - [Description of change]
- [ ] `/Development/.../file2.ts` - [Description of change]
- [ ] `/Development/.../tests/test.ts` - [Add test case]

### Alternative Solutions Considered
1. **Option A**:
   - Pros:
   - Cons:
   - Rejected because:

2. **Option B**:
   - Pros:
   - Cons:
   - Rejected because:

---

## 🧪 Testing

### Test Cases Added
- [ ] Unit test for edge case
- [ ] Integration test for workflow
- [ ] Regression test

### Test Code
```typescript
// New test cases
```

### Verification Steps
1.
2.
3.

---

## 📈 Prevention

### Immediate Actions
- [ ] Fix the bug
- [ ] Add tests
- [ ] Update documentation

### Long-term Prevention
- [ ] Code review process update
- [ ] Monitoring/alerting improvement
- [ ] Architecture change needed

### Lessons Learned
-

---

## 🔗 References

### Related Issues
- [[]]

### Code Links
- Bug location: `file:///home/obsidan/Development/.../file.ts#L45`
- Fix PR: [#]()
- Commit: ``

### Documentation Updates Needed
- [ ] API docs
- [ ] README
- [ ] Internal wiki

---

## 📅 Timeline

| Date | Action | By |
|------|--------|-----|
| {{date}} | Bug reported | |
| | Investigation started | |
| | Root cause identified | |
| | Fix implemented | |
| | Fix deployed | |
| | Verified in production | |

---

## ✅ Resolution

### Fix Summary

### Deployment
- **Branch**: `bugfix/`
- **PR**: [#]()
- **Deployed**: [Date/Time]
- **Verified By**:

### Post-Mortem Actions
- [ ] Team retrospective
- [ ] Process improvement
- [ ] Documentation update

---

*Status: {{status}}*
*Last Updated: {{date}}*

[[Bug-Tracker]] | [[Project-Hub]] | [[Home]]