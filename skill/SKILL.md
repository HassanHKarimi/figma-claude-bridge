# Figma Bridge Skill

Design in Figma via the `figma-bridge` CLI. All commands send JSON to the Figma plugin over WebSocket and return JSON to stdout.

## Prerequisites

The bridge server must be running: `figma-bridge serve`
Check status: `figma-bridge status`

## Command Format

```bash
figma-bridge <command> ['{"key": "value"}']
```

All arguments are a single JSON string. No args needed for commands like `get-document-info`.

## Workflow

### 1. Understand Context First
```bash
figma-bridge get-document-info
figma-bridge get-page-children
figma-bridge get-content-bounds
```

### 2. Build Top-Down
Create parent frames first, then children. Use the returned `id` for subsequent operations.

```bash
# Create a screen
figma-bridge create-frame '{"name":"Home Screen","width":375,"height":812,"fills":["#FFFFFF"]}'

# Add a child (use parent id from above)
figma-bridge create-frame '{"name":"Header","width":375,"height":60,"fills":["#1E1E1E"],"parent":"123:45"}'

# Apply Auto Layout
figma-bridge apply-auto-layout '{"id":"123:46","layoutMode":"HORIZONTAL","primaryAxisAlignItems":"SPACE_BETWEEN","counterAxisAlignItems":"CENTER","paddingLeft":20,"paddingRight":20}'

# Add text
figma-bridge create-text '{"characters":"Home","fontSize":18,"fontName":{"family":"Inter","style":"SemiBold"},"fills":["#FFFFFF"],"parent":"123:46"}'
```

### 3. Use Proper Hierarchy
```
Page
  └─ Frame (screen/artboard)
      └─ Frame (section with Auto Layout)
          ├─ Text
          ├─ Rectangle
          └─ Frame (nested component)
```

## Command Reference

### Document
| Command | Args | Description |
|---------|------|-------------|
| `get-document-info` | — | Document structure, pages, selection |
| `get-node` | `id` | Node details by ID |
| `get-node-tree` | `id`, `depth?` | Node + descendants (default depth 10) |
| `find-nodes-by-name` | `parentId`, `name`, `type?` | Find nodes by name in subtree |
| `get-page-children` | `id?` | Direct children with positions/sizes |
| `get-content-bounds` | `id?` | Bounding box of all content |

### Create
| Command | Args | Description |
|---------|------|-------------|
| `create-frame` | `name?`, `x?`, `y?`, `width?`, `height?`, `fills?`, `cornerRadius?`, `parent?` | Create a frame |
| `create-rectangle` | `name?`, `x?`, `y?`, `width?`, `height?`, `fills?`, `cornerRadius?`, `parent?` | Create a rectangle |
| `create-text` | `characters`, `name?`, `x?`, `y?`, `fontSize?`, `fontName?`, `fills?`, `parent?` | Create text |
| `create-ellipse` | `name?`, `x?`, `y?`, `width?`, `height?`, `fills?`, `parent?` | Create ellipse |
| `create-line` | `name?`, `length?`, `rotation?`, `strokes?`, `strokeWeight?`, `parent?` | Create line |
| `create-component` | `name`, `width?`, `height?`, `parent?` | Create component |
| `create-component-from-node` | `nodeId` | Convert node to component |
| `create-component-set` | `componentIds` | Create variant group |
| `add-variant` | `componentSetId`, `name?` | Add variant to component set |
| `create-section` | `name?`, `x?`, `y?`, `width?`, `height?`, `fills?` | Create section |
| `create-page` | `name?`, `switchToPage?` | Create page |
| `create-page-divider` | `name?` | Create page divider |
| `create-text-path` | `nodeId`, `characters`, `fontSize?`, `fontName?` | Text on path |

### Modify
| Command | Args | Description |
|---------|------|-------------|
| `modify-node` | `id`, `name?`, `x?`, `y?`, `width?`, `height?`, `fills?`, `opacity?`, `visible?`, `locked?`, `cornerRadius?`, `rotation?` | Modify node properties |
| `delete-node` | `id` | Delete a node |
| `set-text-content` | `id`, `characters`, `fontName?`, `fontSize?`, `fills?` | Set text content |
| `set-text-style` | `id`, `fontName?`, `fontSize?`, `textAlignHorizontal?`, `textAlignVertical?`, `lineHeight?`, `letterSpacing?`, `textDecoration?`, `textCase?`, `textAutoResize?` | Set text styling |
| `set-strokes` | `id`, `strokes`, `strokeWeight?`, `strokeAlign?`, `dashPattern?` | Set borders |
| `set-effects` | `id`, `effects` | Set shadows/blurs |
| `apply-auto-layout` | `id`, `layoutMode?`, `primaryAxisSizingMode?`, `counterAxisSizingMode?`, `paddingLeft?`, `paddingRight?`, `paddingTop?`, `paddingBottom?`, `itemSpacing?`, `primaryAxisAlignItems?`, `counterAxisAlignItems?` | Apply Auto Layout |
| `clone-node` | `id`, `name?`, `x?`, `y?` | Duplicate a node |
| `move-node` | `id`, `parentId`, `index?` | Reparent a node |
| `group-nodes` | `ids`, `name?` | Group nodes |
| `ungroup` | `id` | Ungroup |
| `boolean-operation` | `operation`, `nodeIds`, `name?` | Union/subtract/intersect/exclude |

### Styles
| Command | Args | Description |
|---------|------|-------------|
| `create-style` | `type`, `name`, `description?`, `properties` | Create style (PAINT/TEXT/EFFECT/GRID) |
| `get-style` | `id` | Get style by ID |
| `list-styles` | `type?` | List all local styles |
| `update-style` | `id`, `name?`, `description?`, `properties?` | Update style |
| `delete-style` | `id` | Delete style |
| `apply-style` | `nodeId`, `styleId`, `styleType` | Apply style to node |
| `get-node-styles` | `nodeId` | Get styles on a node |
| `detach-style` | `nodeId`, `styleType` | Detach style from node |

### Variables (Design Tokens)
| Command | Args | Description |
|---------|------|-------------|
| `create-variable-collection` | `name`, `initialModeRename?`, `modes?` | Create token collection |
| `create-variable` | `name`, `collectionId`, `resolvedType`, `values?`, `description?`, `scopes?` | Create variable |
| `get-local-variables` | `type?`, `namePrefix?` | List variables |
| `get-local-variable-collections` | — | List collections |
| `update-variable` | `variableId`, `name?`, `description?`, `values?`, `scopes?` | Update variable |
| `delete-variable` | `variableId` | Delete variable |
| `delete-variable-collection` | `collectionId` | Delete collection |
| `rename-variable-collection-mode` | `collectionId`, `modeId`, `newName` | Rename mode |
| `add-collection-mode` | `collectionId`, `name` | Add mode |
| `bind-variable-to-node` | `nodeId`, `variableId`, `field`, `index?` | Bind token to node |
| `bind-variable-to-style` | `styleId`, `variableId`, `field` | Bind token to style |

### Selection
| Command | Args | Description |
|---------|------|-------------|
| `get-selection` | — | Get selected nodes |
| `set-selection` | `ids` | Set selection |

### Export
| Command | Args | Description |
|---------|------|-------------|
| `export-node` | `id`, `format?`, `scale?` | Export as PNG/JPG/SVG/PDF |

### Batch Operations
| Command | Args | Description |
|---------|------|-------------|
| `create-variables-batch` | `collectionId`, `variables` | Create multiple variables |
| `delete-variables-batch` | `variableIds` | Delete multiple variables |
| `clone-nodes-batch` | `nodes` | Clone multiple nodes |
| `update-nodes-batch` | `updates` | Update multiple nodes |

### Organize
| Command | Args | Description |
|---------|------|-------------|
| `align-frames` | `gap?`, `columns?` | Auto-arrange top-level frames |
| `sort-pages` | — | Sort pages alphabetically |
| `create-section-from-selection` | `name?` | Wrap selection in section |

## Best Practices

1. **Colors**: Use hex format `"fills": ["#FF5733"]` or paint objects `[{"type":"SOLID","color":{"r":1,"g":0.34,"b":0.2},"opacity":1}]`
2. **Auto Layout**: Always apply for responsive design. Use `layoutMode`, `itemSpacing`, padding props.
3. **Spacing**: Use multiples of 4 or 8.
4. **Names**: Name every frame and component clearly.
5. **Components**: Build reusable components, use "Property=Value" naming for variants.
6. **Spatial awareness**: Call `get-content-bounds` or `get-page-children` before placing new content to avoid overlaps.
7. **Top-down**: Create parent containers before children.

## Error Handling

If commands fail:
1. Check server status: `figma-bridge status` — verify plugin is connected
2. Verify node IDs exist before modifying
3. Ensure parent frames exist before adding children
4. Font loading is handled by the plugin — just specify `fontName` in create/set commands
