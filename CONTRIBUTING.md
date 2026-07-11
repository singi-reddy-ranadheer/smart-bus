# Contributing to Smart Bus AI

We love contributions! Here's how to get involved.

---

## Code of Conduct

By participating, you agree to maintain a respectful, inclusive environment for everyone.

---

## How to Contribute

### 1. Find an Issue

- Check [GitHub Issues](https://github.com/yourusername/smart-bus-ai/issues) for open tasks
- Look for labels: `good first issue`, `help wanted`, `sprint-ready`
- Comment to claim an issue before starting work

### 2. Set Up Development Environment

```bash
git clone https://github.com/yourusername/smart-bus-ai.git
cd smart-bus-ai
npm install
cp .env.example .env
# Fill in your Supabase credentials
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b feat/your-feature-name
```

Branch naming:
- `feat/` — New feature
- `fix/` — Bug fix
- `docs/` — Documentation
- `refactor/` — Code refactoring
- `test/` — Adding tests
- `chore/` — Maintenance

### 4. Make Changes

- Follow the [Engineering Handbook](ENGINEERING-HANDBOOK.md)
- Write clean, typed TypeScript
- Add tests for new functionality
- Update documentation alongside code

### 5. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add phone number login
fix(api): correct ETA calculation for late trips
docs(readme): update setup instructions
refactor(simulator): extract route follower logic
test(routes): add unit tests for route CRUD
```

### 6. Push and Open a Pull Request

```bash
git push origin feat/your-feature-name
```

Then open a PR on GitHub with:
- Clear description of changes
- Related issue number (e.g., "Closes #12")
- Screenshots for UI changes
- Checklist of testing done

---

## PR Review Process

1. PR is reviewed by maintainers
2. CI checks must pass (lint, type check, tests)
3. Changes may be requested
4. Once approved, PR is squashed and merged

---

## Development Standards

### Code Quality

- **TypeScript strict mode** enabled everywhere
- **ESLint** + **Prettier** — run `npm run lint` before committing
- **No `any` types** — prefer `unknown` if type is uncertain
- **No `console.log`** — use the logging service
- **No TODOs in production code** — create an issue instead

### Testing

- Unit tests for services and utilities
- Test files co-located with source: `file.ts` → `file.test.ts`
- Minimum 80% coverage for new code

### Documentation

- Every public API is documented
- Architecture changes include an ADR in `docs/adr/`
- README is updated when project setup changes
- Screenshots for UI changes in PR description

### Database

- All schema changes via migration files in `database/migrations/`
- Migrations are sequential and never modified after application
- Seed data in `database/seeds/` for development

---

## Getting Help

- Open a GitHub Discussion for questions
- Tag maintainers in issues for urgent matters
- Check existing docs: [ARCHITECTURE.md](ARCHITECTURE.md), [API-CONTRACT.md](API-CONTRACT.md)

---

Thank you for contributing to Smart Bus AI! 🚍