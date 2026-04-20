<!-- PROMPTER:START -->
# Prompter Instructions

These instructions are for AI assistants working in this project.

Always open `@/prompter/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/prompter/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines
- Show Remaining Tasks

<!-- PROMPTER:END -->

# Project Notes

- Application code lives in `platform/`.
- Root-level `compose.yml` defines the Docker development stack for the Laravel app, queue worker, Reverb, PostgreSQL, Redis, Meilisearch, and MinIO.
- Use `platform/.env.example` for host-based local defaults, `platform/.env.docker.example` for Docker-backed local development, and `platform/.env.production.example` for VPS-oriented production defaults.

# Common Commands

- `php artisan test` run the backend test suite from `platform/`
- `npm run build` build the Inertia/React frontend from `platform/`
- `npm run lint` run frontend lint checks from `platform/`
- `php artisan migrate:fresh --seed --force` reset and seed the application from `platform/`
- `docker compose up --build` start the full local platform stack from the repository root

# Foundation Scope

- Core roles: `admin`, `teacher`, and `registered_user`
- Domain model is organized under `platform/app/Domain/`
- Shared integrations are configured for Redis, Meilisearch, S3-compatible storage, Reverb, PostHog, Midtrans, and Indonesian address reference APIs
