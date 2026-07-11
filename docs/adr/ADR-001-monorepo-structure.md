# ADR-001: Monorepo Structure with Turborepo

## Status

✅ Accepted

## Context

Smart Bus AI consists of multiple applications (Passenger, Driver, Admin), services (API, AI, Simulator, Notification), and shared packages. We need a development environment that:

- Allows code sharing between apps and services
- Provides consistent tooling (TypeScript, ESLint, Prettier)
- Enables parallel development and builds
- Scales as the project grows

## Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| **Multi-repo** | Independent deployments | Code duplication, inconsistent tooling |
| **Single Next.js app** | Simple setup | Monolithic, poor scalability |
| **Nx** | Powerful build system | Heavier learning curve |

## Decision

Use **Turborepo** with npm workspaces.

- Parallel build caching across all packages
- Shared packages (`ui`, `shared`, `config`) consumed by all apps
- Minimal configuration, works out of the box with npm workspaces
- Industry standard for Next.js monorepos

## Consequences

- All packages use a shared TypeScript config (`tsconfig.base.json`)
- Build output is cached in `.turbo/` for faster rebuilds
- New packages must be registered in root `package.json` workspaces
- Requires consistent script naming across packages (`dev`, `build`, `lint`)

## Structure

```
smart-bus-ai/
├── apps/           # Next.js applications
├── services/       # Backend services
├── packages/       # Shared packages
├── database/       # SQL migrations
├── iot/            # ESP32 firmware
├── docs/           # Documentation
└── .github/        # CI/CD