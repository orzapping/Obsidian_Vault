# PRISM UI Standardization Task
## Automated Execution with Auto-Accept

### CONTEXT
The PRISM platform has inconsistent UI/CSS across modules due to different migration approaches. Your task is to analyze all existing modules and create then apply a consistent design system based on the Aurora UI theme.

### REFERENCE UI FILE
Use `/home/obsidan/Downloads/ra-calculator-aurora-ui.html` as your primary design reference. This file contains the approved Aurora theme with:
- Dark glassmorphism design
- Gradient backgrounds and text
- Sophisticated color palette
- Professional financial services aesthetic

### PHASE 1: ANALYSIS (Do First)
Scan ALL modules in `/src/modules/` and document:
1. All unique color values used (hex, rgb, tailwind classes)
2. All spacing patterns (padding, margin values)
3. All component patterns (cards, forms, buttons, inputs)
4. All typography styles
5. Border radius, shadows, and effects

Focus especially on these successfully styled modules as reference:
- firm-data (if it has good styling)
- financial-data (if it has good styling)
- for-calculator (check this one)

### PHASE 2: DESIGN SYSTEM CREATION (Aurora Theme)
Extract and formalize the Aurora theme from the reference file into a centralized design system:

```typescript
// src/styles/aurora-design-system.ts
export const auroraDesignSystem = {
  // Aurora Theme Colors
  colors: {
    background: {
      primary: '#0b1720', // Main dark bg
      secondary: '#08121b', 
      tertiary: '#070b13',
      card: 'rgba(13, 25, 36, 0.45)', // Glassmorphism
      input: 'rgba(11, 23, 32, 0.9)'
    },
    text: {
      primary: '#e0f2f1',
      secondary: '#94a3b8',
      muted: '#64748b'
    },
    accent: {
      cyan: '#06b6d4',
      emerald: '#10b981',
      blue: '#3b82f6',
      amber: '#f59e0b',
      violet: '#8b5cf6',
      rose: '#ec4899'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #06b6d4, #10b981)',
      text: 'from-cyan-300 to-emerald-400',
      background: 'radial-gradient(1200px circle at 10% 10%, #0b1720 0%, #08121b 40%, #070b13 100%)'
    },
    borders: {
      default: 'rgba(45, 212, 191, 0.18)',
      hover: 'rgba(6, 182, 212, 0.35)',
      focus: '#06b6d4'
    }
  },
  
  // Component Styles
  components: {
    card: `
      bg-[rgba(13,25,36,0.45)] 
      border border-[rgba(45,212,191,0.18)] 
      rounded-2xl 
      backdrop-blur-[10px] 
      shadow-[0_8px_24px_rgba(0,0,0,0.35)]
      hover:translate-y-[-2px] 
      hover:shadow-[0_14px_28px_rgba(0,0,0,0.45)]
      hover:border-[rgba(6,182,212,0.35)]
      transition-all duration-300
    `,
    input: `
      bg-[rgba(11,23,32,0.9)] 
      border border-[rgba(45,212,191,0.18)] 
      text-[#e0f2f1]
      rounded-lg 
      w-full 
      px-3 py-3
      focus:bg-[rgba(6,16,24,0.95)]
      focus:border-cyan-500
      focus:shadow-[0_0_0_3px_rgba(6,182,212,0.18)]
      focus:outline-none
      transition-all duration-200
    `,
    button: {
      primary: `
        bg-gradient-to-r from-cyan-500 to-emerald-500
        hover:from-cyan-400 hover:to-emerald-400
        text-white 
        font-semibold
        px-6 py-3 
        rounded-lg
        shadow-lg hover:shadow-[0_7px_18px_rgba(6,182,212,0.32)]
        hover:translate-y-[-1px]
        transition-all duration-300
      `,
      secondary: `
        bg-[rgba(6,182,212,0.12)]
        border border-cyan-500/30
        text-cyan-300
        hover:bg-[rgba(6,182,212,0.2)]
        px-6 py-3
        rounded-lg
        transition-all duration-200
      `
    },
    heading: {
      h1: 'text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-400',
      h2: 'text-2xl md:text-3xl font-bold text-cyan-300',
      h3: 'text-xl md:text-2xl font-bold text-cyan-400'
    }
  },
  
  // Effects
  effects: {
    glassmorphism: 'backdrop-blur-[10px] bg-opacity-45',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    borderGradient: 'bg-gradient-to-r from-cyan-500 to-emerald-500'
  }
}
```

### PHASE 3: SYSTEMATIC APPLICATION
Apply the design system to EVERY module systematically:

1. Create a shared components library:
   - `src/components/ui/Card.tsx`
   - `src/components/ui/Button.tsx`
   - `src/components/ui/Input.tsx`
   - `src/components/ui/FormGroup.tsx`

2. For each module in src/modules/:
   - Replace inline styles with design system classes
   - Replace repeated component patterns with shared components
   - Ensure consistent spacing and layout
   - Maintain the EXISTING color scheme (don't introduce new colors)

### PHASE 4: QUALITY CHECKS
After standardizing each module:
1. Verify all calculators still function
2. Check responsive behavior
3. Ensure forms validate properly
4. Confirm results display correctly

### CONSTRAINTS & REQUIREMENTS
- APPLY the Aurora theme from the reference file consistently
- MAINTAIN all existing functionality intact
- USE Tailwind classes with custom values where needed
- CREATE shared components for repeated patterns
- ENSURE dark theme compatibility throughout
- IMPLEMENT glassmorphism effects on cards/modals
- ADD gradient text effects for headings
- APPLY proper backdrop filters for depth
- ENSURE high contrast for accessibility (WCAG AA minimum)
- TEST all form inputs remain functional with new styling

### ADDITIONAL CONSIDERATIONS
1. **Font**: Use Inter font family (add Google Fonts import)
2. **Dark Background**: Apply the radial gradient background to all pages
3. **Cards**: All cards should have glassmorphism effect
4. **Inputs**: Dark theme inputs with cyan focus states
5. **Buttons**: Gradient primary buttons, subtle secondary buttons
6. **Colors**: Cyan/Emerald as primary accent colors
7. **Borders**: Subtle semi-transparent borders with glow on hover
8. **Animations**: Smooth transitions (300ms default)
9. **Shadows**: Deep shadows for depth in dark theme
10. **Risk Categories**: Maintain color coding for different risk types

### OUTPUT REQUIRED
1. Design system file created
2. Shared UI components created  
3. All modules updated to use consistent styling
4. Summary report of changes made

### AUTO-ACCEPT MODE
I'm running with auto-accept. Make all necessary changes without asking for approval. Proceed systematically through all modules.

Begin with Phase 1 analysis immediately.