# MCP Setup - Phase 4A: Core Server Installation
## Step by Step with Checkpoints

---

## STEP 1: Check Prerequisites (2 mins)

Let's verify what we have:

```bash
# Check Node.js
node --version  # Need 18+

# Check npm
npm --version   # Need 8+

# Check Python (backup option)
python3 --version  # Need 3.8+
```

**CHECKPOINT 1**: Tell me what versions you have

---

## STEP 2: Install MCP CLI Tools (5 mins)

### Option A: If Node.js 18+ is available
```bash
# Install the MCP CLI globally
npm install -g @modelcontextprotocol/create-server

# Verify installation
mcp-create-server --version
```

### Option B: If Node.js is older, use Python
```bash
# Install with pip
pip3 install mcp-server

# Verify installation  
mcp-server --version
```

**CHECKPOINT 2**: Which installation worked?

---

## STEP 3: Create MCP Configuration Directory (2 mins)

```bash
# Create the MCP config directory
mkdir -p ~/.config/claude/mcp-servers

# Create our context database location
mkdir -p /srv/prism-shared/.mcp-context/{db,patterns,sessions,state}

# Verify creation
ls -la ~/.config/claude/
ls -la /srv/prism-shared/.mcp-context/
```

**CHECKPOINT 3**: Directories created?

---

## STEP 4: Create PRISM Core Server (10 mins)

We'll create a simple server that understands your project:

```bash
# Create server directory
mkdir -p ~/.config/claude/mcp-servers/prism-core

# Navigate there
cd ~/.config/claude/mcp-servers/prism-core
```

Now create the server file:

```bash
cat > server.js << 'EOF'
const { MCPServer } = require('@modelcontextprotocol/server');
const fs = require('fs');
const path = require('path');

class PRISMCoreServer extends MCPServer {
  constructor() {
    super({
      name: 'prism-core',
      version: '1.0.0',
      description: 'PRISM Project Context Server'
    });
    
    this.projectRoot = '/home/obsidan/Development/PRISM-PRODUCTION/project-prism';
    this.sharedRoot = '/srv/prism-shared';
    this.contextDB = '/srv/prism-shared/.mcp-context/db/context.json';
  }

  async initialize() {
    console.log('PRISM Core Server starting...');
    await this.loadContext();
    console.log('Context loaded. Server ready!');
  }

  async loadContext() {
    // Load or create context
    if (fs.existsSync(this.contextDB)) {
      this.context = JSON.parse(fs.readFileSync(this.contextDB));
      console.log('Loaded existing context');
    } else {
      this.context = {
        project: 'PRISM',
        modules: [],
        patterns: {},
        preferences: {
          spelling: 'british',
          emojis: false,
          style: 'professional'
        },
        history: []
      };
      this.saveContext();
      console.log('Created new context');
    }
  }

  saveContext() {
    fs.writeFileSync(this.contextDB, JSON.stringify(this.context, null, 2));
  }
}

const server = new PRISMCoreServer();
server.start();
EOF
```

**CHECKPOINT 4**: Server file created?

---

## STEP 5: Create Configuration File (5 mins)

Create the main MCP config:

```bash
cat > ~/.config/claude/mcp_config.json << 'EOF'
{
  "servers": {
    "prism-core": {
      "command": "node",
      "args": ["~/.config/claude/mcp-servers/prism-core/server.js"],
      "env": {
        "PROJECT_ROOT": "/home/obsidan/Development/PRISM-PRODUCTION/project-prism",
        "SHARED_ROOT": "/srv/prism-shared"
      },
      "permissions": {
        "read": [
          "/home/obsidan/Development/PRISM-PRODUCTION",
          "/home/obsidan/Development/PRISM-SANDBOX",
          "/srv/prism-shared"
        ],
        "write": [
          "/home/obsidan/Development/PRISM-PRODUCTION/project-prism",
          "/home/obsidan/Development/PRISM-SANDBOX",
          "/srv/prism-shared/.mcp-context"
        ]
      }
    }
  },
  "defaultServer": "prism-core"
}
EOF
```

**CHECKPOINT 5**: Config created?

---

## STEP 6: Test Basic Server (3 mins)

```bash
# Test if server starts
cd ~/.config/claude/mcp-servers/prism-core
node server.js
```

You should see:
```
PRISM Core Server starting...
Created new context
Context loaded. Server ready!
```

Press Ctrl+C to stop.

**CHECKPOINT 6**: Did server start successfully?

---

## WHAT WE'VE BUILT SO FAR

If all checkpoints passed:
- ✅ MCP CLI tools installed
- ✅ Configuration directories created
- ✅ Basic PRISM server created
- ✅ Context database initialized
- ✅ Permissions configured

---

## READY FOR NEXT STEP?

Once this is working, we'll:
1. Add file system capabilities
2. Import your existing context
3. Test with real operations

But first, let's make sure each step worked!

**Run through Steps 1-6 and tell me at each checkpoint what happened!**