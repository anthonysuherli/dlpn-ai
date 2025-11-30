# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture Overview

This is an Obsidian-style markdown editor built with Next.js 15, React 19, Tiptap, and Zustand.

### State Management (Zustand Stores)

- `stores/editorStore.ts` - Holds the Tiptap editor instance, shared across components
- `stores/toolbarStore.ts` - Persisted toolbar slots configuration (abilities bound to Cmd+1-9)
- `stores/themeStore.ts` - Dark/light theme with `data-theme` attribute on document
- `stores/fontStore.ts` - Editor font selection from preset list
- `stores/workspaceStore.ts` - Vault path configuration

### Ability System

The editor uses an "ability" pattern for toolbar actions (`abilities/`):

- `types/ability.ts` - Ability interface with `id`, `target`, `category`, `execute()`, `isActive()`, `canExecute()`
- `abilities/registry.ts` - Central registry where abilities are registered and queried
- `abilities/formatting.ts` - Text formatting abilities (bold, italic, code, etc.)
- `abilities/structure.ts` - Block-level abilities (headings, lists, quotes, code blocks)

Abilities are bound to toolbar slots and executed via `useKeybindings` hook (Cmd/Ctrl + 1-9).

### Editor Components

- `components/Editor.tsx` - Main Tiptap editor with markdown conversion, handles paste/drop
- `components/editor/nodes/` - Custom Tiptap nodes for media (Image, Video, Audio, PDF, CodeFile, Youtube)
- `components/editor/DropZone.tsx` - Drag-and-drop file handling
- `components/toolbar/AbilityBar.tsx` - Fixed bottom toolbar showing ability slots

### API Routes

- `app/api/files/route.ts` - GET returns file tree from vault directory
- `app/api/files/[...path]/route.ts` - GET/PUT/DELETE for individual markdown files
- `app/api/workspace/route.ts` - GET/PUT vault path configuration
- `app/api/config.ts` - `workspaceConfig` singleton with vault path (defaults to `./vault`)

### File Upload System

- `lib/upload/config.ts` - Upload limits, allowed types, file categorization
- `lib/upload/storage.ts` - Converts files to data URLs for embedding

Files are embedded as base64 data URLs in the document, not stored separately.

### Key Conventions

- Markdown is converted to/from HTML via simple regex transforms in `Editor.tsx`
- Theme CSS variables defined in `app/globals.css` with `[data-theme="dark"]` selectors
- Editor font controlled via `--editor-font` CSS variable
- Vault path defaults to `./vault` directory, configurable via `VAULT_PATH` env var
