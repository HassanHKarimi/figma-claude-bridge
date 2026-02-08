# Contributing to Figma Claude Bridge

Thank you for your interest in contributing!

## Local Development Setup

### Prerequisites
- Node.js v20+ (managed via nvm recommended)
- Claude Code (CLI)
- Figma Desktop App

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/figma-claude-bridge.git
   cd figma-claude-bridge
   ```

2. **Install dependencies**
   ```bash
   # Install plugin dependencies
   cd plugin
   npm install
   cd ..

   # Install MCP server dependencies
   cd mcp-server
   npm install
   cd ..
   ```

3. **Build the project**
   ```bash
   # Build plugin
   cd plugin
   npm run build
   cd ..

   # Build MCP server
   cd mcp-server
   npm run build
   cd ..
   ```

4. **Configure Claude Code (Optional)**

   Create `.claude/settings.local.json` for project-specific permissions:
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(npm install)",
         "Bash(npm run build:*)",
         "mcp__figma-claude-bridge__*"
       ]
     }
   }
   ```

5. **Follow installation instructions**

   See [INSTALLATION.md](./INSTALLATION.md) for complete setup with Figma and Claude Code.

## Project Structure

```
figma-claude-bridge/
├── plugin/          # Figma plugin code
│   ├── src/
│   │   ├── code.ts      # Main plugin logic
│   │   └── ui.html      # Plugin UI
│   └── manifest.json
├── mcp-server/      # MCP server implementation
│   └── src/
│       ├── index.ts     # Server entry point
│       └── tools/       # Figma tool implementations
├── skill/           # Claude Code skill integration
└── docs/            # Documentation
```

## Making Changes

1. Create a new branch for your feature/fix
2. Make your changes
3. Test thoroughly with both Figma and Claude Code
4. Submit a pull request

## Testing

Before submitting, ensure:
- Plugin builds without errors: `cd plugin && npm run build`
- MCP server builds without errors: `cd mcp-server && npm run build`
- Test the integration in Figma with Claude Code

## Questions?

Open an issue for questions or discussions!
