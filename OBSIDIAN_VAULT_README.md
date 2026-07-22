# Smart Bus AI — Obsidian Vault

This directory is an **Obsidian vault**. Open it in Obsidian to browse the project as interconnected notes.

## Vault Structure

- `_AI_CONTEXT.md` — AI overview of the project
- `_PROJECT_MAP.md` — Folder structure guide
- `AGENTS.md` — AI agent instructions
- `CLAUDE.md` — Claude-specific instructions
- `PRD.md` — Product requirements
- `ARCHITECTURE.md` — System architecture
- `DATA-MODEL.md` — Database schema
- `database/` — SQL migrations and seeds
- `apps/` — Next.js frontend apps
  - `passenger/` — Passenger mobile app
  - `admin/` — Admin dashboard
  - `driver/` — Driver app
- `services/` — Backend services
  - `api/` — NestJS API server
  - `simulator/` — Bus simulation engine
  - `notification/` — Notification service
  - `ai/` — AI prediction service
- `packages/` — Shared packages
  - `shared/` — Shared types and utilities
  - `ui/` — Shared UI components
  - `config/` — Shared configuration

## Getting Started

1. Install [Obsidian](https://obsidian.md)
2. Open this folder as a vault: **Open folder as vault** → select `c:\Users\ranad\Desktop\smart-bus-ai`
3. Install community plugins (see `.obsidian/community-plugins.json`)
4. Browse the documentation

## Key Documents

- Start with `_AI_CONTEXT.md` for project overview
- Read `ARCHITECTURE.md` for system design
- Check `DATA-MODEL.md` for database schema
- See `database/migrations/` for SQL schema

</parameter>
<task_progress>
- [x] Create AI context files
- [x] Fix JwtAuthGuard
- [x] Fix ApiTransportDataProvider field mapping
- [x] Rewrite supabase-realtime.ts for Supabase Realtime
- [x] Activate ApiTransportDataProvider
- [x] Create .env files with real Supabase credentials
- [x] Fix all pre-existing TypeScript errors
- [x] Create vercel.json deployment config
- [x] Vercel AI installed root workspace
- [x] Fix simulator missing axios dep
- [x] Fix notification tsconfig strictPropertyInitialization
- [ ] Full rebuild verify all 9 packages pass
- [x] Enable Obsidian community plugins for AI readability
- [ ] Create Obsidian vault README
- [ ] Launch Obsidian
</parameter>
</write_to_file>