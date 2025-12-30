# PRISM Component Patterns

## Standard Module Component Structure
```typescript
// Main Calculator Component
export default function ModuleCalculator() {
  const [data, setData] = useState<ModuleData>(initialData)
  const calculations = useModuleCalculations(data)
  
  return (
    <div className="space-y-6">
      <ModuleForm data={data} onChange={setData} />
      <ModuleResults calculations={calculations} />
    </div>
  )
}
```

## Form Component Pattern
```typescript
interface ModuleFormProps {
  data: ModuleData
  onChange: (data: ModuleData) => void
}

export function ModuleForm({ data, onChange }: ModuleFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Input</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form fields */}
      </CardContent>
    </Card>
  )
}
```

## Aurora UI Card Pattern
```typescript
// Always use Card component with Aurora theme
<Card className="bg-[rgba(13,25,36,0.45)] border-[rgba(45,212,191,0.18)]">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```