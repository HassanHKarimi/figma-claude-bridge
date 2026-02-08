# Figma-Claude Bridge Examples

Real-world examples for designing in Figma with Claude AI.

## Table of Contents
1. [Basic Shapes](#basic-shapes)
2. [Mobile App Screens](#mobile-app-screens)
3. [Landing Page Components](#landing-page-components)
4. [Design System](#design-system)

## Basic Shapes

### Simple Rectangle with Rounded Corners
```typescript
// Create a card-like rectangle
const card = await figma_create_rectangle({
  name: "Card",
  x: 100,
  y: 100,
  width: 300,
  height: 200,
  cornerRadius: 16,
  fills: ["#FFFFFF"]
});
```

### Text with Custom Styling
```typescript
const heading = await figma_create_text({
  characters: "Welcome",
  x: 120,
  y: 120,
  fontSize: 32,
  fontName: { family: "Inter", style: "Bold" },
  fills: ["#1E293B"]
});
```

### Colored Circle
```typescript
const circle = await figma_create_ellipse({
  name: "Accent Circle",
  x: 200,
  y: 200,
  width: 100,
  height: 100,
  fills: ["#3B82F6"]
});
```

## Mobile App Screens

### iPhone 15 Pro Screen Template
```typescript
// Create artboard
const screen = await figma_create_frame({
  name: "iPhone 15 Pro",
  width: 393,
  height: 852,
  fills: ["#000000"]
});

// Add status bar
const statusBar = await figma_create_frame({
  name: "Status Bar",
  width: 393,
  height: 54,
  parent: screen.id,
  fills: []
});

// Add safe area content
const content = await figma_create_frame({
  name: "Content",
  width: 393,
  height: 798,
  y: 54,
  parent: screen.id,
  fills: ["#FFFFFF"]
});

await figma_apply_auto_layout({
  id: content.id,
  layoutMode: "VERTICAL",
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
  paddingBottom: 20,
  itemSpacing: 16
});
```

### Login Screen
```typescript
// 1. Create screen
const loginScreen = await figma_create_frame({
  name: "Login Screen",
  width: 375,
  height: 812,
  fills: ["#F9FAFB"]
});

// 2. Apply vertical layout
await figma_apply_auto_layout({
  id: loginScreen.id,
  layoutMode: "VERTICAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 100,
  itemSpacing: 24
});

// 3. Add logo placeholder
const logo = await figma_create_rectangle({
  name: "Logo",
  width: 80,
  height: 80,
  cornerRadius: 16,
  fills: ["#3B82F6"],
  parent: loginScreen.id
});

// 4. Add title
const title = await figma_create_text({
  characters: "Welcome Back",
  fontSize: 28,
  fontName: { family: "Inter", style: "Bold" },
  fills: ["#1E293B"],
  parent: loginScreen.id
});

// 5. Add subtitle
const subtitle = await figma_create_text({
  characters: "Sign in to continue",
  fontSize: 16,
  fontName: { family: "Inter", style: "Regular" },
  fills: ["#64748B"],
  parent: loginScreen.id
});

// 6. Create input fields container
const inputsContainer = await figma_create_frame({
  name: "Input Fields",
  width: 327,
  parent: loginScreen.id
});

await figma_apply_auto_layout({
  id: inputsContainer.id,
  layoutMode: "VERTICAL",
  itemSpacing: 16
});

// 7. Email input
const emailInput = await figma_create_rectangle({
  name: "Email Input",
  width: 327,
  height: 56,
  cornerRadius: 8,
  fills: ["#FFFFFF"],
  parent: inputsContainer.id
});

// 8. Password input
const passwordInput = await figma_create_rectangle({
  name: "Password Input",
  width: 327,
  height: 56,
  cornerRadius: 8,
  fills: ["#FFFFFF"],
  parent: inputsContainer.id
});

// 9. Login button
const loginButton = await figma_create_frame({
  name: "Login Button",
  parent: loginScreen.id
});

await figma_apply_auto_layout({
  id: loginButton.id,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 16,
  paddingBottom: 16
});

const loginBg = await figma_create_rectangle({
  width: 327,
  height: 56,
  cornerRadius: 8,
  fills: ["#3B82F6"],
  parent: loginButton.id
});

const loginText = await figma_create_text({
  characters: "Sign In",
  fontSize: 16,
  fontName: { family: "Inter", style: "SemiBold" },
  fills: ["#FFFFFF"],
  parent: loginButton.id
});
```

## Landing Page Components

### Hero Section
```typescript
// 1. Create hero container
const hero = await figma_create_frame({
  name: "Hero Section",
  width: 1440,
  height: 700,
  fills: ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)"] // Note: Will need proper gradient object
});

// Better approach with solid background
const hero = await figma_create_frame({
  name: "Hero Section",
  width: 1440,
  height: 700,
  fills: ["#667eea"]
});

await figma_apply_auto_layout({
  id: hero.id,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 80,
  paddingRight: 80
});

// 2. Left content
const leftContent = await figma_create_frame({
  name: "Hero Content",
  parent: hero.id
});

await figma_apply_auto_layout({
  id: leftContent.id,
  layoutMode: "VERTICAL",
  itemSpacing: 24,
  primaryAxisSizingMode: "AUTO"
});

// 3. Headline
const headline = await figma_create_text({
  characters: "Your Mind's Best Friend",
  fontSize: 64,
  fontName: { family: "Inter", style: "Bold" },
  fills: ["#FFFFFF"],
  parent: leftContent.id
});

// 4. Subheadline
const subheadline = await figma_create_text({
  characters: "Binaural beats and breathing exercises tailored to your emotional state",
  fontSize: 24,
  fontName: { family: "Inter", style: "Regular" },
  fills: ["#E0E7FF"],
  parent: leftContent.id
});

// 5. CTA Button
const ctaButton = await figma_create_frame({
  name: "CTA Button",
  parent: leftContent.id
});

await figma_apply_auto_layout({
  id: ctaButton.id,
  layoutMode: "HORIZONTAL",
  paddingLeft: 40,
  paddingRight: 40,
  paddingTop: 20,
  paddingBottom: 20
});

const ctaBg = await figma_create_rectangle({
  cornerRadius: 8,
  fills: ["#FFFFFF"],
  parent: ctaButton.id
});

const ctaText = await figma_create_text({
  characters: "Start Your Journey",
  fontSize: 18,
  fontName: { family: "Inter", style: "SemiBold" },
  fills: ["#667eea"],
  parent: ctaButton.id
});
```

### Feature Cards Grid
```typescript
// 1. Create container
const features = await figma_create_frame({
  name: "Features Section",
  width: 1440,
  height: 600,
  fills: ["#F9FAFB"]
});

await figma_apply_auto_layout({
  id: features.id,
  layoutMode: "VERTICAL",
  primaryAxisAlignItems: "CENTER",
  paddingLeft: 80,
  paddingRight: 80,
  paddingTop: 80,
  paddingBottom: 80,
  itemSpacing: 48
});

// 2. Section title
const sectionTitle = await figma_create_text({
  characters: "How It Works",
  fontSize: 48,
  fontName: { family: "Inter", style: "Bold" },
  fills: ["#1E293B"],
  parent: features.id
});

// 3. Cards grid
const cardsGrid = await figma_create_frame({
  name: "Cards Grid",
  parent: features.id
});

await figma_apply_auto_layout({
  id: cardsGrid.id,
  layoutMode: "HORIZONTAL",
  itemSpacing: 32
});

// 4. Create 3 feature cards
const featureData = [
  {
    title: "Describe Your State",
    description: "Tell us how you're feeling and what you want to achieve"
  },
  {
    title: "Personalized Audio",
    description: "Receive custom binaural beats tuned to your needs"
  },
  {
    title: "Daily Delivery",
    description: "Get your session delivered to your inbox every day"
  }
];

for (const feature of featureData) {
  // Create card
  const card = await figma_create_frame({
    name: `Card - ${feature.title}`,
    parent: cardsGrid.id
  });
  
  await figma_apply_auto_layout({
    id: card.id,
    layoutMode: "VERTICAL",
    itemSpacing: 16,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 32,
    paddingBottom: 32
  });
  
  // Card background
  const cardBg = await figma_create_rectangle({
    width: 360,
    height: 240,
    cornerRadius: 16,
    fills: ["#FFFFFF"],
    parent: card.id
  });
  
  // Icon placeholder
  const icon = await figma_create_ellipse({
    width: 64,
    height: 64,
    fills: ["#3B82F6"],
    parent: card.id
  });
  
  // Title
  const cardTitle = await figma_create_text({
    characters: feature.title,
    fontSize: 24,
    fontName: { family: "Inter", style: "SemiBold" },
    fills: ["#1E293B"],
    parent: card.id
  });
  
  // Description
  const cardDesc = await figma_create_text({
    characters: feature.description,
    fontSize: 16,
    fontName: { family: "Inter", style: "Regular" },
    fills: ["#64748B"],
    parent: card.id
  });
}
```

## Design System

### Color Palette
```typescript
// Create color styles for brand
const colors = [
  { name: "Primary/500", color: "#3B82F6" },
  { name: "Primary/600", color: "#2563EB" },
  { name: "Primary/700", color: "#1D4ED8" },
  { name: "Neutral/900", color: "#18181B" },
  { name: "Neutral/700", color: "#3F3F46" },
  { name: "Neutral/500", color: "#71717A" },
  { name: "Neutral/100", color: "#F4F4F5" },
  { name: "Success/500", color: "#22C55E" },
  { name: "Error/500", color: "#EF4444" },
];

for (const color of colors) {
  await figma_create_style({
    type: "PAINT",
    name: color.name,
    properties: {
      paints: [color.color]
    }
  });
}
```

### Typography Styles
```typescript
const textStyles = [
  { name: "H1", fontSize: 64, fontStyle: "Bold" },
  { name: "H2", fontSize: 48, fontStyle: "Bold" },
  { name: "H3", fontSize: 32, fontStyle: "SemiBold" },
  { name: "H4", fontSize: 24, fontStyle: "SemiBold" },
  { name: "Body Large", fontSize: 18, fontStyle: "Regular" },
  { name: "Body", fontSize: 16, fontStyle: "Regular" },
  { name: "Body Small", fontSize: 14, fontStyle: "Regular" },
  { name: "Caption", fontSize: 12, fontStyle: "Regular" },
];

for (const style of textStyles) {
  await figma_create_style({
    type: "TEXT",
    name: style.name,
    properties: {
      fontSize: style.fontSize,
      fontName: { family: "Inter", style: style.fontStyle }
    }
  });
}
```

## Tips for Using Examples

1. **Copy incrementally**: Don't paste all code at once
2. **Check IDs**: Save returned IDs for parent relationships
3. **Test as you go**: Verify each step works
4. **Adjust dimensions**: Modify for your specific needs
5. **Use Auto Layout**: Makes designs responsive and maintainable

## Next Steps

- Combine these examples
- Create your own components
- Build complete pages
- Export for development
