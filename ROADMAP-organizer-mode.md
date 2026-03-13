# Organizer Mode — Implementation Roadmap

## Vision

Add an **Organizer Mode** alongside the existing Design Mode in the Figma plugin. Design Mode is about creating and modifying visual elements. Organizer Mode is about auditing, restructuring, and maintaining file hygiene — turning a messy Figma file into a well-organized, component-driven design system.

Future milestone: an **in-plugin chat interface** that lets users talk to Claude directly from the Figma plugin UI (see Phase 5).

---

## Architecture Principles

### Token Efficiency — Plugin-Side Aggregation
The #1 technical constraint: Figma files can have thousands of layers. Claude should never need to see the full tree.

- **Plugin does the scanning.** Counting, fingerprinting, pattern-matching, and spatial math all happen inside the plugin's JS engine with direct Figma API access.
- **Claude receives summaries.** Reports, scorecards, and shortlists — not raw layer dumps.
- **Tiered depth model.** Level 0 (document overview) → Level 1 (page structure) → Level 2 (frame internals) → Level 3 (property details). Tools fetch only the level needed.
- **Scoped by default.** All operations target current selection, current page, or a specific frame — never the entire file unless explicitly requested.

### UI-Driven Mode Switch
A tab/toggle in the plugin UI switches between Design and Organize modes. The mode:
- Changes the plugin UI (organize mode shows action buttons, audit reports, dashboards)
- Passes a `mode` flag through the message protocol so Claude knows the user's intent
- Eventually filters tool visibility so Claude focuses on the right toolset

---

## Phases

### Phase 1 — UI Foundation & Spatial Actions
**Goal:** Establish the mode switch UI and ship the first useful organizer features that don't require Claude.

**Plugin UI changes (`plugin/src/ui.html`):**
- [ ] Add Design / Organize tab bar at top of plugin panel
- [ ] Organize tab shows action button grid instead of current activity log
- [ ] Design tab retains existing UI (connections, activity log, quick actions)
- [ ] Persist selected mode across plugin sessions

**Spatial action buttons (deterministic, no Claude needed):**
- [ ] **Align Frames** — auto-arrange top-level frames on current page with consistent gutters (e.g., 100px horizontal, 200px vertical, grid or row layout)
- [ ] **Sort Pages** — reorder pages alphabetically or by prefix convention
- [ ] **Create Sections** — group selected frames into a named section

**Plugin code (`plugin/src/code.ts`):**
- [ ] `align-frames` handler — reads top-level frame positions/sizes, calculates grid layout, repositions
- [ ] `sort-pages` handler — reorders pages via Figma API
- [ ] `create-section-from-selection` handler — wraps selected nodes in a section

**No MCP tools needed for Phase 1** — these are plugin-internal actions triggered by UI buttons. The UI sends `postMessage` directly to `code.ts`.

---

### Phase 2 — Plugin-Side Auditing & Summary Tools
**Goal:** Build the aggregation layer so Claude (and the UI) can understand a file without reading every layer.

**New plugin handlers (run inside Figma, return summaries):**
- [ ] `get-page-summary` — returns: frame count, section count, auto-named layer count, deepest nesting level, detached instance count, component instance count
- [ ] `get-naming-report` — returns list of auto-generated names ("Frame 47", "Rectangle 12") grouped by parent, with counts
- [ ] `get-style-audit` — returns: hardcoded colors (not bound to variables), hardcoded fonts (not using text styles), with node IDs and values
- [ ] `get-spatial-report` — returns: overlapping frames, frames outside canvas bounds, inconsistent spacing between frames

**New MCP tools (`mcp-server/src/tools/index.ts`):**
- [ ] `figma_get_page_summary` — exposes `get-page-summary` to Claude
- [ ] `figma_get_naming_report` — exposes `get-naming-report` to Claude
- [ ] `figma_get_style_audit` — exposes `get-style-audit` to Claude
- [ ] `figma_get_spatial_report` — exposes `get-spatial-report` to Claude

**Organize UI additions:**
- [ ] **Page Health** button — runs `get-page-summary`, displays scorecard in UI (green/yellow/red indicators)
- [ ] **Naming Issues** button — runs `get-naming-report`, displays list with "Fix All" option

---

### Phase 3 — Cleanup Actions
**Goal:** Let the user (and Claude) fix the issues found by Phase 2 audits.

**New plugin handlers:**
- [ ] `rename-auto-layers` — takes a scope (selection, page, or frame ID), uses heuristics to generate semantic names based on node type, content, position, and parent context (e.g., a text node with "Submit" content inside a frame → "submit-label")
- [ ] `flatten-nesting` — removes unnecessary wrapper groups (single-child groups, groups that just pass through positioning)
- [ ] `find-detached-instances` — returns list of frames that were once component instances but are now detached

**New MCP tools:**
- [ ] `figma_rename_auto_layers` — Claude can invoke rename with scope
- [ ] `figma_flatten_nesting` — Claude can invoke nesting cleanup
- [ ] `figma_find_detached_instances` — Claude can query for detached instances

**Organize UI additions:**
- [ ] **Rename Layers** button — runs on current page/selection, shows preview of renames before applying
- [ ] **Flatten Nesting** button — shows preview of groups to be removed
- [ ] **Detached Instances** button — lists detached instances with "Go to" navigation

---

### Phase 4 — Componentizer
**Goal:** The killer feature — automatically build component variations and detect frames that should be component instances.

#### 4A — Variation Builder
- [ ] `analyze-component-structure` plugin handler — given a frame/component, extracts: layer tree structure, text content, icon/image slots, toggle-like elements, state indicators. Returns a structural summary (not full tree).
- [ ] `suggest-variations` MCP tool — Claude receives the structural summary and proposes a variation matrix (states, sizes, content variations) based on component type and design conventions
- [ ] `build-variations` plugin handler — takes a source component + variation matrix, creates the component set with all specified variants, reusing existing styles/tokens
- [ ] `figma_build_component_variations` MCP tool — end-to-end: analyze → suggest → build (with user confirmation between steps)

**Organize UI:**
- [ ] **Componentize** button — select a frame, click to start the variation builder flow. Shows proposed variations for user approval before building.

#### 4B — Component Detector
- [ ] `fingerprint-components` plugin handler — builds structural fingerprints (layer types, nesting pattern, text content patterns) for all components in the file. Cached per session.
- [ ] `scan-for-unlinked-instances` plugin handler — walks current page, fingerprints each top-level frame, compares against component fingerprints using tree similarity. Returns matches above threshold with similarity score.
- [ ] `figma_scan_unlinked_instances` MCP tool — exposes scan results to Claude
- [ ] `convert-to-instance` plugin handler — replaces a frame with an instance of the matched component, preserving overrides where possible

**Organize UI:**
- [ ] **Find Unlinked** button — scans page, shows list of "frames that look like component X but aren't instances" with confidence %. One-click convert option.

---

### Phase 5 — Compare Screens (Design Mode Addition)
**Goal:** Side-by-side design QA between selected frames.

- [ ] `compare-frames` plugin handler — given 2+ frame IDs, extracts and diffs: fonts used, color values (raw + variable bindings), spacing patterns, component instances used, layer structure
- [ ] `figma_compare_frames` MCP tool — Claude receives the diff and interprets discrepancies
- [ ] Compare button in **Design Mode** UI — select 2+ frames, click compare, see a diff report highlighting inconsistencies

---

### Phase 6 — In-Plugin Chat (Future)
**Goal:** Users can talk to Claude directly in the Figma plugin UI.

**Architecture: MCP server as Claude API proxy (Option A from planning)**

- [ ] Add chat UI to plugin panel — input field + message thread, available in both modes
- [ ] Add `/chat` WebSocket message type in MCP server
- [ ] MCP server calls Claude API with Figma context (current page summary, selection info)
- [ ] Stream responses back to plugin UI via WebSocket
- [ ] Claude API key stored server-side (env var), never exposed to plugin
- [ ] Chat Claude is lightweight — uses summary tools from Phase 2 for context, not full tree reads
- [ ] Separate from Claude Code terminal session — focused on quick Figma-contextual interactions

---

## File Change Map

| Phase | `plugin/src/ui.html` | `plugin/src/code.ts` | `mcp-server/src/tools/index.ts` | `mcp-server/src/index.ts` |
|-------|---------------------|---------------------|--------------------------------|--------------------------|
| 1     | Mode tabs, button grid | 3 new handlers | — | — |
| 2     | Health scorecard, naming list | 4 summary handlers | 4 new tools | — |
| 3     | Rename/flatten/detached UI | 3 action handlers | 3 new tools | — |
| 4     | Componentize + Find Unlinked UI | 4-5 handlers | 3-4 new tools | — |
| 5     | Compare UI (design tab) | 1 handler | 1 new tool | — |
| 6     | Chat UI | — | — | Chat proxy endpoint |

---

## Open Questions

- **Align Frames layout algorithm:** Grid (auto-columns based on count) vs. rows vs. user-configurable? Start with grid, let user override via chat later.
- **Component fingerprinting similarity threshold:** What % match counts as "should be an instance"? Start at 80%, tune based on real usage.
- **Rename heuristics:** How smart should auto-rename be without Claude? Start with type+content ("text-submit", "icon-arrow-right", "frame-header"), escalate ambiguous cases to Claude.
- **Chat model:** Use same Opus model as Claude Code, or a lighter model (Haiku) for faster/cheaper in-plugin responses? Probably Haiku for quick actions, Opus for complex analysis.
- **Plugin panel size:** Current 300x460 may be tight for organize mode UI. May need to increase or make resizable.

---

## Versioning

Following the project's capability-milestone versioning:
- Phase 1-2 → **0.4.0** (Organizer Mode foundation)
- Phase 3-4 → **0.5.0** (Componentizer)
- Phase 5 → **0.5.x** (Compare, minor addition)
- Phase 6 → **0.6.0** (In-plugin Chat)
