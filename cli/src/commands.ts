/**
 * Command Registry
 *
 * Maps CLI command names to plugin message types.
 * Used for help text and validation. The actual execution
 * is generic — every command just sends { type, data } to the plugin.
 */

export interface CommandDef {
  /** Plugin message type (e.g., "create-frame") */
  type: string;
  /** Short description for help output */
  description: string;
  /** Category for grouped help */
  category: string;
}

export const commands: CommandDef[] = [
  // Document
  { type: 'get-document-info', description: 'Get document structure, pages, and selection', category: 'Document' },
  { type: 'get-node', description: 'Get node details by ID', category: 'Document' },
  { type: 'get-node-tree', description: 'Get node and all descendants (use depth to limit)', category: 'Document' },
  { type: 'find-nodes-by-name', description: 'Find nodes by name within a subtree', category: 'Document' },
  { type: 'get-page-children', description: 'List direct children of a page/frame with positions', category: 'Document' },
  { type: 'get-content-bounds', description: 'Get bounding box of all content in a page/frame', category: 'Document' },

  // Create
  { type: 'create-frame', description: 'Create a frame (container)', category: 'Create' },
  { type: 'create-rectangle', description: 'Create a rectangle', category: 'Create' },
  { type: 'create-text', description: 'Create a text layer', category: 'Create' },
  { type: 'create-ellipse', description: 'Create an ellipse/circle', category: 'Create' },
  { type: 'create-line', description: 'Create a line', category: 'Create' },
  { type: 'create-component', description: 'Create a reusable component', category: 'Create' },
  { type: 'create-component-from-node', description: 'Convert a node into a component', category: 'Create' },
  { type: 'create-component-set', description: 'Create a variant group from components', category: 'Create' },
  { type: 'add-variant', description: 'Add a variant to a component set', category: 'Create' },
  { type: 'create-section', description: 'Create a section to organize content', category: 'Create' },
  { type: 'create-page', description: 'Create a new page', category: 'Create' },
  { type: 'create-page-divider', description: 'Create a page divider', category: 'Create' },
  { type: 'create-text-path', description: 'Create text on a vector path', category: 'Create' },

  // Modify
  { type: 'modify-node', description: 'Modify node properties (position, size, fills, etc.)', category: 'Modify' },
  { type: 'delete-node', description: 'Delete a node', category: 'Modify' },
  { type: 'set-text-content', description: 'Set text content of a text node', category: 'Modify' },
  { type: 'set-text-style', description: 'Set text styling (font, size, alignment)', category: 'Modify' },
  { type: 'set-strokes', description: 'Set stroke/border properties', category: 'Modify' },
  { type: 'set-effects', description: 'Set effects (shadows, blurs)', category: 'Modify' },
  { type: 'apply-auto-layout', description: 'Apply Auto Layout to a frame', category: 'Modify' },
  { type: 'clone-node', description: 'Duplicate a node', category: 'Modify' },
  { type: 'move-node', description: 'Move a node to a new parent', category: 'Modify' },
  { type: 'group-nodes', description: 'Group multiple nodes', category: 'Modify' },
  { type: 'ungroup', description: 'Ungroup a group node', category: 'Modify' },
  { type: 'boolean-operation', description: 'Boolean operation (union, subtract, intersect, exclude)', category: 'Modify' },

  // Styles
  { type: 'create-style', description: 'Create a reusable style (paint, text, effect, grid)', category: 'Styles' },
  { type: 'get-style', description: 'Get a style by ID', category: 'Styles' },
  { type: 'list-styles', description: 'List all local styles', category: 'Styles' },
  { type: 'update-style', description: 'Update style properties', category: 'Styles' },
  { type: 'delete-style', description: 'Delete a style', category: 'Styles' },
  { type: 'apply-style', description: 'Apply a style to a node', category: 'Styles' },
  { type: 'get-node-styles', description: 'Get styles applied to a node', category: 'Styles' },
  { type: 'detach-style', description: 'Detach a style from a node', category: 'Styles' },

  // Variables
  { type: 'create-variable-collection', description: 'Create a variable collection (token group)', category: 'Variables' },
  { type: 'create-variable', description: 'Create a variable (design token)', category: 'Variables' },
  { type: 'get-local-variables', description: 'List local variables (optional type/name filter)', category: 'Variables' },
  { type: 'get-local-variable-collections', description: 'List variable collections', category: 'Variables' },
  { type: 'update-variable', description: 'Update a variable', category: 'Variables' },
  { type: 'delete-variable', description: 'Delete a variable', category: 'Variables' },
  { type: 'delete-variable-collection', description: 'Delete a variable collection', category: 'Variables' },
  { type: 'rename-variable-collection-mode', description: 'Rename a mode in a collection', category: 'Variables' },
  { type: 'add-collection-mode', description: 'Add a mode to a collection', category: 'Variables' },
  { type: 'bind-variable-to-node', description: 'Bind a variable to a node property', category: 'Variables' },
  { type: 'bind-variable-to-style', description: 'Bind a variable to a text style property', category: 'Variables' },

  // Selection
  { type: 'get-selection', description: 'Get currently selected nodes', category: 'Selection' },
  { type: 'set-selection', description: 'Set selection to specific nodes', category: 'Selection' },

  // Export
  { type: 'export-node', description: 'Export a node as PNG/JPG/SVG/PDF', category: 'Export' },

  // Batch
  { type: 'create-variables-batch', description: 'Create multiple variables at once', category: 'Batch' },
  { type: 'delete-variables-batch', description: 'Delete multiple variables at once', category: 'Batch' },
  { type: 'clone-nodes-batch', description: 'Clone multiple nodes at once', category: 'Batch' },
  { type: 'update-nodes-batch', description: 'Update multiple nodes at once', category: 'Batch' },

  // Organize (Phase 1)
  { type: 'align-frames', description: 'Auto-arrange top-level frames on current page', category: 'Organize' },
  { type: 'sort-pages', description: 'Sort pages alphabetically', category: 'Organize' },
  { type: 'create-section-from-selection', description: 'Wrap selected frames in a section', category: 'Organize' },

  // Audit (Phase 2)
  { type: 'get-page-summary', description: 'Page health scorecard (counts, nesting, detached)', category: 'Audit' },
  { type: 'get-naming-report', description: 'Find auto-generated layer names', category: 'Audit' },
  { type: 'get-style-audit', description: 'Find hardcoded colors and fonts', category: 'Audit' },
  { type: 'get-spatial-report', description: 'Detect overlaps and spacing issues', category: 'Audit' },
];

export function printHelp() {
  console.log('figma-bridge — CLI for the Figma-Claude Bridge\n');
  console.log('Usage:');
  console.log('  figma-bridge serve                       Start the bridge server');
  console.log('  figma-bridge status                      Check server & plugin connection');
  console.log('  figma-bridge <command> [json-args]        Send a command to Figma');
  console.log('  figma-bridge help                        Show this help\n');
  console.log('Examples:');
  console.log('  figma-bridge get-document-info');
  console.log('  figma-bridge create-frame \'{"name":"Header","width":800,"height":60}\'');
  console.log('  figma-bridge get-node \'{"id":"123:45"}\'');
  console.log('  figma-bridge align-frames \'{"gap":100}\'\n');

  const categories = [...new Set(commands.map(c => c.category))];
  for (const cat of categories) {
    console.log(`${cat}:`);
    for (const cmd of commands.filter(c => c.category === cat)) {
      console.log(`  ${cmd.type.padEnd(36)} ${cmd.description}`);
    }
    console.log();
  }
}
