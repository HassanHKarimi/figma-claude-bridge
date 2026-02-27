# Versioning

This project uses **capability-milestone versioning** (`0.MINOR.PATCH`).

## Scheme

`0.x` signals active internal development — the toolset is evolving and not yet a stable public API.
`1.0.0` will mark the point where the tool API stabilises for broader use.

| Segment | When to increment |
|---------|------------------|
| `MINOR` | New tools added, new capabilities shipped (one PR group = one minor bump) |
| `PATCH` | Bug fixes, documentation, internal refactors with no new tools |
| `MAJOR` | Breaking changes to response shapes, removed tools, or protocol changes |

Both `mcp-server/package.json` and `plugin/package.json` are always kept in sync — they ship as a unit.

## History

| Version | PR | What shipped |
|---------|----|-------------|
| `0.1.0` | — | Initial tool set: create/modify/delete nodes, styles, variables, selection, export |
| `0.2.0` | #2 | Batch tools: `figma_create_variables_batch`, `figma_delete_variables_batch`, `figma_clone_nodes_batch`, `figma_update_nodes_batch`, `figma_get_local_variables` namePrefix filter |
| `0.3.0` | #3 | Placement safety: `currentPage` + position in all responses, `figma_get_page_children`, `figma_get_content_bounds` |
