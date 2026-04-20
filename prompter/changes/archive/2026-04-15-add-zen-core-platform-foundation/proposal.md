# Change: Add Zen Core platform foundation

## Why
Zen Core now has an approved project plan, but the repository does not yet define the product capabilities or implementation foundation needed to build it consistently. We need an initial, validated change set that captures the MVP scope, architecture, and rollout path before scaffolding the Laravel application.

## What Changes
- Add initial capability specs for student lifecycle, workforce access, academic operations, daily operations, communication and engagement, business resources, operational reporting, and platform services.
- Define the technical direction for a Laravel 12 modular monolith using Inertia.js with React, PostgreSQL, Redis, Meilisearch, S3-compatible storage, Reverb, PostHog, and Midtrans.
- Plan Docker-based development and VPS deployment for dev and production environments.
- Establish the implementation checklist for scaffolding the application foundation and first wave of school operations workflows.

## Impact
- Affected specs: `student-lifecycle`, `workforce-access`, `academic-operations`, `daily-operations`, `communication-engagement`, `business-resources`, `operational-reporting`, `platform-services`
- Affected code: future Laravel application scaffold, Docker configuration, RBAC/authentication, domain modules, infrastructure integrations, and deployment setup
