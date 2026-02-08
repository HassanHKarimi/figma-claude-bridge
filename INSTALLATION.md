# Installation Guide

Complete setup instructions for the Figma-Claude Bridge system.

## Prerequisites

- Node.js 18+ and npm
- Figma desktop app or Figma in browser
- Claude Desktop app (for MCP server integration)

## Part 1: Install Figma Plugin

### 1. Build the Plugin

```bash
cd plugin
npm install
npm run build
```

This creates a `dist` folder with the compiled plugin.

### 2. Load Plugin into Figma

**In Figma Desktop:**
1. Open Figma
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to `figma-claude-bridge/plugin/manifest.json`
4. Select the manifest file

**In Figma Web:**
1. Same steps as desktop
2. Note: Web version may have network restrictions

### 3. Verify Plugin Loaded

1. Right-click in Figma canvas
2. **Plugins** → **Development** → **Claude AI Bridge**
3. Plugin UI should open showing "Waiting for connection..."

## Part 2: Install MCP Server

### 1. Build the MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### 2. Test Server Standalone

```bash
npm start
```

You should see:
```
WebSocket server listening on port 3000
Waiting for Figma plugin to connect...
MCP server running
```

Keep this running and proceed to connect the plugin.

### 3. Connect Plugin to Server

1. In Figma, open the Claude AI Bridge plugin
2. The default URL `ws://localhost:3000` should be shown
3. Click **Connect to MCP Server**
4. Status should change to "Connected" with green indicator

### 4. Test the Connection

1. Click **Test Connection** button in plugin UI
2. Check the Activity Log for ping/pong messages
3. In terminal, you should see connection logs

## Part 3: Configure Claude Desktop

### 1. Locate Claude Desktop Config

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

### 2. Add MCP Server Configuration

Edit the config file:

```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "node",
      "args": [
        "/absolute/path/to/figma-claude-bridge/mcp-server/dist/index.js"
      ]
    }
  }
}
```

**Important:** Replace `/absolute/path/to/` with your actual path!

To get the absolute path:
```bash
cd mcp-server
pwd
```

### 3. Restart Claude Desktop

Completely quit and restart Claude Desktop app.

### 4. Verify MCP Connection

In Claude Desktop:
1. Start a new conversation
2. Type: "Can you list available Figma tools?"
3. Claude should list all the Figma design tools

## Part 4: Optional - Install Claude Skill

### 1. Create Skill in Claude

1. Open Claude Desktop
2. Go to Settings → Skills
3. Click **Create New Skill**
4. Name it "Figma Design"
5. Copy contents of `skill/SKILL.md` into the skill editor
6. Save

### 2. Test the Skill

Ask Claude:
```
Using the Figma Design skill, create a simple mobile app screen
```

## Troubleshooting

### Plugin Won't Load
- Check that `manifest.json` is valid JSON
- Verify `dist` folder contains compiled code
- Try rebuilding: `npm run clean && npm run build`

### Plugin Can't Connect to Server
- Verify server is running: `npm start` in mcp-server directory
- Check port 3000 is not in use: `lsof -i :3000` (macOS/Linux)
- Check firewall settings
- Try different port (update in both plugin UI and server code)

### Claude Can't See Figma Tools
- Verify config path is correct
- Check absolute path in config (no `~` or relative paths)
- Restart Claude Desktop completely
- Check Claude Desktop logs for errors

### Operations Fail
- Ensure plugin is connected (green indicator)
- Check Activity Log in plugin for errors
- Verify Figma file is open and editable
- Some operations require specific node types

## Development Mode

### Plugin Development
Watch mode for automatic rebuilds:
```bash
cd plugin
npm run dev
```

After changes:
1. Save files
2. In Figma: Plugins → Development → Reload plugin

### MCP Server Development
Watch mode:
```bash
cd mcp-server
npm run dev
```

Restart server after changes:
1. Stop server (Ctrl+C)
2. `npm start`

### Testing Changes

Create a test Figma file and use Claude to:
```
Create a test frame named "Test Frame"
Add a rectangle with blue color
Add text that says "Testing"
Get document info
```

## Production Deployment

### Option 1: Local Development (Recommended for Personal Use)
Keep running as described above. Start MCP server when needed.

### Option 2: Background Service

**macOS - LaunchAgent:**
Create `~/Library/LaunchAgents/com.figma-claude-bridge.plist`

**Linux - systemd:**
Create service file for automatic startup

### Option 3: Published Plugin
Submit to Figma Community (requires review)

## Next Steps

1. ✅ Everything installed and connected
2. Try example designs from README
3. Create landing page designs
4. Build component library
5. Explore advanced Auto Layout patterns

## Getting Help

- Check Activity Log in plugin for errors
- Review server terminal output
- Test each component independently
- Verify all paths are absolute in configs
