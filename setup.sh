#!/bin/bash

# Figma-Claude Bridge Setup Script
# Automates the build process for both plugin and MCP server

set -e  # Exit on error

echo "🚀 Figma-Claude Bridge Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Build Plugin
echo "📦 Building Figma Plugin..."
cd plugin
echo "   Installing dependencies..."
npm install --silent
echo "   Compiling TypeScript..."
npm run build
echo "✅ Plugin built successfully"
echo ""

# Build MCP Server
echo "📦 Building MCP Server..."
cd ../mcp-server
echo "   Installing dependencies..."
npm install --silent
echo "   Compiling TypeScript..."
npm run build
echo "✅ MCP Server built successfully"
echo ""

# Get absolute path for config
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_PATH="$SCRIPT_DIR/mcp-server/dist/index.js"

echo "=============================="
echo "✅ Build Complete!"
echo "=============================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Load Plugin in Figma:"
echo "   - Plugins → Development → Import plugin from manifest"
echo "   - Select: $SCRIPT_DIR/plugin/manifest.json"
echo ""
echo "2. Start MCP Server:"
echo "   cd mcp-server && npm start"
echo ""
echo "3. Configure Claude Desktop:"
echo "   Add this to your claude_desktop_config.json:"
echo ""
echo "   {"
echo "     \"mcpServers\": {"
echo "       \"figma-bridge\": {"
echo "         \"command\": \"node\","
echo "         \"args\": [\"$MCP_PATH\"]"
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "   Config location:"
echo "   macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
echo "   Linux: ~/.config/Claude/claude_desktop_config.json"
echo ""
echo "4. Restart Claude Desktop completely"
echo ""
echo "See QUICKSTART.md for detailed instructions!"
echo ""
