# Figma Design Skill

This skill enables Claude to create professional designs in Figma through the Figma-Claude Bridge.

## Overview

Claude can now design in Figma with full control over:
- Creating and modifying design elements
- Building responsive layouts with Auto Layout
- Creating design systems and components
- Managing styles and design tokens
- Exporting assets

## Available Tools

### Document Operations
- `figma_get_document_info` - Get current document structure
- `figma_get_node` - Get details about a specific element

### Creation Tools
- `figma_create_frame` - Create containers/artboards
- `figma_create_rectangle` - Create rectangle shapes
- `figma_create_text` - Create text layers
- `figma_create_ellipse` - Create circles/ellipses
- `figma_create_component` - Create reusable components

### Modification Tools
- `figma_modify_node` - Change properties of elements
- `figma_delete_node` - Remove elements
- `figma_apply_auto_layout` - Make responsive layouts

### Style & Organization
- `figma_create_style` - Create reusable styles
- `figma_get_selection` - Get selected elements
- `figma_set_selection` - Select elements

### Export
- `figma_export_node` - Export as PNG, JPG, SVG, or PDF

## Design Workflow

### 1. Start by Understanding Context
Always begin with `figma_get_document_info` to understand:
- Current page structure
- Existing elements
- What's selected

### 2. Create Systematically
Build designs hierarchically:
1. Create parent frames first
2. Add child elements
3. Apply Auto Layout for responsiveness
4. Set styles and colors

### 3. Use Proper Hierarchy
```
Page
  └─ Frame (artboard/screen)
      └─ Frame (section with Auto Layout)
          ├─ Text
          ├─ Rectangle
          └─ Frame (nested component)
```

## Best Practices

### Colors
Use hex format for simplicity:
```typescript
fills: ["#FF5733"]  // Simple hex color
// or
fills: [{
  type: "SOLID",
  color: { r: 1, g: 0.34, b: 0.2 },
  opacity: 1
}]
```

### Auto Layout for Responsive Design
Always use Auto Layout for modern, responsive designs:
```typescript
// Create a vertical stack
figma_create_frame({
  name: "Card",
  width: 300,
  height: 400
})

// Then apply Auto Layout
figma_apply_auto_layout({
  id: frameId,
  layoutMode: "VERTICAL",
  itemSpacing: 16,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
  paddingBottom: 24
})
```

### Typography
Load fonts before creating text:
```typescript
figma_create_text({
  characters: "Hello World",
  fontSize: 24,
  fontName: { family: "Inter", style: "Bold" },
  fills: ["#000000"]
})
```

### Component-Based Design
Create reusable components:
```typescript
// 1. Create the design
// 2. Convert to component
figma_create_component({
  name: "Button/Primary",
  width: 200,
  height: 48
})
```

## Common Design Patterns

### Mobile App Screen
```typescript
// 1. Create artboard
const screen = figma_create_frame({
  name: "Home Screen",
  width: 375,
  height: 812,
  fills: ["#FFFFFF"]
})

// 2. Create header
const header = figma_create_frame({
  name: "Header",
  width: 375,
  height: 60,
  fills: ["#1E1E1E"],
  parent: screen.id
})

// 3. Apply Auto Layout to header
figma_apply_auto_layout({
  id: header.id,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "SPACE_BETWEEN",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 20,
  paddingRight: 20
})

// 4. Add title
figma_create_text({
  characters: "Home",
  fontSize: 18,
  fontName: { family: "Inter", style: "SemiBold" },
  fills: ["#FFFFFF"],
  parent: header.id
})
```

### Card Component
```typescript
// 1. Create card frame
const card = figma_create_frame({
  name: "Card",
  width: 300,
  height: 200
})

// 2. Make it rounded
figma_modify_node({
  id: card.id,
  fills: ["#FFFFFF"]
})

// Add corner radius via rectangle
const bg = figma_create_rectangle({
  width: 300,
  height: 200,
  cornerRadius: 12,
  fills: ["#FFFFFF"],
  parent: card.id
})

// 3. Apply Auto Layout
figma_apply_auto_layout({
  id: card.id,
  layoutMode: "VERTICAL",
  itemSpacing: 12,
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
  paddingBottom: 20
})
```

### Design System Colors
```typescript
// Create color styles
figma_create_style({
  type: "PAINT",
  name: "Primary/500",
  properties: {
    paints: ["#3B82F6"]
  }
})

figma_create_style({
  type: "PAINT",
  name: "Neutral/900",
  properties: {
    paints: ["#18181B"]
  }
})
```

## Example: Complete Landing Page Hero

```typescript
// 1. Get document info
const doc = figma_get_document_info()

// 2. Create desktop artboard
const hero = figma_create_frame({
  name: "Hero Section",
  width: 1440,
  height: 600,
  fills: ["#F9FAFB"]
})

// 3. Apply Auto Layout
figma_apply_auto_layout({
  id: hero.id,
  layoutMode: "VERTICAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  itemSpacing: 32,
  paddingTop: 120,
  paddingBottom: 120
})

// 4. Add heading
const heading = figma_create_text({
  characters: "Design Beautiful Products",
  fontSize: 64,
  fontName: { family: "Inter", style: "Bold" },
  fills: ["#18181B"],
  parent: hero.id
})

// 5. Add subheading
const subheading = figma_create_text({
  characters: "Create stunning designs with AI assistance",
  fontSize: 24,
  fontName: { family: "Inter", style: "Regular" },
  fills: ["#71717A"],
  parent: hero.id
})

// 6. Create CTA button container
const buttonContainer = figma_create_frame({
  name: "CTA Button",
  parent: hero.id
})

figma_apply_auto_layout({
  id: buttonContainer.id,
  layoutMode: "HORIZONTAL",
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 16,
  paddingBottom: 16
})

// 7. Add button background
const buttonBg = figma_create_rectangle({
  width: 200,
  height: 56,
  cornerRadius: 8,
  fills: ["#3B82F6"],
  parent: buttonContainer.id
})

// 8. Add button text
const buttonText = figma_create_text({
  characters: "Get Started",
  fontSize: 18,
  fontName: { family: "Inter", style: "SemiBold" },
  fills: ["#FFFFFF"],
  parent: buttonContainer.id
})
```

## Tips for Effective Design

1. **Think in Frames**: Everything should be in frames for organization
2. **Use Auto Layout**: Makes designs responsive and easier to modify
3. **Name Everything**: Clear names make designs maintainable
4. **Build Components**: Reuse common elements
5. **Consistent Spacing**: Use multiples of 4 or 8 for spacing
6. **Design Systems**: Create styles before using them throughout
7. **Work Top-Down**: Create parent containers before children

## Error Handling

If operations fail:
1. Check if plugin is connected (`figma_get_document_info` to test)
2. Verify node IDs exist before modifying
3. Ensure parent frames exist before adding children
4. Load fonts before using them in text

## Use Cases

### Landing Page
Create marketing pages with hero sections, feature grids, pricing tables

### App Screens
Design mobile app interfaces with proper iOS/Android dimensions

### Email Templates
Build responsive email designs with proper constraints

### Marketing Assets
Generate social media graphics, banners, and promotional materials

### Design System
Create comprehensive component libraries and style guides
