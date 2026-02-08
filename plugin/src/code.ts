// Figma Plugin Code - Runs inside Figma with full API access
// This plugin acts as a bridge, receiving commands from the MCP server
// and executing them using Figma's Plugin API

console.log('Claude AI Bridge plugin loaded');

// Plugin state
let isConnected = false;

// Initialize plugin
figma.showUI(__html__, { width: 300, height: 400, themeColors: true });

// Handle messages from UI (which communicates with MCP server)
figma.ui.onmessage = async (msg) => {
  console.log('Received message:', msg.type);

  const requestId = msg.requestId;

  function respond(type: string, data: any) {
    figma.ui.postMessage({ requestId, type, data });
  }

  try {
    switch (msg.type) {
      case 'ping':
        respond('pong', {});
        break;

      case 'get-document-info':
        const docInfo = await getDocumentInfo();
        respond('document-info', docInfo);
        break;

      case 'create-frame':
        const frame = await createFrame(msg.data);
        respond('frame-created', { id: frame.id });
        break;

      case 'create-rectangle':
        const rect = await createRectangle(msg.data);
        respond('rectangle-created', { id: rect.id });
        break;

      case 'create-text':
        const text = await createText(msg.data);
        respond('text-created', { id: text.id });
        break;

      case 'create-ellipse':
        const ellipse = await createEllipse(msg.data);
        respond('ellipse-created', { id: ellipse.id });
        break;

      case 'modify-node':
        await modifyNode(msg.data);
        respond('node-modified', { success: true });
        break;

      case 'delete-node':
        await deleteNode(msg.data);
        respond('node-deleted', { success: true });
        break;

      case 'get-node':
        const node = await getNode(msg.data);
        respond('node-data', node);
        break;

      case 'create-component':
        const component = await createComponent(msg.data);
        respond('component-created', { id: component.id });
        break;

      case 'apply-auto-layout':
        await applyAutoLayout(msg.data);
        respond('auto-layout-applied', { success: true });
        break;

      case 'export-node':
        const exportData = await exportNode(msg.data);
        respond('node-exported', exportData);
        break;

      case 'create-style':
        const style = await createStyle(msg.data);
        respond('style-created', { id: style.id, name: style.name });
        break;

      case 'get-style':
        const styleData = await getStyleHandler(msg.data);
        respond('style-data', styleData);
        break;

      case 'list-styles':
        const stylesList = await listStylesHandler(msg.data);
        respond('styles-list', stylesList);
        break;

      case 'update-style':
        await updateStyleHandler(msg.data);
        respond('style-updated', { success: true });
        break;

      case 'delete-style':
        await deleteStyleHandler(msg.data);
        respond('style-deleted', { success: true });
        break;

      case 'apply-style':
        await applyStyleHandler(msg.data);
        respond('style-applied', { success: true });
        break;

      case 'get-node-styles':
        const nodeStyles = await getNodeStylesHandler(msg.data);
        respond('node-styles', nodeStyles);
        break;

      case 'detach-style':
        await detachStyleHandler(msg.data);
        respond('style-detached', { success: true });
        break;

      case 'get-selection':
        const selection = getSelection();
        respond('selection-data', selection);
        break;

      case 'set-selection':
        await setSelection(msg.data);
        respond('selection-set', { success: true });
        break;

      case 'create-component-set':
        const compSet = await createComponentSet(msg.data);
        respond('component-set-created', { id: compSet.id });
        break;

      case 'add-variant':
        const variant = await addVariant(msg.data);
        respond('variant-added', { id: variant.id });
        break;

      case 'set-strokes':
        await setStrokes(msg.data);
        respond('strokes-set', { success: true });
        break;

      case 'set-effects':
        await setEffects(msg.data);
        respond('effects-set', { success: true });
        break;

      case 'set-text-style':
        await setTextStyle(msg.data);
        respond('text-style-set', { success: true });
        break;

      case 'clone-node':
        const cloned = await cloneNode(msg.data);
        respond('node-cloned', { id: cloned.id });
        break;

      case 'group-nodes':
        const group = await groupNodes(msg.data);
        respond('nodes-grouped', { id: group.id });
        break;

      case 'ungroup':
        await ungroupNode(msg.data);
        respond('ungrouped', { success: true });
        break;

      case 'move-node':
        await moveNode(msg.data);
        respond('node-moved', { success: true });
        break;

      // ===== NEW TOOLS =====

      case 'create-line':
        const line = await createLine(msg.data);
        respond('line-created', { id: line.id });
        break;

      case 'create-page':
        const newPage = await createNewPage(msg.data);
        respond('page-created', { id: newPage.id, name: newPage.name });
        break;

      case 'create-page-divider':
        const divider = createPageDividerNode(msg.data);
        respond('page-divider-created', { id: divider.id, name: divider.name });
        break;

      case 'create-component-from-node':
        const compFromNode = createComponentFromNodeHandler(msg.data);
        respond('component-from-node-created', { id: compFromNode.id, name: compFromNode.name });
        break;

      case 'boolean-operation':
        const boolResult = performBooleanOperation(msg.data);
        respond('boolean-operation-done', { id: boolResult.id, name: boolResult.name });
        break;

      case 'create-section':
        const section = createSectionNode(msg.data);
        respond('section-created', { id: section.id });
        break;

      case 'create-variable-collection':
        const varCollection = createVariableCollectionHandler(msg.data);
        respond('variable-collection-created', varCollection);
        break;

      case 'create-variable':
        const variable = createVariableHandler(msg.data);
        respond('variable-created', variable);
        break;

      case 'get-local-variables':
        const variables = await getLocalVariablesHandler(msg.data);
        respond('local-variables', variables);
        break;

      case 'get-local-variable-collections':
        const collections = await getLocalVariableCollectionsHandler();
        respond('local-variable-collections', collections);
        break;

      case 'create-text-path':
        const textPathNode = await createTextPathHandler(msg.data);
        respond('text-path-created', { id: textPathNode.id });
        break;

      case 'update-variable':
        const updatedVar = await updateVariableHandler(msg.data);
        respond('variable-updated', updatedVar);
        break;

      case 'delete-variable':
        await deleteVariableHandler(msg.data);
        respond('variable-deleted', { success: true });
        break;

      case 'delete-variable-collection':
        await deleteVariableCollectionHandler(msg.data);
        respond('variable-collection-deleted', { success: true });
        break;

      case 'rename-variable-collection-mode':
        const renamedMode = renameVariableCollectionModeHandler(msg.data);
        respond('variable-collection-mode-renamed', renamedMode);
        break;

      case 'bind-variable-to-node':
        await bindVariableToNodeHandler(msg.data);
        respond('variable-bound', { success: true });
        break;

      case 'add-collection-mode':
        const addedMode = addCollectionModeHandler(msg.data);
        respond('collection-mode-added', addedMode);
        break;

      case 'bind-variable-to-style':
        const boundStyle = await bindVariableToStyleHandler(msg.data);
        respond('variable-bound-to-style', boundStyle);
        break;

      default:
        console.warn('Unknown message type:', msg.type);
        respond('error', { message: 'Unknown command' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    figma.ui.postMessage({
      requestId,
      type: 'error',
      error: { message: error instanceof Error ? error.message : String(error) }
    });
  }
};

// Type helper for nodes that can contain children
function isContainerNode(node: BaseNode): node is FrameNode | GroupNode | ComponentNode | PageNode | SectionNode {
  return 'appendChild' in node;
}

// ===== DESIGN OPERATIONS =====

async function getDocumentInfo() {
  return {
    name: figma.root.name,
    id: figma.root.id,
    pages: figma.root.children.map(page => ({
      id: page.id,
      name: page.name,
      type: page.type
    })),
    currentPage: {
      id: figma.currentPage.id,
      name: figma.currentPage.name
    },
    selection: figma.currentPage.selection.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type
    }))
  };
}

async function createFrame(data: any) {
  const frame = figma.createFrame();
  
  if (data.name) frame.name = data.name;
  if (data.x !== undefined) frame.x = data.x;
  if (data.y !== undefined) frame.y = data.y;
  if (data.width) frame.resize(data.width, frame.height);
  if (data.height) frame.resize(frame.width, data.height);
  
  if (data.fills) {
    frame.fills = parseFills(data.fills);
  }

  if (data.cornerRadius !== undefined) frame.cornerRadius = data.cornerRadius;
  if (data.topLeftRadius !== undefined) frame.topLeftRadius = data.topLeftRadius;
  if (data.topRightRadius !== undefined) frame.topRightRadius = data.topRightRadius;
  if (data.bottomLeftRadius !== undefined) frame.bottomLeftRadius = data.bottomLeftRadius;
  if (data.bottomRightRadius !== undefined) frame.bottomRightRadius = data.bottomRightRadius;

  if (data.parent) {
    const parent = figma.getNodeById(data.parent);
    if (parent && isContainerNode(parent)) {
      parent.appendChild(frame);
    }
  } else {
    figma.currentPage.appendChild(frame);
  }

  return frame;
}

async function createRectangle(data: any) {
  const rect = figma.createRectangle();
  
  if (data.name) rect.name = data.name;
  if (data.x !== undefined) rect.x = data.x;
  if (data.y !== undefined) rect.y = data.y;
  if (data.width) rect.resize(data.width, rect.height);
  if (data.height) rect.resize(rect.width, data.height);
  
  if (data.fills) {
    rect.fills = parseFills(data.fills);
  }
  
  if (data.cornerRadius !== undefined) {
    rect.cornerRadius = data.cornerRadius;
  }
  
  if (data.parent) {
    const parent = figma.getNodeById(data.parent);
    if (parent && isContainerNode(parent)) {
      parent.appendChild(rect);
    }
  } else {
    figma.currentPage.appendChild(rect);
  }
  
  return rect;
}

async function createText(data: any) {
  const text = figma.createText();
  
  // Load font before setting characters
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  if (data.characters) text.characters = data.characters;
  if (data.name) text.name = data.name;
  if (data.x !== undefined) text.x = data.x;
  if (data.y !== undefined) text.y = data.y;
  
  if (data.fontSize) text.fontSize = data.fontSize;
  if (data.fontName) {
    await figma.loadFontAsync(data.fontName);
    text.fontName = data.fontName;
  }
  
  if (data.fills) {
    text.fills = parseFills(data.fills);
  }
  
  if (data.parent) {
    const parent = figma.getNodeById(data.parent);
    if (parent && isContainerNode(parent)) {
      parent.appendChild(text);
    }
  } else {
    figma.currentPage.appendChild(text);
  }
  
  return text;
}

async function createEllipse(data: any) {
  const ellipse = figma.createEllipse();
  
  if (data.name) ellipse.name = data.name;
  if (data.x !== undefined) ellipse.x = data.x;
  if (data.y !== undefined) ellipse.y = data.y;
  if (data.width) ellipse.resize(data.width, ellipse.height);
  if (data.height) ellipse.resize(ellipse.width, data.height);
  
  if (data.fills) {
    ellipse.fills = parseFills(data.fills);
  }
  
  if (data.parent) {
    const parent = figma.getNodeById(data.parent);
    if (parent && isContainerNode(parent)) {
      parent.appendChild(ellipse);
    }
  } else {
    figma.currentPage.appendChild(ellipse);
  }
  
  return ellipse;
}

async function modifyNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);
  
  if (data.name) node.name = data.name;
  if (data.x !== undefined && 'x' in node) node.x = data.x;
  if (data.y !== undefined && 'y' in node) node.y = data.y;
  
  if ((data.width || data.height) && 'resize' in node) {
    const width = data.width || node.width;
    const height = data.height || node.height;
    node.resize(width, height);
  }
  
  if (data.fills && 'fills' in node) {
    node.fills = parseFills(data.fills);
  }
  
  if (data.opacity !== undefined && 'opacity' in node) {
    node.opacity = data.opacity;
  }
  
  if (data.visible !== undefined && 'visible' in node) {
    (node as SceneNode).visible = data.visible;
  }

  if (data.locked !== undefined && 'locked' in node) {
    (node as SceneNode).locked = data.locked;
  }

  if (data.cornerRadius !== undefined && 'cornerRadius' in node) {
    (node as any).cornerRadius = data.cornerRadius;
  }
  if (data.topLeftRadius !== undefined && 'topLeftRadius' in node) {
    (node as any).topLeftRadius = data.topLeftRadius;
  }
  if (data.topRightRadius !== undefined && 'topRightRadius' in node) {
    (node as any).topRightRadius = data.topRightRadius;
  }
  if (data.bottomLeftRadius !== undefined && 'bottomLeftRadius' in node) {
    (node as any).bottomLeftRadius = data.bottomLeftRadius;
  }
  if (data.bottomRightRadius !== undefined && 'bottomRightRadius' in node) {
    (node as any).bottomRightRadius = data.bottomRightRadius;
  }

  if (data.rotation !== undefined && 'rotation' in node) {
    (node as any).rotation = data.rotation;
  }
}

async function deleteNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);
  node.remove();
}

async function getNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);
  
  return serializeNode(node);
}

async function createComponent(data: any) {
  const frame = figma.createFrame();
  
  if (data.name) frame.name = data.name;
  if (data.width) frame.resize(data.width, frame.height);
  if (data.height) frame.resize(frame.width, data.height);
  
  if (data.parent) {
    const parent = figma.getNodeById(data.parent);
    if (parent && isContainerNode(parent)) {
      parent.appendChild(frame);
    }
  } else {
    figma.currentPage.appendChild(frame);
  }
  
  const component = figma.createComponent();
  component.name = data.name || 'Component';
  
  // Move frame children to component
  while (frame.children.length > 0) {
    component.appendChild(frame.children[0]);
  }
  
  frame.remove();
  
  return component;
}

async function applyAutoLayout(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node || !('layoutMode' in node)) {
    throw new Error('Node does not support Auto Layout');
  }
  
  node.layoutMode = data.layoutMode || 'VERTICAL';
  
  if (data.primaryAxisSizingMode) {
    node.primaryAxisSizingMode = data.primaryAxisSizingMode;
  }
  
  if (data.counterAxisSizingMode) {
    node.counterAxisSizingMode = data.counterAxisSizingMode;
  }
  
  if (data.paddingLeft !== undefined) node.paddingLeft = data.paddingLeft;
  if (data.paddingRight !== undefined) node.paddingRight = data.paddingRight;
  if (data.paddingTop !== undefined) node.paddingTop = data.paddingTop;
  if (data.paddingBottom !== undefined) node.paddingBottom = data.paddingBottom;
  
  if (data.itemSpacing !== undefined) node.itemSpacing = data.itemSpacing;
  
  if (data.primaryAxisAlignItems) {
    node.primaryAxisAlignItems = data.primaryAxisAlignItems;
  }
  
  if (data.counterAxisAlignItems) {
    node.counterAxisAlignItems = data.counterAxisAlignItems;
  }
}

async function exportNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);
  
  const format = data.format || 'PNG';
  const scale = data.scale || 1;
  
  if (!('exportAsync' in node)) throw new Error('Node does not support export');
  const bytes = await (node as SceneNode).exportAsync({
    format,
    constraint: { type: 'SCALE', value: scale }
  });
  
  return {
    bytes: Array.from(bytes),
    format,
    scale
  };
}

async function createStyle(data: any) {
  const { type, name, description, properties } = data;

  let style: PaintStyle | TextStyle | EffectStyle | GridStyle;

  switch (type) {
    case 'PAINT':
      style = figma.createPaintStyle();
      if (properties.paints) {
        style.paints = parseFills(properties.paints);
      }
      break;

    case 'TEXT':
      style = figma.createTextStyle();
      // New text styles default to Inter Regular — load it before setting any properties
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      if (properties.fontName) {
        await figma.loadFontAsync(properties.fontName);
        style.fontName = properties.fontName;
      }
      if (properties.fontSize) style.fontSize = properties.fontSize;
      if (properties.lineHeight) style.lineHeight = properties.lineHeight;
      if (properties.letterSpacing) style.letterSpacing = properties.letterSpacing;
      if (properties.textCase) style.textCase = properties.textCase;
      if (properties.textDecoration) style.textDecoration = properties.textDecoration;
      break;

    case 'EFFECT':
      style = figma.createEffectStyle();
      if (properties.effects) {
        style.effects = parseEffects(properties.effects);
      }
      break;

    case 'GRID':
      style = figma.createGridStyle();
      if (properties.layoutGrids) {
        style.layoutGrids = parseLayoutGrids(properties.layoutGrids);
      }
      break;

    default:
      throw new Error(`Unknown style type: ${type}`);
  }

  style.name = name;
  if (description) style.description = description;
  return style;
}

function getSelection() {
  return figma.currentPage.selection.map(node => serializeNode(node));
}

async function setSelection(data: any) {
  const nodes = data.ids.map((id: string) => figma.getNodeById(id)).filter(Boolean);
  figma.currentPage.selection = nodes as SceneNode[];
}

// ===== COMPONENT VARIANT OPERATIONS =====

async function createComponentSet(data: any) {
  const components: ComponentNode[] = [];
  for (const id of data.componentIds) {
    const node = figma.getNodeById(id);
    if (!node || node.type !== 'COMPONENT') {
      throw new Error(`Node ${id} is not a component`);
    }
    components.push(node as ComponentNode);
  }

  if (components.length < 2) {
    throw new Error('At least 2 components are required to create a component set');
  }

  const parent = components[0].parent;
  if (!parent || !isContainerNode(parent)) {
    throw new Error('Components must have a valid parent');
  }

  const componentSet = figma.combineAsVariants(components, parent);
  return componentSet;
}

async function addVariant(data: any) {
  const setNode = figma.getNodeById(data.componentSetId);
  if (!setNode || setNode.type !== 'COMPONENT_SET') {
    throw new Error(`Node ${data.componentSetId} is not a component set`);
  }

  const newVariant = figma.createComponent();
  if (data.name) newVariant.name = data.name;

  // Copy dimensions from first existing variant
  const existingVariant = (setNode as ComponentSetNode).children[0] as ComponentNode;
  if (existingVariant) {
    newVariant.resize(existingVariant.width, existingVariant.height);
  }

  (setNode as ComponentSetNode).appendChild(newVariant);
  return newVariant;
}

// ===== STROKE OPERATIONS =====

async function setStrokes(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);

  if (!('strokes' in node)) {
    throw new Error('Node does not support strokes');
  }

  if (data.strokes) {
    (node as any).strokes = parseFills(data.strokes);
  }
  if (data.strokeWeight !== undefined) {
    (node as any).strokeWeight = data.strokeWeight;
  }
  if (data.strokeAlign) {
    (node as any).strokeAlign = data.strokeAlign;
  }
  if (data.dashPattern) {
    (node as any).dashPattern = data.dashPattern;
  }
}

// ===== EFFECT OPERATIONS =====

async function setEffects(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);

  if (!('effects' in node)) {
    throw new Error('Node does not support effects');
  }

  const effects: Effect[] = data.effects.map((e: any) => {
    const base: any = {
      type: e.type,
      visible: e.visible !== undefined ? e.visible : true,
    };

    if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
      const rgb = e.color ? hexToRgb(e.color) : { r: 0, g: 0, b: 0 };
      base.color = {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: e.opacity !== undefined ? e.opacity : 0.25,
      };
      base.offset = e.offset || { x: 0, y: 4 };
      base.radius = e.radius || 4;
      base.spread = e.spread || 0;
    } else if (e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR') {
      base.radius = e.radius || 4;
    }

    return base;
  });

  (node as any).effects = effects;
}

// ===== TEXT STYLE OPERATIONS =====

async function setTextStyle(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node || node.type !== 'TEXT') {
    throw new Error(`Node ${data.id} is not a text node`);
  }

  const textNode = node as TextNode;

  // Must load font before modifying any text properties
  const currentFont = textNode.fontName;
  if (currentFont !== figma.mixed) {
    await figma.loadFontAsync(currentFont);
  } else {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }

  if (data.fontName) {
    await figma.loadFontAsync(data.fontName);
    textNode.fontName = data.fontName;
  }

  if (data.fontSize !== undefined) textNode.fontSize = data.fontSize;
  if (data.textAlignHorizontal) textNode.textAlignHorizontal = data.textAlignHorizontal;
  if (data.textAlignVertical) textNode.textAlignVertical = data.textAlignVertical;
  if (data.lineHeight) textNode.lineHeight = data.lineHeight;
  if (data.letterSpacing) textNode.letterSpacing = data.letterSpacing;
  if (data.textDecoration) textNode.textDecoration = data.textDecoration;
  if (data.textCase) textNode.textCase = data.textCase;
  if (data.textAutoResize) textNode.textAutoResize = data.textAutoResize;
}

// ===== NODE MANIPULATION OPERATIONS =====

async function cloneNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);

  if (!('clone' in node)) {
    throw new Error('Node does not support cloning');
  }

  const clone = (node as SceneNode).clone();
  if (data.name) clone.name = data.name;
  if (data.x !== undefined) clone.x = data.x;
  if (data.y !== undefined) clone.y = data.y;

  return clone;
}

async function groupNodes(data: any) {
  const nodes: SceneNode[] = [];
  for (const id of data.ids) {
    const node = figma.getNodeById(id);
    if (!node) throw new Error(`Node ${id} not found`);
    nodes.push(node as SceneNode);
  }

  if (nodes.length === 0) throw new Error('No valid nodes to group');

  const parent = nodes[0].parent;
  if (!parent || !isContainerNode(parent)) {
    throw new Error('Nodes must have a valid parent');
  }

  const group = figma.group(nodes, parent);
  if (data.name) group.name = data.name;

  return group;
}

async function ungroupNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node || node.type !== 'GROUP') {
    throw new Error(`Node ${data.id} is not a group`);
  }

  const group = node as GroupNode;
  const parent = group.parent;
  if (!parent || !isContainerNode(parent)) {
    throw new Error('Group parent does not support children');
  }

  const children = [...group.children];
  const groupIndex = parent.children.indexOf(group);
  for (let i = children.length - 1; i >= 0; i--) {
    parent.insertChild(groupIndex, children[i]);
  }
}

async function moveNode(data: any) {
  const node = figma.getNodeById(data.id);
  if (!node) throw new Error(`Node ${data.id} not found`);

  const parent = figma.getNodeById(data.parentId);
  if (!parent || !isContainerNode(parent)) {
    throw new Error(`Target parent ${data.parentId} is not a valid container`);
  }

  if (data.index !== undefined) {
    parent.insertChild(data.index, node as SceneNode);
  } else {
    parent.appendChild(node as SceneNode);
  }
}

// ===== UTILITY FUNCTIONS =====

function parseFills(fills: any): Paint[] {
  if (Array.isArray(fills)) {
    return fills.map(fill => {
      if (typeof fill === 'string') {
        // Hex color
        return {
          type: 'SOLID',
          color: hexToRgb(fill)
        };
      } else if (fill.type === 'SOLID') {
        return {
          type: 'SOLID',
          color: fill.color,
          opacity: fill.opacity !== undefined ? fill.opacity : 1
        };
      }
      return fill;
    });
  }
  return [];
}

function hexToRgb(hex: string): RGB {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255
  };
}

function serializeNode(node: BaseNode): any {
  const base: any = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: 'visible' in node ? (node as SceneNode).visible : undefined,
    locked: 'locked' in node ? (node as SceneNode).locked : undefined
  };

  if ('x' in node) base.x = node.x;
  if ('y' in node) base.y = node.y;
  if ('width' in node) base.width = node.width;
  if ('height' in node) base.height = node.height;
  if ('opacity' in node) base.opacity = node.opacity;
  if ('rotation' in node) base.rotation = (node as any).rotation;
  if ('fills' in node) base.fills = node.fills;
  if ('strokes' in node) base.strokes = (node as any).strokes;
  if ('strokeWeight' in node) base.strokeWeight = (node as any).strokeWeight;
  if ('effects' in node) base.effects = (node as any).effects;
  if ('cornerRadius' in node) {
    base.cornerRadius = (node as any).cornerRadius;
    if ('topLeftRadius' in node) {
      base.topLeftRadius = (node as any).topLeftRadius;
      base.topRightRadius = (node as any).topRightRadius;
      base.bottomLeftRadius = (node as any).bottomLeftRadius;
      base.bottomRightRadius = (node as any).bottomRightRadius;
    }
  }

  if ('boundVariables' in node) {
    base.boundVariables = (node as any).boundVariables;
  }

  if ('children' in node) {
    base.children = node.children.map(child => ({
      id: child.id,
      name: child.name,
      type: child.type
    }));
  }

  return base;
}

function hexToRgba(hex: string): RGBA {
  hex = hex.replace('#', '');
  const hasAlpha = hex.length === 8;
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    a: hasAlpha ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
  };
}

function parseEffects(effects: any[]): Effect[] {
  return effects.map((e: any) => {
    const base: any = {
      type: e.type,
      visible: e.visible !== undefined ? e.visible : true,
    };

    if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
      const rgb = e.color ? hexToRgb(e.color) : { r: 0, g: 0, b: 0 };
      base.color = {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: e.opacity !== undefined ? e.opacity : 0.25,
      };
      base.offset = e.offset || { x: 0, y: 4 };
      base.radius = e.radius || 4;
      base.spread = e.spread || 0;
    } else if (e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR') {
      base.radius = e.radius || 4;
    }

    return base;
  });
}

function parseLayoutGrids(grids: any[]): LayoutGrid[] {
  return grids.map((g: any) => {
    const base: any = {
      pattern: g.pattern,
      visible: g.visible !== undefined ? g.visible : true,
    };

    if (g.color) {
      base.color = hexToRgba(g.color);
    }

    if (g.pattern === 'COLUMNS' || g.pattern === 'ROWS') {
      if (g.sectionSize !== undefined) base.sectionSize = g.sectionSize;
      if (g.count !== undefined) base.count = g.count;
      if (g.offset !== undefined) base.offset = g.offset;
      if (g.gutterSize !== undefined) base.gutterSize = g.gutterSize;
      if (g.alignment) base.alignment = g.alignment;
    } else if (g.pattern === 'GRID') {
      if (g.sectionSize !== undefined) base.sectionSize = g.sectionSize;
    }

    return base;
  });
}

function serializeStyle(style: PaintStyle | TextStyle | EffectStyle | GridStyle): any {
  const base = {
    id: style.id,
    name: style.name,
    type: style.type,
    description: style.description,
    key: style.key,
    remote: style.remote,
  };

  switch (style.type) {
    case 'PAINT':
      return {
        ...base,
        paints: (style as PaintStyle).paints,
      };

    case 'TEXT':
      const textStyle = style as TextStyle;
      return {
        ...base,
        fontSize: textStyle.fontSize,
        fontName: textStyle.fontName,
        lineHeight: textStyle.lineHeight,
        letterSpacing: textStyle.letterSpacing,
        textCase: textStyle.textCase,
        textDecoration: textStyle.textDecoration,
      };

    case 'EFFECT':
      return {
        ...base,
        effects: (style as EffectStyle).effects,
      };

    case 'GRID':
      return {
        ...base,
        layoutGrids: (style as GridStyle).layoutGrids,
      };

    default:
      return base;
  }
}

// ===== NEW TOOL HANDLERS =====

async function createLine(data: any) {
  const line = figma.createLine();

  if (data.name) line.name = data.name;
  if (data.x !== undefined) line.x = data.x;
  if (data.y !== undefined) line.y = data.y;
  if (data.length !== undefined) line.resize(data.length, 0);
  if (data.rotation !== undefined) line.rotation = data.rotation;

  if (data.strokes) {
    line.strokes = parseFills(data.strokes);
  }
  if (data.strokeWeight !== undefined) line.strokeWeight = data.strokeWeight;
  if (data.strokeCap !== undefined) (line as any).strokeCap = data.strokeCap;
  if (data.dashPattern) line.dashPattern = data.dashPattern;

  if (data.parent) {
    const parent = figma.getNodeById(data.parent);
    if (parent && isContainerNode(parent)) {
      parent.appendChild(line);
    }
  } else {
    figma.currentPage.appendChild(line);
  }

  return line;
}

async function createNewPage(data: any) {
  const page = figma.createPage();
  if (data.name) page.name = data.name;
  if (data.switchToPage) figma.currentPage = page;
  return page;
}

function createPageDividerNode(data: any) {
  const divider = data.name ? figma.createPageDivider(data.name) : figma.createPageDivider();
  return divider;
}

function createComponentFromNodeHandler(data: any) {
  const node = figma.getNodeById(data.nodeId);
  if (!node) throw new Error(`Node ${data.nodeId} not found`);

  const component = figma.createComponentFromNode(node as SceneNode);
  return component;
}

function performBooleanOperation(data: any) {
  const nodes: SceneNode[] = [];
  for (const id of data.nodeIds) {
    const node = figma.getNodeById(id);
    if (!node) throw new Error(`Node ${id} not found`);
    nodes.push(node as SceneNode);
  }

  if (nodes.length < 2) throw new Error('At least 2 nodes are required for a boolean operation');

  const parent = nodes[0].parent;
  if (!parent || !isContainerNode(parent)) {
    throw new Error('Nodes must have a valid parent');
  }

  let result: BooleanOperationNode;
  switch (data.operation) {
    case 'UNION':
      result = figma.union(nodes, parent);
      break;
    case 'SUBTRACT':
      result = figma.subtract(nodes, parent);
      break;
    case 'INTERSECT':
      result = figma.intersect(nodes, parent);
      break;
    case 'EXCLUDE':
      result = figma.exclude(nodes, parent);
      break;
    default:
      throw new Error(`Unknown boolean operation: ${data.operation}`);
  }

  if (data.name) result.name = data.name;
  return result;
}

function createSectionNode(data: any) {
  const section = figma.createSection();

  if (data.name) section.name = data.name;
  if (data.x !== undefined) section.x = data.x;
  if (data.y !== undefined) section.y = data.y;
  if (data.width !== undefined || data.height !== undefined) {
    const w = data.width !== undefined ? data.width : section.width;
    const h = data.height !== undefined ? data.height : section.height;
    section.resizeWithoutConstraints(w, h);
  }

  if (data.fills) {
    section.fills = parseFills(data.fills);
  }
  if (data.contentsHidden !== undefined) {
    section.sectionContentsHidden = data.contentsHidden;
  }

  return section;
}

function createVariableCollectionHandler(data: any) {
  const collection = figma.variables.createVariableCollection(data.name);

  // Rename default mode if requested
  if (data.initialModeRename) {
    collection.renameMode(collection.modes[0].modeId, data.initialModeRename);
  }

  // Add additional modes
  if (data.modes && data.modes.length > 0) {
    for (const mode of data.modes) {
      collection.addMode(mode.name);
    }
  }

  return {
    id: collection.id,
    name: collection.name,
    modes: collection.modes,
    defaultModeId: collection.defaultModeId,
  };
}

function createVariableHandler(data: any) {
  const collection = figma.variables.getVariableCollectionById(data.collectionId);
  if (!collection) throw new Error(`Collection ${data.collectionId} not found`);

  const variable = figma.variables.createVariable(
    data.name,
    collection,
    data.resolvedType
  );

  if (data.description) variable.description = data.description;
  if (data.hiddenFromPublishing !== undefined) variable.hiddenFromPublishing = data.hiddenFromPublishing;
  if (data.scopes) variable.scopes = data.scopes;

  // Set values for each mode
  if (data.values) {
    for (const [modeId, value] of Object.entries(data.values)) {
      let resolvedValue = value;
      // Convert hex color strings to RGBA for COLOR type
      if (data.resolvedType === 'COLOR' && typeof value === 'string') {
        resolvedValue = hexToRgba(value as string);
      }
      variable.setValueForMode(modeId, resolvedValue as VariableValue);
    }
  }

  return {
    id: variable.id,
    name: variable.name,
    resolvedType: variable.resolvedType,
    collectionId: variable.variableCollectionId,
  };
}

async function getLocalVariablesHandler(data: any) {
  const variables = await figma.variables.getLocalVariablesAsync(data.type);
  return variables.map(v => ({
    id: v.id,
    name: v.name,
    resolvedType: v.resolvedType,
    collectionId: v.variableCollectionId,
    description: v.description,
    valuesByMode: v.valuesByMode,
  }));
}

async function getLocalVariableCollectionsHandler() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  return collections.map(c => ({
    id: c.id,
    name: c.name,
    modes: c.modes,
    defaultModeId: c.defaultModeId,
    variableIds: c.variableIds,
    remote: c.remote,
  }));
}

async function updateVariableHandler(data: any) {
  const variable = await figma.variables.getVariableByIdAsync(data.variableId);
  if (!variable) throw new Error(`Variable ${data.variableId} not found`);

  if (data.name !== undefined) variable.name = data.name;
  if (data.description !== undefined) variable.description = data.description;
  if (data.hiddenFromPublishing !== undefined) variable.hiddenFromPublishing = data.hiddenFromPublishing;
  if (data.scopes) variable.scopes = data.scopes;

  // Set values for each mode (supports both direct values and aliases)
  if (data.values) {
    for (const [modeId, value] of Object.entries(data.values)) {
      let resolvedValue = value;
      // Check if this is a variable alias reference
      if (typeof value === 'object' && value !== null && (value as any).type === 'VARIABLE_ALIAS') {
        resolvedValue = figma.variables.createVariableAlias(
          await figma.variables.getVariableByIdAsync((value as any).id) as Variable
        );
      } else if (variable.resolvedType === 'COLOR' && typeof value === 'string') {
        resolvedValue = hexToRgba(value as string);
      }
      variable.setValueForMode(modeId, resolvedValue as VariableValue);
    }
  }

  return {
    id: variable.id,
    name: variable.name,
    resolvedType: variable.resolvedType,
    description: variable.description,
  };
}

async function deleteVariableHandler(data: any) {
  const variable = await figma.variables.getVariableByIdAsync(data.variableId);
  if (!variable) throw new Error(`Variable ${data.variableId} not found`);
  variable.remove();
}

async function deleteVariableCollectionHandler(data: any) {
  const collection = figma.variables.getVariableCollectionById(data.collectionId);
  if (!collection) throw new Error(`Collection ${data.collectionId} not found`);
  collection.remove();
}

function renameVariableCollectionModeHandler(data: any) {
  const collection = figma.variables.getVariableCollectionById(data.collectionId);
  if (!collection) throw new Error(`Collection ${data.collectionId} not found`);
  collection.renameMode(data.modeId, data.newName);
  return {
    id: collection.id,
    name: collection.name,
    modes: collection.modes,
  };
}

function addCollectionModeHandler(data: any) {
  const collection = figma.variables.getVariableCollectionById(data.collectionId);
  if (!collection) throw new Error(`Collection ${data.collectionId} not found`);
  collection.addMode(data.name);
  return {
    id: collection.id,
    name: collection.name,
    modes: collection.modes,
  };
}

async function bindVariableToStyleHandler(data: any) {
  const style = figma.getStyleById(data.styleId);
  if (!style) throw new Error(`Style ${data.styleId} not found`);
  if (style.type !== 'TEXT') throw new Error(`Style ${data.styleId} is not a text style`);

  const variable = await figma.variables.getVariableByIdAsync(data.variableId);
  if (!variable) throw new Error(`Variable ${data.variableId} not found`);

  const textStyle = style as TextStyle;
  textStyle.setBoundVariable(data.field as VariableBindableTextField, variable);

  return { id: textStyle.id, name: textStyle.name, field: data.field, variableId: variable.id };
}

async function bindVariableToNodeHandler(data: any) {
  const node = figma.getNodeById(data.nodeId);
  if (!node) throw new Error(`Node ${data.nodeId} not found`);

  const variable = await figma.variables.getVariableByIdAsync(data.variableId);
  if (!variable) throw new Error(`Variable ${data.variableId} not found`);

  const field = data.field; // e.g., 'fills', 'strokes', 'cornerRadius', etc.

  if (field === 'fills' || field === 'strokes') {
    // Bind variable to fills or strokes paint array
    const index = data.index ?? 0;
    if (!(field in node)) throw new Error(`Node does not have ${field} property`);
    const paints = (node as any)[field] as Paint[];
    if (!paints || paints.length <= index) {
      throw new Error(`No ${field} at index ${index}`);
    }

    // Use setBoundVariable on the paint
    const paint = paints[index] as SolidPaint;
    if (paint.type !== 'SOLID') throw new Error(`Paint at index ${index} is not a solid paint`);

    const newPaint = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
    const newPaints = [...paints];
    newPaints[index] = newPaint;
    (node as any)[field] = newPaints;
  } else {
    // Bind variable to a scalar property (cornerRadius, opacity, etc.)
    if (!('setBoundVariable' in node)) throw new Error(`Node does not support bound variables`);
    (node as SceneNode).setBoundVariable(field as VariableBindableNodeField, variable);
  }
}

async function createTextPathHandler(data: any) {
  const node = figma.getNodeById(data.nodeId);
  if (!node) throw new Error(`Node ${data.nodeId} not found`);

  // Load font before creating text path
  const fontName = data.fontName || { family: "Inter", style: "Regular" };
  await figma.loadFontAsync(fontName);

  const startSegment = data.startSegment ?? 0;
  const startPosition = data.startPosition ?? 0;

  const textPath = figma.createTextPath(node as VectorNode, startSegment, startPosition);

  if (data.characters) textPath.characters = data.characters;
  if (data.fontSize !== undefined) textPath.fontSize = data.fontSize;
  if (data.fontName) textPath.fontName = data.fontName;
  if (data.fills) textPath.fills = parseFills(data.fills);

  return textPath;
}

// ===== STYLE OPERATION HANDLERS =====

async function getStyleHandler(data: any) {
  const style = figma.getStyleById(data.id);
  if (!style) throw new Error(`Style ${data.id} not found`);

  return serializeStyle(style);
}

async function listStylesHandler(data: any) {
  const allStyles = [
    ...figma.getLocalPaintStyles(),
    ...figma.getLocalTextStyles(),
    ...figma.getLocalEffectStyles(),
    ...figma.getLocalGridStyles(),
  ];

  let filtered = allStyles;
  if (data.type) {
    filtered = allStyles.filter(s => s.type === data.type);
  }

  return filtered.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    description: s.description,
    key: s.key,
    remote: s.remote,
  }));
}

async function updateStyleHandler(data: any) {
  const style = figma.getStyleById(data.id);
  if (!style) throw new Error(`Style ${data.id} not found`);

  if (data.name) style.name = data.name;
  if (data.description !== undefined) style.description = data.description;

  if (data.properties) {
    const props = data.properties;

    switch (style.type) {
      case 'PAINT':
        if (props.paints) {
          (style as PaintStyle).paints = parseFills(props.paints);
        }
        break;

      case 'TEXT':
        const textStyle = style as TextStyle;
        // Load the current font before modifying any text properties
        await figma.loadFontAsync(textStyle.fontName);
        if (props.fontName) {
          await figma.loadFontAsync(props.fontName);
          textStyle.fontName = props.fontName;
        }
        if (props.fontSize !== undefined) textStyle.fontSize = props.fontSize;
        if (props.lineHeight) textStyle.lineHeight = props.lineHeight;
        if (props.letterSpacing) textStyle.letterSpacing = props.letterSpacing;
        if (props.textCase) textStyle.textCase = props.textCase;
        if (props.textDecoration) textStyle.textDecoration = props.textDecoration;
        break;

      case 'EFFECT':
        if (props.effects) {
          (style as EffectStyle).effects = parseEffects(props.effects);
        }
        break;

      case 'GRID':
        if (props.layoutGrids) {
          (style as GridStyle).layoutGrids = parseLayoutGrids(props.layoutGrids);
        }
        break;
    }
  }
}

async function deleteStyleHandler(data: any) {
  const style = figma.getStyleById(data.id);
  if (!style) throw new Error(`Style ${data.id} not found`);
  style.remove();
}

async function applyStyleHandler(data: any) {
  const node = figma.getNodeById(data.nodeId);
  if (!node) throw new Error(`Node ${data.nodeId} not found`);

  const style = figma.getStyleById(data.styleId);
  if (!style) throw new Error(`Style ${data.styleId} not found`);

  switch (data.styleType) {
    case 'fill':
      if ('fillStyleId' in node && style.type === 'PAINT') {
        (node as any).fillStyleId = data.styleId;
      } else {
        throw new Error('Node does not support fill styles or style type mismatch');
      }
      break;

    case 'stroke':
      if ('strokeStyleId' in node && style.type === 'PAINT') {
        (node as any).strokeStyleId = data.styleId;
      } else {
        throw new Error('Node does not support stroke styles or style type mismatch');
      }
      break;

    case 'text':
      if (node.type === 'TEXT' && style.type === 'TEXT') {
        (node as TextNode).textStyleId = data.styleId;
      } else {
        throw new Error('Node is not a text node or style type mismatch');
      }
      break;

    case 'effect':
      if ('effectStyleId' in node && style.type === 'EFFECT') {
        (node as any).effectStyleId = data.styleId;
      } else {
        throw new Error('Node does not support effect styles or style type mismatch');
      }
      break;

    case 'grid':
      if ('gridStyleId' in node && style.type === 'GRID') {
        (node as any).gridStyleId = data.styleId;
      } else {
        throw new Error('Node does not support grid styles or style type mismatch');
      }
      break;

    default:
      throw new Error(`Unknown style type: ${data.styleType}`);
  }
}

async function getNodeStylesHandler(data: any) {
  const node = figma.getNodeById(data.nodeId);
  if (!node) throw new Error(`Node ${data.nodeId} not found`);

  const styles: any = {};

  if ('fillStyleId' in node && (node as any).fillStyleId) {
    const styleId = (node as any).fillStyleId;
    const style = figma.getStyleById(styleId);
    if (style) {
      styles.fill = { id: styleId, name: style.name, type: style.type };
    }
  }

  if ('strokeStyleId' in node && (node as any).strokeStyleId) {
    const styleId = (node as any).strokeStyleId;
    const style = figma.getStyleById(styleId);
    if (style) {
      styles.stroke = { id: styleId, name: style.name, type: style.type };
    }
  }

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const textStyleId = textNode.textStyleId;
    if (textStyleId && typeof textStyleId === 'string') {
      const style = figma.getStyleById(textStyleId);
      if (style) {
        styles.text = { id: textStyleId, name: style.name, type: style.type };
      }
    }
  }

  if ('effectStyleId' in node && (node as any).effectStyleId) {
    const styleId = (node as any).effectStyleId;
    const style = figma.getStyleById(styleId);
    if (style) {
      styles.effect = { id: styleId, name: style.name, type: style.type };
    }
  }

  if ('gridStyleId' in node && (node as any).gridStyleId) {
    const styleId = (node as any).gridStyleId;
    const style = figma.getStyleById(styleId);
    if (style) {
      styles.grid = { id: styleId, name: style.name, type: style.type };
    }
  }

  return styles;
}

async function detachStyleHandler(data: any) {
  const node = figma.getNodeById(data.nodeId);
  if (!node) throw new Error(`Node ${data.nodeId} not found`);

  switch (data.styleType) {
    case 'fill':
      if ('fillStyleId' in node) {
        (node as any).fillStyleId = '';
      }
      break;

    case 'stroke':
      if ('strokeStyleId' in node) {
        (node as any).strokeStyleId = '';
      }
      break;

    case 'text':
      if (node.type === 'TEXT') {
        (node as TextNode).textStyleId = '';
      }
      break;

    case 'effect':
      if ('effectStyleId' in node) {
        (node as any).effectStyleId = '';
      }
      break;

    case 'grid':
      if ('gridStyleId' in node) {
        (node as any).gridStyleId = '';
      }
      break;

    default:
      throw new Error(`Unknown style type: ${data.styleType}`);
  }
}
