# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application using the App Router architecture with Supabase for database functionality. It's based on the official Next.js + Supabase starter template and uses shadcn/ui components with Tailwind CSS for styling. Authentication has been removed - the application is completely open and public.

## Development Commands

```bash
# Start development server (runs on port 3999)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Setup

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable/anon key
- `SUPABASE_SECRET_KEY` - Your Supabase secret key (for server-side operations)

All values are found in your Supabase project's API settings.

## Architecture

### Supabase Client Patterns

This project uses Supabase for database operations only (authentication has been removed):

1. **Server Components** (`lib/supabase/server.ts`): Uses `createServerClient` with Next.js cookies. CRITICAL: Always create a new client within each function - never store in a global variable (important for Fluid compute).

2. **Client Components** (`lib/supabase/client.ts`): Uses `createBrowserClient` for browser-side operations.

### Directory Structure

- `/app` - Next.js App Router pages and layouts
  - `/protected` - Application pages with their own layout
    - `/triage` - Triage dashboard for managing thread actions
  - `layout.tsx` - Root layout with ThemeProvider and Geist font
  - `page.tsx` - Public homepage

- `/components` - React components
  - `/ui` - shadcn/ui components (button, card, input, label, badge, checkbox, dropdown-menu, tabs)
  - `/tutorial` - Tutorial-specific components
  - `/triage` - Triage-related components (action-card, triage-tabs)

- `/lib` - Utility functions and Supabase client configuration
  - `/supabase` - Client creation functions (server, client)
  - `/types` - TypeScript type definitions
  - `utils.ts` - Contains `cn()` helper for Tailwind class merging

### Key Patterns

- **Path Aliases**: Uses `@/*` for imports (maps to project root via `tsconfig.json`)
- **Styling**: Tailwind CSS with CSS variables for theming (see `tailwind.config.ts`). Uses shadcn/ui's "new-york" style variant.
- **Theme**: Dark mode support via `next-themes` with class-based strategy
- **Database**: Uses Supabase for database operations (currently used by the triage feature)

### shadcn/ui

Components use the "new-york" style. Configuration is in `components.json`. To add new shadcn/ui components, use their CLI with the existing configuration. Icon library is Lucide React.
