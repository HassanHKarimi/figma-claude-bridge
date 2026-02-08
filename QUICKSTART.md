# Quick Start Guide

Get up and running with Figma-Claude Bridge in 10 minutes.

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Figma desktop app installed
- [ ] Claude Desktop app installed
- [ ] 10 minutes of time

## Step 1: Build Everything (2 minutes)

```bash
# Clone or navigate to project
cd figma-claude-bridge

# Build plugin
cd plugin
npm install
npm run build
cd ..

# Build MCP server
cd mcp-server
npm install
npm run build
cd ..
```

## Step 2: Load Figma Plugin (1 minute)

1. Open Figma Desktop
2. **Plugins** → **Development** → **Import plugin from manifest**
3. Select: `figma-claude-bridge/plugin/manifest.json`
4. Right-click canvas → **Plugins** → **Development** → **Claude AI Bridge**
5. Plugin UI opens (leave it open)

## Step 3: Start MCP Server (1 minute)

```bash
cd mcp-server
npm start
```

Keep this terminal window open. You should see:
```
WebSocket server listening on port 3000
Waiting for Figma plugin to connect...
```

## Step 4: Connect Plugin to Server (30 seconds)

In the Figma plugin UI:
1. URL should show `ws://localhost:3000`
2. Click **Connect to MCP Server**
3. Status turns green: "Connected"
4. Click **Test Connection** to verify

## Step 5: Configure Claude Desktop (3 minutes)

### Find your config file:

**macOS:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```
notepad %APPDATA%\Claude\claude_desktop_config.json
```

### Add this configuration:

```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "node",
      "args": [
        "/REPLACE/WITH/FULL/PATH/figma-claude-bridge/mcp-server/dist/index.js"
      ]
    }
  }
}
```

### Get the full path:
```bash
cd mcp-server
pwd
# Copy the output and paste into config, adding /dist/index.js
```

### Restart Claude Desktop completely

## Step 6: Test with Claude (2 minutes)

Open Claude Desktop and try:

```
Can you list the available Figma tools?
```

Claude should show you all 14 Figma tools.

Then try:

```
Create a simple test in Figma:
1. Create a frame named "Test Frame"  
2. Add a blue rectangle inside it
3. Add text that says "Hello from Claude!"
```

Check Figma - you should see the elements!

## Verification Checklist

- [ ] Plugin shows "Connected" status
- [ ] MCP server terminal shows connection
- [ ] Claude Desktop lists Figma tools
- [ ] Test design appears in Figma

## Common Issues & Fixes

### "Not connected to Figma plugin"
- Make sure plugin is open in Figma
- Click "Connect to MCP Server" in plugin
- Check server is running (`npm start`)

### Claude doesn't see tools
- Verify config path is absolute (no `~`)
- Completely quit and restart Claude Desktop
- Check config JSON is valid

### Changes don't appear in Figma
- Check plugin Activity Log for errors
- Verify you're on correct Figma page
- Try creating a fresh frame first

## What's Next?

### Try These Commands in Claude:

**Simple shapes:**
```
Create a mobile app screen with:
- Header with app name
- Three feature cards in a row
- A blue call-to-action button
```

**Landing page:**
```
Design a hero section with:
- Dark background
- Large headline "Welcome"
- Email signup form
- Modern, clean design
```

**Component:**
```
Create a reusable button component with:
- Rounded corners
- Blue background
- White text saying "Get Started"
- Proper padding
```

### Explore Examples:

Check out `EXAMPLES.md` for:
- Complete mobile app screens
- Landing page sections
- Design system setup

### Learn Best Practices:

Read `skill/SKILL.md` for:
- Design patterns
- Auto Layout tips
- Component strategies
- Common workflows

## Daily Workflow

1. **Start Server:**
   ```bash
   cd mcp-server && npm start
   ```

2. **Open Figma Plugin:**
   - Right-click → Plugins → Development → Claude AI Bridge
   - Click "Connect"

3. **Design with Claude:**
   - Ask Claude to create designs
   - Iterate and refine
   - Export when ready

4. **Done for the day:**
   - Can close plugin
   - Stop server (Ctrl+C)

## Tips

- **Name everything clearly** - Makes it easier for Claude to reference
- **Use frames for organization** - Everything in frames
- **Start simple** - Get comfortable with basic shapes first
- **Check the plugin Activity Log** - See what's happening
- **Use Auto Layout** - Makes designs responsive

## Getting Help

1. Check plugin Activity Log for errors
2. Review terminal output from MCP server
3. Verify each component works independently
4. Check INSTALLATION.md for detailed troubleshooting

## You're Ready! 🎉

Start designing with Claude in Figma. The possibilities are endless!

Try building:
- Landing pages
- Mobile app screens
- Email templates
- Social media graphics
- Design systems
