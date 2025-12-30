# PRISM Validation Patterns

## Standard Zod Schema Pattern
```typescript
import { z } from 'zod'

export const moduleSchema = z.object({
  // Numeric fields - ALWAYS with min/max
  amount: z.number()
    .min(0, 'Amount must be positive')
    .max(999999999, 'Amount too large'),
    
  // Percentage fields - 0 to 100
  rate: z.number()
    .min(0, 'Rate must be positive')
    .max(100, 'Rate cannot exceed 100%'),
    
  // Optional fields
  description: z.string().optional(),
  
  // Enum fields
  period: z.enum(['monthly', 'quarterly', 'annual']),
  
  // Nested objects
  details: z.object({
    category: z.string(),
    subcategory: z.string().optional()
  }).optional()
})

export type ModuleData = z.infer<typeof moduleSchema>
```

## Form Validation Hook Pattern
```typescript
export function useValidation(data: any, schema: ZodSchema) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  useEffect(() => {
    try {
      schema.parse(data)
      setErrors({})
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach(e => {
          if (e.path[0]) {
            newErrors[String(e.path[0])] = e.message
          }
        })
        setErrors(newErrors)
      }
    }
  }, [data, schema])
  
  return errors
}
```

## K-Factor Specific Validations
```typescript
// K-ASA: Assets must be non-negative
kasaAmount: z.number().min(0).max(999999999999),

// K-AUM: 3-month average required
kaumMonthly: z.array(z.number().min(0)).length(3),

// K-COH: Orders handled count
kcohCount: z.number().int().min(0),

// K-CMH: Client money with segregation flag
kcmhAmount: z.number().min(0),
kcmhSegregated: z.boolean()
```