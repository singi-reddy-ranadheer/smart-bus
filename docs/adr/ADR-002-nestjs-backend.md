# ADR-002: NestJS as Primary Backend

## Status

✅ Accepted

## Context

Smart Bus AI needs a backend API server for auth, routes, trips, events, payments, and real-time communication. The requirements are:

- TypeScript for unified type safety with frontend
- Modular architecture for feature separation
- Built-in WebSocket support for live GPS tracking
- Guards/interceptors for auth and cross-cutting concerns
- Validation pipeline for request/response integrity

## Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| **Express** | Lightweight, most popular | No structure enforcement; must manually add everything |
| **Fastify** | Fast, good TypeScript support | Smaller ecosystem than Express/NestJS |
| **Next.js API Routes** | Deployed with frontend, simple | No structured backend patterns; poor for complex backends |

## Decision

Use **NestJS** as the primary backend server.

- Modular architecture with dependency injection
- Built-in WebSocket gateway (`@nestjs/websockets`)
- Guards for role-based auth, interceptors for logging/transformation
- `class-validator` + `class-transformer` for DTO validation
- Swagger/OpenAPI auto-generation
- Supabase integration via custom service module

## Consequences

- More boilerplate than Express, but significantly more maintainable
- NestJS modules mirror feature domains (auth, buses, routes, trips)
- WebSocket gateway handles bidirectional GPS communication
- Database access through a Supabase service client (not Prisma/TypeORM)

## Diagram

```
Client (Next.js/WebSocket) → NestJS Gateway (validation)
  → NestJS Module (business logic)
  → Supabase Service (data access)
  → Supabase Realtime (broadcast)