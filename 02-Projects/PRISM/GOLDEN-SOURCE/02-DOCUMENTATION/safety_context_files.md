# Migration Safety & Context Files Structure

## Essential .md Files for Each Module Migration

### 1. **file-operations-log.md**
```markdown
# File Operations Log: [Module Name]
**Migration Start**: [Date/Time]
**Current Status**: In Progress/Complete/Blocked

## File Movement History
| Date/Time | Action | From | To | Notes |
|-----------|--------|------|----|----- |
| 2025-01-03 14:30 | Copy | /src/modules/core/FORCalc_.html | /docs/modules/for-calculator/original/ | Golden source preserved |
| 2025-01-03 14:35 | Create | - | /packages/calculators/src/for/types.ts | Initial interfaces |
| 2025-01-03 15:00 | Modify | /packages/calculators/src/for/calculator.ts | - | Core logic implementation |

## Git Operations
| Date/Time | Branch | Commit | Status |
|-----------|--------|---------|--------|
| 2025-01-03 14:30 | feature/for-calculator-migration | abc123f | Created branch |
| 2025-01-03 16:00 | feature/for-calculator-migration | def456a | Initial implementation |

## Rollback Points
- **Safe State 1**: feature/for-calculator-migration@abc123f - Basic setup
- **Safe State 2**: feature/for-calculator-migration@def456a - Working calculator
```

### 2. **design-standards.md**
```markdown
# Design Standards: HTML to TypeScript Migration
**Principle**: Preserve existing HTML styling exactly - NO design exploration during migration

## Locked Design Elements

### Color Scheme (From HTML Prototypes)
- **Primary Blue**: #2a5298
- **Secondary Blue**: #1e3c72  
- **Success Green**: #28a745
- **Warning Orange**: #fd7e14
- **Error Red**: #dc3545
- **Background**: Linear gradient (135deg, #1e3c72 0%, #2a5298 100%)

### Typography
- **Headers**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Body Text**: Same font family
- **Monospace**: 'Courier New', monospace (for calculations)

### Layout Standards
- **Form Sections**: White background, rounded corners (15px), shadow
- **Input Fields**: 12px padding, 2px border, 8px border-radius
- **Buttons**: Gradient background, 15px padding, 8px border-radius
- **Results Display**: Highlighted boxes with clear visual hierarchy

### Component Behavior
- **Real-time Calculation**: Updates as user types (preserve HTML behavior)
- **Form Validation**: Immediate feedback with red borders
- **Success States**: Green checkmarks and success messages
- **Loading States**: Preserve HTML loading indicators

## Migration Rule: NO DESIGN CHANGES
- Copy HTML CSS exactly to React components
- Use Tailwind classes that match existing styles
- NO color experiments, layout changes, or "improvements"
- Focus 100% on calculation logic accuracy

## Post-Migration Design Improvements
*Save for Phase 2 - after all calculations validated*
- Consider modern design system
- Evaluate accessibility improvements  
- Review mobile responsiveness
- User experience enhancements
```

### 3. **migration-checklist.md**
```markdown
# Migration Checklist: [Module Name]

## Pre-Migration Setup
- [ ] HTML file copied to `/docs/modules/[module]/original/`
- [ ] Migration workspace created in `/docs/modules/[module]/migration/`
- [ ] Git branch created: `feature/[module]-migration`
- [ ] Context files prepared
- [ ] Test data extracted from HTML

## Implementation Phase
- [ ] TypeScript interfaces defined
- [ ] Core calculation logic implemented
- [ ] Input validation with Zod schemas
- [ ] Error handling implemented
- [ ] Constants and regulatory values defined

## Testing Phase
- [ ] Unit tests for calculation logic
- [ ] Cross-validation tests vs HTML
- [ ] Edge case testing
- [ ] Performance benchmarks met (<100ms)
- [ ] Regulatory compliance verified

## Integration Phase
- [ ] React component implemented
- [ ] Form validation working
- [ ] Real-time calculations functional
- [ ] Export functionality preserved
- [ ] Integration tests passing

## Validation Phase
- [ ] All HTML test cases pass
- [ ] Calculation outputs match exactly
- [ ] Error handling matches HTML behavior
- [ ] Performance requirements met
- [ ] Code review completed

## Deployment Phase
- [ ] Branch merged to main
- [ ] Documentation updated
- [ ] Migration log completed
- [ ] Stakeholder validation
- [ ] Migration marked complete
```

### 4. **rollback-procedures.md**
```markdown
# Rollback Procedures: [Module Name]

## Emergency Rollback Commands
```bash
# Immediate rollback to main branch
git checkout main
git branch -D feature/[module]-migration  # Delete failed migration

# Rollback to specific safe state
git checkout feature/[module]-migration
git reset --hard [safe-commit-hash]

# Rollback file changes only
git checkout HEAD~1 -- [specific-file]
```

## Rollback Decision Matrix
| Scenario | Action | Recovery Time |
|----------|--------|---------------|
| Calculation discrepancy found | Rollback to last validated state | 5 minutes |
| Performance issues | Rollback implementation, keep tests | 10 minutes |
| Integration failures | Rollback to calculation-only state | 15 minutes |
| Complete failure | Delete branch, restart from HTML | 30 minutes |

## Safe States Documentation
- **State 1**: Basic setup - interfaces only
- **State 2**: Core calculation working
- **State 3**: Full React component
- **State 4**: Integrated and tested

## Recovery Contacts
- **Technical Issues**: Use git recovery procedures
- **Business Logic Questions**: Reference original HTML + regulatory docs
- **Architecture Questions**: Review architecture-context.md
```

### 5. **regulatory-references.md**
```markdown
# Regulatory References: [Module Name]

## Primary MiFIDPRU References
- **Section**: [Specific regulation section]
- **Requirement**: [Exact regulatory requirement]
- **Implementation**: [How HTML calculator implements this]
- **Validation**: [How to verify compliance]

## Key Regulatory Constraints
- **Calculation Methodology**: Must match MiFIDPRU specification exactly
- **Rounding Rules**: Preserve existing HTML rounding behavior
- **Audit Trail**: Maintain complete calculation history
- **Data Validation**: Implement all regulatory data checks

## Compliance Verification
- [ ] Calculation methodology matches regulation
- [ ] Test cases include regulatory examples
- [ ] Audit trail preserved
- [ ] Data validation comprehensive

## Expert Consultation Required
- Complex regulatory interpretations
- Edge case regulatory treatment
- Industry standard practices
- Compliance verification procedures
```

### 6. **test-data-sets.md**
```markdown
# Test Data Sets: [Module Name]

## Golden Test Cases (From HTML)
### Test Case 1: Basic Calculation
**Input**:
```json
{
  "description": "Standard granular calculation",
  "input": {
    // Exact input data from HTML testing
  },
  "expectedOutput": {
    // Exact output from HTML calculator
  },
  "htmlScreenshot": "test-case-1-html.png",
  "regulatoryReference": "MiFIDPRU 4.5.1"
}
```

### Test Case 2: Edge Cases
**Zero Values**: 
**Maximum Values**:
**Invalid Inputs**:
**Boundary Conditions**:

## Performance Benchmarks
- **Standard Calculation**: <10ms
- **Complex Scenario**: <50ms  
- **Edge Case**: <25ms
- **Memory Usage**: <1MB

## Cross-Validation Protocol
1. Run identical input through HTML calculator
2. Record exact output (screenshots + values)
3. Run through TypeScript implementation
4. Compare outputs exactly
5. Document any discrepancies
6. Fix TypeScript to match HTML exactly
```
