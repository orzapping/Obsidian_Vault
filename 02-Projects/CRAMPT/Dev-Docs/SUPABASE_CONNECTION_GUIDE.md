# Finding Your Supabase Connection String

## Step-by-Step Visual Guide

### Method 1: Via Settings (Recommended)

1. **Go to your Supabase Project Dashboard**
2. **Left sidebar** → Click ⚙️ **Settings** (bottom of sidebar)
3. **Settings menu** → Click **Database**
4. **Scroll down** to "Connection string" section (about halfway down the page)
5. You'll see a section that looks like this:

```
Connection string
┌─────────────────────────────────────────┐
│ Connection parameters                    │
│ URI                                      │  ← CLICK THIS
│ JDBC                                     │
│ .NET                                     │
└─────────────────────────────────────────┘
```

6. **Click "URI" tab**
7. You'll see a long string like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
8. **Click the copy button** (📋 icon) next to it

### Method 2: Via Project Settings

1. **Project Dashboard** → Click **Connect** button (top right, green button)
2. **Select "Postgres"** from the options
3. **Copy the connection string** shown

### What the Connection String Looks Like

Format:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Your specific one should be:
```
postgresql://postgres:[PASSWORD]@db.ftbeykyapikiugxrciqe.supabase.co:5432/postgres
```

Where:
- `postgres` = username
- `[PASSWORD]` = your database password (the one you created when making the project)
- `db.ftbeykyapikiugxrciqe.supabase.co` = your database host
- `5432` = port
- `postgres` = database name

### Connection Pooling vs Direct

Supabase offers two connection modes:

**Transaction/Pooled** (port 6543):
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Direct/Session** (port 5432):
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**For CRAMPT development, use DIRECT connection (port 5432)**

### If You Can't Find It

Try this in SQL Editor:
```sql
SELECT current_setting('listen_addresses');
```

Or just tell me what you see in Settings → Database and I'll help!
