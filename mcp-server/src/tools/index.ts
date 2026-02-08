/**
 * MCP Tools for Figma Operations
 * 
 * Each tool corresponds to a design operation that can be performed in Figma
 */

import { z } from 'zod';

export interface FigmaTool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  execute: (args: any, sendToFigma: Function) => Promise<any>;
}

// ===== DOCUMENT OPERATIONS =====

export const getDocumentInfo: FigmaTool = {
  name: 'figma_get_document_info',
  description: 'Get information about the current Figma document including pages, selection, and structure',
  inputSchema: z.object({}),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-document-info');
  },
};

export const getNode: FigmaTool = {
  name: 'figma_get_node',
  description: 'Get detailed information about a specific node by ID',
  inputSchema: z.object({
    id: z.string().describe('The node ID to retrieve'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-node', { id: args.id });
  },
};

// ===== CREATE OPERATIONS =====

export const createFrame: FigmaTool = {
  name: 'figma_create_frame',
  description: 'Create a new frame (container) in Figma',
  inputSchema: z.object({
    name: z.string().optional().describe('Name of the frame'),
    x: z.number().optional().describe('X position'),
    y: z.number().optional().describe('Y position'),
    width: z.number().optional().describe('Width in pixels'),
    height: z.number().optional().describe('Height in pixels'),
    fills: z.array(z.any()).optional().describe('Fill colors (hex strings or fill objects)'),
    cornerRadius: z.number().optional().describe('Uniform corner radius in pixels'),
    topLeftRadius: z.number().optional().describe('Top-left corner radius'),
    topRightRadius: z.number().optional().describe('Top-right corner radius'),
    bottomLeftRadius: z.number().optional().describe('Bottom-left corner radius'),
    bottomRightRadius: z.number().optional().describe('Bottom-right corner radius'),
    parent: z.string().optional().describe('Parent node ID (defaults to current page)'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-frame', args);
  },
};

export const createRectangle: FigmaTool = {
  name: 'figma_create_rectangle',
  description: 'Create a rectangle shape',
  inputSchema: z.object({
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    fills: z.array(z.any()).optional(),
    cornerRadius: z.number().optional().describe('Corner radius in pixels'),
    parent: z.string().optional(),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-rectangle', args);
  },
};

export const createText: FigmaTool = {
  name: 'figma_create_text',
  description: 'Create a text layer',
  inputSchema: z.object({
    characters: z.string().describe('The text content'),
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    fontSize: z.number().optional().describe('Font size in pixels'),
    fontName: z.object({
      family: z.string(),
      style: z.string(),
    }).optional(),
    fills: z.array(z.any()).optional(),
    parent: z.string().optional(),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-text', args);
  },
};

export const createEllipse: FigmaTool = {
  name: 'figma_create_ellipse',
  description: 'Create an ellipse/circle shape',
  inputSchema: z.object({
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    fills: z.array(z.any()).optional(),
    parent: z.string().optional(),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-ellipse', args);
  },
};

export const createComponent: FigmaTool = {
  name: 'figma_create_component',
  description: 'Create a reusable component',
  inputSchema: z.object({
    name: z.string().describe('Component name'),
    width: z.number().optional(),
    height: z.number().optional(),
    parent: z.string().optional(),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-component', args);
  },
};

// ===== MODIFY OPERATIONS =====

export const modifyNode: FigmaTool = {
  name: 'figma_modify_node',
  description: 'Modify properties of an existing node',
  inputSchema: z.object({
    id: z.string().describe('Node ID to modify'),
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    fills: z.array(z.any()).optional(),
    opacity: z.number().optional().describe('Opacity 0-1'),
    visible: z.boolean().optional(),
    locked: z.boolean().optional(),
    cornerRadius: z.number().optional().describe('Uniform corner radius (frames, rectangles, components)'),
    topLeftRadius: z.number().optional().describe('Top-left corner radius'),
    topRightRadius: z.number().optional().describe('Top-right corner radius'),
    bottomLeftRadius: z.number().optional().describe('Bottom-left corner radius'),
    bottomRightRadius: z.number().optional().describe('Bottom-right corner radius'),
    rotation: z.number().optional().describe('Rotation in degrees (counterclockwise)'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('modify-node', args);
  },
};

export const deleteNode: FigmaTool = {
  name: 'figma_delete_node',
  description: 'Delete a node from the document',
  inputSchema: z.object({
    id: z.string().describe('Node ID to delete'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('delete-node', args);
  },
};

export const applyAutoLayout: FigmaTool = {
  name: 'figma_apply_auto_layout',
  description: 'Apply Auto Layout to a frame for responsive design',
  inputSchema: z.object({
    id: z.string().describe('Frame ID to apply Auto Layout to'),
    layoutMode: z.enum(['HORIZONTAL', 'VERTICAL']).optional(),
    primaryAxisSizingMode: z.enum(['FIXED', 'AUTO']).optional(),
    counterAxisSizingMode: z.enum(['FIXED', 'AUTO']).optional(),
    paddingLeft: z.number().optional(),
    paddingRight: z.number().optional(),
    paddingTop: z.number().optional(),
    paddingBottom: z.number().optional(),
    itemSpacing: z.number().optional().describe('Space between items'),
    primaryAxisAlignItems: z.enum(['MIN', 'CENTER', 'MAX', 'SPACE_BETWEEN']).optional(),
    counterAxisAlignItems: z.enum(['MIN', 'CENTER', 'MAX']).optional(),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('apply-auto-layout', args);
  },
};

// ===== STYLE OPERATIONS =====

export const createStyle: FigmaTool = {
  name: 'figma_create_style',
  description: 'Create a reusable style (paint/color, text, effect, or grid). Styles allow consistent design tokens across your document.',
  inputSchema: z.object({
    type: z.enum(['PAINT', 'TEXT', 'EFFECT', 'GRID']).describe('Style type'),
    name: z.string().describe('Style name (can include "/" for grouping, e.g., "Colors/Primary/Blue")'),
    description: z.string().optional().describe('Style description for documentation'),
    properties: z.object({
      // Paint style properties
      paints: z.array(z.any()).optional().describe('For PAINT: Array of paint objects or hex strings (e.g., ["#FF0000"])'),

      // Text style properties
      fontSize: z.number().optional().describe('For TEXT: Font size in pixels'),
      fontName: z.object({
        family: z.string(),
        style: z.string(),
      }).optional().describe('For TEXT: Font family and style'),
      lineHeight: z.any().optional().describe('For TEXT: Line height - {unit: "AUTO"} or {value: 24, unit: "PIXELS"}'),
      letterSpacing: z.object({
        value: z.number(),
        unit: z.enum(['PIXELS', 'PERCENT']),
      }).optional().describe('For TEXT: Letter spacing'),
      textCase: z.enum(['ORIGINAL', 'UPPER', 'LOWER', 'TITLE']).optional().describe('For TEXT: Text case transformation'),
      textDecoration: z.enum(['NONE', 'UNDERLINE', 'STRIKETHROUGH']).optional().describe('For TEXT: Text decoration'),

      // Effect style properties
      effects: z.array(z.object({
        type: z.enum(['DROP_SHADOW', 'INNER_SHADOW', 'LAYER_BLUR', 'BACKGROUND_BLUR']),
        color: z.string().optional().describe('Hex color for shadows'),
        opacity: z.number().optional().describe('Shadow opacity 0-1'),
        offset: z.object({ x: z.number(), y: z.number() }).optional(),
        radius: z.number().describe('Blur radius'),
        spread: z.number().optional().describe('Shadow spread'),
        visible: z.boolean().optional(),
      })).optional().describe('For EFFECT: Array of effects'),

      // Grid style properties
      layoutGrids: z.array(z.object({
        pattern: z.enum(['COLUMNS', 'ROWS', 'GRID']),
        sectionSize: z.number().optional().describe('Column/row width or grid size'),
        count: z.number().optional().describe('Number of columns/rows'),
        offset: z.number().optional().describe('Offset from edge'),
        gutterSize: z.number().optional().describe('Space between columns/rows'),
        alignment: z.enum(['MIN', 'MAX', 'STRETCH', 'CENTER']).optional(),
        color: z.string().optional().describe('Grid color (hex)'),
        visible: z.boolean().optional(),
      })).optional().describe('For GRID: Array of layout grids'),
    }).describe('Style properties based on type'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-style', args);
  },
};

export const getStyle: FigmaTool = {
  name: 'figma_get_style',
  description: 'Get a style by ID and retrieve its properties',
  inputSchema: z.object({
    id: z.string().describe('Style ID'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-style', args);
  },
};

export const listStyles: FigmaTool = {
  name: 'figma_list_styles',
  description: 'List all local styles in the document, optionally filtered by type',
  inputSchema: z.object({
    type: z.enum(['PAINT', 'TEXT', 'EFFECT', 'GRID']).optional().describe('Filter by style type'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('list-styles', args);
  },
};

export const updateStyle: FigmaTool = {
  name: 'figma_update_style',
  description: 'Update an existing style\'s properties',
  inputSchema: z.object({
    id: z.string().describe('Style ID to update'),
    name: z.string().optional().describe('New style name'),
    description: z.string().optional().describe('New style description'),
    properties: z.object({
      paints: z.array(z.any()).optional(),
      fontSize: z.number().optional(),
      fontName: z.object({ family: z.string(), style: z.string() }).optional(),
      lineHeight: z.any().optional(),
      letterSpacing: z.object({ value: z.number(), unit: z.enum(['PIXELS', 'PERCENT']) }).optional(),
      textCase: z.enum(['ORIGINAL', 'UPPER', 'LOWER', 'TITLE']).optional(),
      textDecoration: z.enum(['NONE', 'UNDERLINE', 'STRIKETHROUGH']).optional(),
      effects: z.array(z.any()).optional(),
      layoutGrids: z.array(z.any()).optional(),
    }).optional().describe('Properties to update'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('update-style', args);
  },
};

export const deleteStyle: FigmaTool = {
  name: 'figma_delete_style',
  description: 'Delete a style from the document. Nodes using this style will retain their appearance but lose the style link.',
  inputSchema: z.object({
    id: z.string().describe('Style ID to delete'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('delete-style', args);
  },
};

export const applyStyle: FigmaTool = {
  name: 'figma_apply_style',
  description: 'Apply a style to a node. The style type must match the node capabilities (e.g., paint styles for fills, text styles for text nodes).',
  inputSchema: z.object({
    nodeId: z.string().describe('Node ID to apply style to'),
    styleId: z.string().describe('Style ID to apply'),
    styleType: z.enum(['fill', 'stroke', 'text', 'effect', 'grid']).describe('What aspect to apply the style to'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('apply-style', args);
  },
};

export const getNodeStyles: FigmaTool = {
  name: 'figma_get_node_styles',
  description: 'Get all styles currently applied to a node',
  inputSchema: z.object({
    nodeId: z.string().describe('Node ID'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-node-styles', args);
  },
};

export const detachStyle: FigmaTool = {
  name: 'figma_detach_style',
  description: 'Detach a style from a node while keeping the appearance. The node will retain the visual properties but no longer be linked to the style.',
  inputSchema: z.object({
    nodeId: z.string().describe('Node ID'),
    styleType: z.enum(['fill', 'stroke', 'text', 'effect', 'grid']).describe('Which style aspect to detach'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('detach-style', args);
  },
};

// ===== SELECTION OPERATIONS =====

export const getSelection: FigmaTool = {
  name: 'figma_get_selection',
  description: 'Get currently selected nodes',
  inputSchema: z.object({}),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-selection');
  },
};

export const setSelection: FigmaTool = {
  name: 'figma_set_selection',
  description: 'Set selection to specific nodes',
  inputSchema: z.object({
    ids: z.array(z.string()).describe('Array of node IDs to select'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('set-selection', args);
  },
};

// ===== EXPORT OPERATIONS =====

export const exportNode: FigmaTool = {
  name: 'figma_export_node',
  description: 'Export a node as an image',
  inputSchema: z.object({
    id: z.string().describe('Node ID to export'),
    format: z.enum(['PNG', 'JPG', 'SVG', 'PDF']).optional(),
    scale: z.number().optional().describe('Export scale (1, 2, 3, etc.)'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('export-node', args);
  },
};

// ===== COMPONENT VARIANT OPERATIONS =====

export const createComponentSet: FigmaTool = {
  name: 'figma_create_component_set',
  description: 'Create a component set (variant group) from existing components. Components should have names following the "Property=Value" convention (e.g., "Size=Large, State=Default").',
  inputSchema: z.object({
    componentIds: z.array(z.string()).describe('Array of component IDs to combine as variants'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-component-set', args);
  },
};

export const addVariant: FigmaTool = {
  name: 'figma_add_variant',
  description: 'Add a new variant to an existing component set',
  inputSchema: z.object({
    componentSetId: z.string().describe('ID of the component set to add variant to'),
    name: z.string().optional().describe('Variant name following Property=Value convention (e.g., "Size=Large, State=Hover")'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('add-variant', args);
  },
};

// ===== STROKE OPERATIONS =====

export const setStrokes: FigmaTool = {
  name: 'figma_set_strokes',
  description: 'Set stroke (border) properties on a node',
  inputSchema: z.object({
    id: z.string().describe('Node ID'),
    strokes: z.array(z.any()).describe('Stroke paints array - hex strings or paint objects (same format as fills)'),
    strokeWeight: z.number().optional().describe('Stroke weight in pixels'),
    strokeAlign: z.enum(['INSIDE', 'OUTSIDE', 'CENTER']).optional().describe('Stroke alignment'),
    dashPattern: z.array(z.number()).optional().describe('Dash pattern array, e.g., [10, 5] for dashed'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('set-strokes', args);
  },
};

// ===== EFFECT OPERATIONS =====

export const setEffects: FigmaTool = {
  name: 'figma_set_effects',
  description: 'Set effects (drop shadow, inner shadow, blur) on a node',
  inputSchema: z.object({
    id: z.string().describe('Node ID'),
    effects: z.array(z.object({
      type: z.enum(['DROP_SHADOW', 'INNER_SHADOW', 'LAYER_BLUR', 'BACKGROUND_BLUR']),
      color: z.string().optional().describe('Hex color for shadows (e.g., "#000000")'),
      opacity: z.number().optional().describe('Shadow opacity 0-1 (default 0.25)'),
      offset: z.object({
        x: z.number(),
        y: z.number(),
      }).optional().describe('Shadow offset in pixels'),
      radius: z.number().describe('Blur radius in pixels'),
      spread: z.number().optional().describe('Shadow spread in pixels'),
      visible: z.boolean().optional(),
    })).describe('Array of effects to apply'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('set-effects', args);
  },
};

// ===== TEXT STYLE OPERATIONS =====

export const setTextStyle: FigmaTool = {
  name: 'figma_set_text_style',
  description: 'Set advanced text styling properties on a text node',
  inputSchema: z.object({
    id: z.string().describe('Text node ID'),
    fontName: z.object({
      family: z.string(),
      style: z.string(),
    }).optional().describe('Font family and style (e.g., {family: "Inter", style: "Bold"})'),
    fontSize: z.number().optional(),
    textAlignHorizontal: z.enum(['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED']).optional(),
    textAlignVertical: z.enum(['TOP', 'CENTER', 'BOTTOM']).optional(),
    lineHeight: z.any().optional().describe('Line height - {unit: "AUTO"} or {value: 24, unit: "PIXELS"} or {value: 150, unit: "PERCENT"}'),
    letterSpacing: z.object({
      value: z.number(),
      unit: z.enum(['PIXELS', 'PERCENT']),
    }).optional(),
    textDecoration: z.enum(['NONE', 'UNDERLINE', 'STRIKETHROUGH']).optional(),
    textCase: z.enum(['ORIGINAL', 'UPPER', 'LOWER', 'TITLE']).optional(),
    textAutoResize: z.enum(['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE']).optional(),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('set-text-style', args);
  },
};

// ===== NODE MANIPULATION OPERATIONS =====

export const cloneNode: FigmaTool = {
  name: 'figma_clone_node',
  description: 'Clone (duplicate) a node. The clone appears in the same parent.',
  inputSchema: z.object({
    id: z.string().describe('Node ID to clone'),
    name: z.string().optional().describe('New name for the cloned node'),
    x: z.number().optional().describe('X position for the clone'),
    y: z.number().optional().describe('Y position for the clone'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('clone-node', args);
  },
};

export const groupNodes: FigmaTool = {
  name: 'figma_group_nodes',
  description: 'Group multiple nodes together',
  inputSchema: z.object({
    ids: z.array(z.string()).describe('Array of node IDs to group'),
    name: z.string().optional().describe('Name for the group'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('group-nodes', args);
  },
};

export const ungroupNode: FigmaTool = {
  name: 'figma_ungroup',
  description: 'Ungroup a group node, moving its children to the parent',
  inputSchema: z.object({
    id: z.string().describe('Group node ID to ungroup'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('ungroup', args);
  },
};

export const moveNode: FigmaTool = {
  name: 'figma_move_node',
  description: 'Move a node to a new parent (reparent)',
  inputSchema: z.object({
    id: z.string().describe('Node ID to move'),
    parentId: z.string().describe('New parent node ID'),
    index: z.number().optional().describe('Position index within new parent children (0 = first). Appends at end if omitted.'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('move-node', args);
  },
};

// ===== LINE OPERATIONS =====

export const createLine: FigmaTool = {
  name: 'figma_create_line',
  description: 'Create a line node. Default is 100px wide with a black stroke.',
  inputSchema: z.object({
    name: z.string().optional().describe('Name of the line'),
    x: z.number().optional().describe('X position'),
    y: z.number().optional().describe('Y position'),
    length: z.number().optional().describe('Length of the line in pixels'),
    rotation: z.number().optional().describe('Rotation in degrees'),
    strokes: z.array(z.any()).optional().describe('Stroke paints (hex strings or paint objects)'),
    strokeWeight: z.number().optional().describe('Stroke weight in pixels'),
    strokeCap: z.enum(['NONE', 'ROUND', 'SQUARE', 'ARROW_LINES', 'ARROW_EQUILATERAL']).optional().describe('Stroke cap style'),
    dashPattern: z.array(z.number()).optional().describe('Dash pattern, e.g. [10, 5]'),
    parent: z.string().optional().describe('Parent node ID'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-line', args);
  },
};

// ===== PAGE OPERATIONS =====

export const createPage: FigmaTool = {
  name: 'figma_create_page',
  description: 'Create a new page in the document. Optionally switch to it.',
  inputSchema: z.object({
    name: z.string().optional().describe('Name for the new page'),
    switchToPage: z.boolean().optional().describe('Whether to switch to the new page after creation (default false)'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-page', args);
  },
};

export const createPageDivider: FigmaTool = {
  name: 'figma_create_page_divider',
  description: 'Create a page divider in the pages panel. A divider visually separates pages.',
  inputSchema: z.object({
    name: z.string().optional().describe('Divider name (must be all asterisks, en dashes, em dashes, or spaces). Defaults to "---".'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-page-divider', args);
  },
};

// ===== COMPONENT FROM NODE =====

export const createComponentFromNode: FigmaTool = {
  name: 'figma_create_component_from_node',
  description: 'Convert an existing node into a component, preserving all properties and children. Similar to "Create component" in Figma toolbar.',
  inputSchema: z.object({
    nodeId: z.string().describe('ID of the node to convert to a component'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-component-from-node', args);
  },
};

// ===== BOOLEAN OPERATIONS =====

export const booleanOperation: FigmaTool = {
  name: 'figma_boolean_operation',
  description: 'Perform a boolean operation (union, subtract, intersect, exclude) on multiple nodes to create a combined shape.',
  inputSchema: z.object({
    operation: z.enum(['UNION', 'SUBTRACT', 'INTERSECT', 'EXCLUDE']).describe('Type of boolean operation'),
    nodeIds: z.array(z.string()).min(2).describe('Array of node IDs to combine (minimum 2)'),
    name: z.string().optional().describe('Name for the resulting boolean operation node'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('boolean-operation', args);
  },
};

// ===== SECTION OPERATIONS =====

export const createSection: FigmaTool = {
  name: 'figma_create_section',
  description: 'Create a section node to organize content on the canvas. Sections are visual containers that group frames and other elements.',
  inputSchema: z.object({
    name: z.string().optional().describe('Section name'),
    x: z.number().optional().describe('X position'),
    y: z.number().optional().describe('Y position'),
    width: z.number().optional().describe('Width in pixels'),
    height: z.number().optional().describe('Height in pixels'),
    fills: z.array(z.any()).optional().describe('Background fills'),
    contentsHidden: z.boolean().optional().describe('Whether section contents are hidden'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-section', args);
  },
};

// ===== VARIABLE OPERATIONS =====

export const createVariableCollection: FigmaTool = {
  name: 'figma_create_variable_collection',
  description: 'Create a new variable collection (design token group). Collections organize variables and support modes (e.g., Light/Dark).',
  inputSchema: z.object({
    name: z.string().describe('Name of the collection'),
    initialModeRename: z.string().optional().describe('Rename the default first mode (e.g., "Light")'),
    modes: z.array(z.object({
      name: z.string().describe('Mode name (e.g., "Dark")'),
    })).optional().describe('Additional modes to add beyond the default'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-variable-collection', args);
  },
};

export const createVariable: FigmaTool = {
  name: 'figma_create_variable',
  description: 'Create a variable (design token) inside a collection. Variables can be of type COLOR, FLOAT, STRING, or BOOLEAN.',
  inputSchema: z.object({
    name: z.string().describe('Variable name (e.g., "primary-color", "spacing-sm")'),
    collectionId: z.string().describe('ID of the variable collection to add this variable to'),
    resolvedType: z.enum(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']).describe('Variable type'),
    values: z.record(z.any()).optional().describe('Values keyed by mode ID. For COLOR use hex strings like "#FF0000". For FLOAT use numbers. For STRING use strings. For BOOLEAN use true/false.'),
    description: z.string().optional().describe('Variable description'),
    scopes: z.array(z.string()).optional().describe('Scopes where this variable appears in the Figma variable picker'),
    hiddenFromPublishing: z.boolean().optional().describe('Hide from library publishing'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-variable', args);
  },
};

export const getLocalVariables: FigmaTool = {
  name: 'figma_get_local_variables',
  description: 'Get all local variables in the document, optionally filtered by type.',
  inputSchema: z.object({
    type: z.enum(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']).optional().describe('Filter by variable type'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-local-variables', args);
  },
};

export const getLocalVariableCollections: FigmaTool = {
  name: 'figma_get_local_variable_collections',
  description: 'Get all local variable collections in the document.',
  inputSchema: z.object({}),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('get-local-variable-collections', args);
  },
};

export const updateVariable: FigmaTool = {
  name: 'figma_update_variable',
  description: 'Update an existing variable (design token). Can change name, description, values (including setting variable aliases for token layering).',
  inputSchema: z.object({
    variableId: z.string().describe('ID of the variable to update (e.g., "VariableID:632:3")'),
    name: z.string().optional().describe('New variable name'),
    description: z.string().optional().describe('New variable description'),
    values: z.record(z.any()).optional().describe('Values keyed by mode ID. For COLOR use hex strings like "#FF0000". For aliases use {type: "VARIABLE_ALIAS", id: "VariableID:xxx:xxx"}'),
    scopes: z.array(z.string()).optional().describe('Scopes where this variable appears'),
    hiddenFromPublishing: z.boolean().optional().describe('Hide from library publishing'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('update-variable', args);
  },
};

export const deleteVariable: FigmaTool = {
  name: 'figma_delete_variable',
  description: 'Delete a variable (design token) from the document.',
  inputSchema: z.object({
    variableId: z.string().describe('ID of the variable to delete (e.g., "VariableID:632:3")'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('delete-variable', args);
  },
};

export const deleteVariableCollection: FigmaTool = {
  name: 'figma_delete_variable_collection',
  description: 'Delete an entire variable collection and all its variables from the document.',
  inputSchema: z.object({
    collectionId: z.string().describe('ID of the collection to delete (e.g., "VariableCollectionId:783:32")'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('delete-variable-collection', args);
  },
};

export const renameVariableCollectionMode: FigmaTool = {
  name: 'figma_rename_variable_collection_mode',
  description: 'Rename a mode in a variable collection (e.g., rename "Mode 1" to "Default").',
  inputSchema: z.object({
    collectionId: z.string().describe('ID of the variable collection'),
    modeId: z.string().describe('ID of the mode to rename'),
    newName: z.string().describe('New name for the mode'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('rename-variable-collection-mode', args);
  },
};

export const addCollectionMode: FigmaTool = {
  name: 'figma_add_collection_mode',
  description: 'Add a new mode to an existing variable collection (e.g., add "Dark" mode to a color collection).',
  inputSchema: z.object({
    collectionId: z.string().describe('ID of the variable collection (e.g., "VariableCollectionId:632:2")'),
    name: z.string().describe('Name for the new mode (e.g., "Dark")'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('add-collection-mode', args);
  },
};

export const bindVariableToNode: FigmaTool = {
  name: 'figma_bind_variable_to_node',
  description: 'Bind a variable to a node property (fill color, stroke color, corner radius, etc.). This creates a live link between the node property and the variable.',
  inputSchema: z.object({
    nodeId: z.string().describe('ID of the node to bind the variable to'),
    variableId: z.string().describe('ID of the variable to bind (e.g., "VariableID:632:3")'),
    field: z.string().describe('Property field to bind: "fills", "strokes" for paint arrays, or scalar fields like "cornerRadius", "opacity", "width", "height", "topLeftRadius", etc.'),
    index: z.number().optional().describe('For paint arrays (fills/strokes), the index of the paint to bind (default 0)'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('bind-variable-to-node', args);
  },
};

export const bindVariableToStyle: FigmaTool = {
  name: 'figma_bind_variable_to_style',
  description: 'Bind a variable to a text style property (fontSize, lineHeight, etc.). This creates a live link so the style responds to mode changes (e.g., Mobile/Tablet/Desktop).',
  inputSchema: z.object({
    styleId: z.string().describe('ID of the text style'),
    variableId: z.string().describe('ID of the variable to bind'),
    field: z.enum(['fontSize', 'lineHeight', 'letterSpacing', 'paragraphSpacing',
                   'paragraphIndent', 'fontFamily', 'fontStyle', 'fontWeight'])
      .describe('Text style property to bind'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('bind-variable-to-style', args);
  },
};

// ===== TEXT PATH OPERATIONS =====

export const createTextPath: FigmaTool = {
  name: 'figma_create_text_path',
  description: 'Create text on a path by converting a vector/shape node into a text path. The original shape node is consumed and replaced by the text path node.',
  inputSchema: z.object({
    nodeId: z.string().describe('ID of the vector or shape node (Rectangle, Ellipse, Polygon, Star, Line) to use as the path'),
    characters: z.string().describe('Text content to place on the path'),
    startSegment: z.number().optional().describe('Index of the segment in the vector network to start text from (default 0)'),
    startPosition: z.number().optional().describe('Position (0-1) along the start segment to begin text (default 0)'),
    fontSize: z.number().optional().describe('Font size'),
    fontName: z.object({
      family: z.string(),
      style: z.string(),
    }).optional().describe('Font family and style'),
    fills: z.array(z.any()).optional().describe('Text fill colors'),
  }),
  execute: async (args, sendToFigma) => {
    return await sendToFigma('create-text-path', args);
  },
};

// Export all tools
export const figmaTools: FigmaTool[] = [
  getDocumentInfo,
  getNode,
  createFrame,
  createRectangle,
  createText,
  createEllipse,
  createComponent,
  modifyNode,
  deleteNode,
  applyAutoLayout,
  // Style tools
  createStyle,
  getStyle,
  listStyles,
  updateStyle,
  deleteStyle,
  applyStyle,
  getNodeStyles,
  detachStyle,
  // Other tools
  getSelection,
  setSelection,
  exportNode,
  createComponentSet,
  addVariant,
  setStrokes,
  setEffects,
  setTextStyle,
  cloneNode,
  groupNodes,
  ungroupNode,
  moveNode,
  createLine,
  createPage,
  createPageDivider,
  createComponentFromNode,
  booleanOperation,
  createSection,
  createVariableCollection,
  createVariable,
  getLocalVariables,
  getLocalVariableCollections,
  updateVariable,
  deleteVariable,
  deleteVariableCollection,
  renameVariableCollectionMode,
  addCollectionMode,
  bindVariableToNode,
  bindVariableToStyle,
  createTextPath,
];
