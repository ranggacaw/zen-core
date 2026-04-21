## 1. Scope Definition
- [x] 1.1 Define the ERD-backed Phase 1 clone boundary in `specs/clone-mvp-scope/spec.md`.
- [x] 1.2 Narrow the supporting platform and domain deltas so MVP dependencies are limited to authentication, RBAC, menus, document storage, Indonesian address references, admissions, academics, attendance, announcements, and room usage.
- [x] 1.3 Document the modules and entity groups that are explicitly deferred because the ERD marks them as partial, ambiguous, or unnecessary for the safe clone.
- [x] 1.4 Reconcile the affected Prompter domain specs so Phase 1 requirements no longer imply billing, inventory, broad analytics, or other deferred domains.

## 2. Validation
- [x] 2.1 Capture dependency-ordered MVP delivery sequencing in the clone scope spec.
- [x] 2.2 Ensure the affected deltas cover approvals, enrollments, class assignments, score entry, attendance capture, announcement targeting, document attachments, and room-booking workflows.
- [x] 2.3 Validate the change with `prompter validate add-clone-mvp-scope --strict --no-interactive`.

## 3. Follow-Up
- [x] 3.1 Prepare the narrowed domain-spec deltas for archive after implementation ships.
- [x] 3.2 Confirm root `AGENTS.md` needs no updates because this change does not introduce new clone-first project conventions.
