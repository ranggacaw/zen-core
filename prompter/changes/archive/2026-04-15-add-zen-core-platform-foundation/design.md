## Context
Zen Core is an internal school operations platform for admins, teachers, and other registered users. The approved MVP covers a broad set of school workflows: admissions, workforce access, class operations, attendance, communication, reporting, billing, inventory, facilities, events, and shared platform services.

The system targets fewer than 1,000 active users in its initial rollout, does not require SEO, and will run with Docker in development and production-oriented VPS environments.

## Goals / Non-Goals
- Goals:
  - Establish a modular monolith foundation that can support multiple school domains without service sprawl.
  - Keep Laravel as the application backbone while delivering a responsive React-based internal UI.
  - Standardize shared services for caching, queues, search, uploads, analytics, realtime updates, and payments.
  - Enable phased delivery inside the broad MVP so the platform becomes usable early.
- Non-Goals:
  - Public marketing pages or SEO-oriented rendering strategies.
  - Microservice decomposition for the initial platform.
  - Separate staging environment in the first rollout.

## Decisions
- Decision: Use Laravel 12 as a modular monolith with Inertia.js, React, and Tailwind CSS.
  - Alternatives considered: Laravel + Blade would simplify rendering but gives up the richer internal UI patterns the approved plan expects. A separate JS/TS frontend and backend would add deployment and coordination overhead without a clear MVP benefit.
- Decision: Use PostgreSQL as the primary relational database.
  - Alternatives considered: MySQL would work, but PostgreSQL is the better default for the highly relational model and future reporting flexibility.
- Decision: Use Redis for caching and queues, Meilisearch for full-text search, S3-compatible storage for uploads, Reverb for realtime updates, PostHog for analytics, and Midtrans for payments.
  - Alternatives considered: Deferring these services would reduce setup effort, but the approved plan already depends on them across multiple domains.
- Decision: Standardize local development and VPS deployment with Docker.
  - Alternatives considered: Native host setup would be simpler for one machine, but Docker better supports the multiple required services and reduces environment drift.
- Decision: Start with Admin, Teacher, and Registered User as the initial role model, then refine narrower personas through RBAC policies as self-service surfaces become clearer.
  - Alternatives considered: Defining many school-specific roles up front would slow delivery before the exact workflow boundaries are proven.

## Risks / Trade-offs
- Broad MVP scope can delay first usable delivery -> Phase implementation so student lifecycle, workforce access, academic operations, daily operations, and platform services land first.
- The `Registered User` role is too broad for long-term governance -> Split it into more precise personas once guardian and student self-service workflows are specified.
- Multiple infrastructure services increase local complexity -> Keep all dependencies containerized and document one standard environment layout.

## Migration Plan
This change starts from an effectively empty product codebase.

1. Scaffold the Laravel application and Docker services.
2. Add platform services and authenticated application shell.
3. Deliver domains in phases, starting with school operations workflows.
4. Add integrations, reporting, and broader ERP workflows on top of the shared foundation.

No existing production data or runtime migration is required.

## Open Questions
- How much self-service should the initial `Registered User` experience expose to guardians and students?
- How deep should billing, inventory, and event workflows go in the first implementation pass versus follow-on increments within the MVP?
