# Figma-Claude Bridge

A complete system that gives Claude AI full design capabilities in Figma through a plugin + MCP server architecture.

## Architecture

```
Claude AI ↔ MCP Server ↔ Figma Plugin ↔ Figma Document
```

## Components

### 1. Figma Plugin (`/plugin`)
- Runs inside Figma with full Plugin API access
- WebSocket server for real-time communication
- Complete design operations: create, read, update, delete
- Auto Layout, components, styles, effects support

### 2. MCP Server (`/mcp-server`)
- Node.js MCP server following Anthropic's spec
- Communicates with Figma plugin via WebSocket
- Exposes design operations as MCP tools
- Handles authentication and connection management

### 3. Claude Skill (`/skill`)
- Optimized prompting patterns for design tasks
- Examples and best practices
- Common design operations library

## Capabilities

### Design Operations
- ✅ Create frames, shapes, text, components
- ✅ Modify properties (position, size, color, effects)
- ✅ Work with Auto Layout and constraints
- ✅ Create and apply styles
- ✅ Export assets (PNG, SVG, PDF)
- ✅ Navigate and query design structure

### Advanced Features
- Component creation and variants
- Design system generation
- Batch operations
- Design analysis and suggestions
- Asset management

## Quick Start

### 1. Install Figma Plugin
```bash
cd plugin
npm install
npm run build
```
Then in Figma: Plugins → Development → Import plugin from manifest

### 2. Start MCP Server
```bash
cd mcp-server
npm install
npm start
```

### 3. Configure Claude
Add the MCP server to your Claude Desktop config:
```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

### 4. Use Claude Skill (Optional)
Import the skill into Claude for optimized design prompting patterns.

## Example Usage

```
Claude: Create a mobile app screen with a header, search bar, and card list

→ MCP Server receives request
→ Plugin creates frame with Auto Layout
→ Adds components with proper spacing
→ Applies design system styles
→ Returns design URL
```

## Development

### Plugin Development
```bash
cd plugin
npm run dev  # Watch mode with hot reload
```

### MCP Server Development
```bash
cd mcp-server
npm run dev  # Watch mode with TypeScript compilation
```

## Project Structure

```
figma-claude-bridge/
├── plugin/              # Figma plugin source
│   ├── src/
│   │   ├── code.ts     # Main plugin logic
│   │   ├── ui.html     # Plugin UI (if needed)
│   │   └── server.ts   # WebSocket server
│   ├── manifest.json
│   └── package.json
├── mcp-server/         # MCP server
│   ├── src/
│   │   ├── index.ts    # MCP server entry
│   │   ├── tools/      # MCP tool definitions
│   │   └── client.ts   # Figma plugin client
│   └── package.json
├── skill/              # Claude skill
│   └── SKILL.md
└── README.md
```

## Use Cases

### Design Tasks
- Rapid prototyping
- Design system creation
- Asset generation at scale
- Design QA and consistency checks
- Automated design documentation

## License

MIT

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.
