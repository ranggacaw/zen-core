# Change: Add Data Peserta clone for a Laravel Inertia app

## Why
The current target application already exposes admin-facing `Students`, `Guardians`, and `PPDB` pages, but those flows do not yet match the requested `Data Peserta` behavior. In particular, student management is still full CRUD instead of list plus readonly detail, and `PPDB` still exposes create, update, and delete actions that fall outside the requested scope. This proposal defines how to align the existing Laravel + Inertia implementation with the requested `Data Peserta` workflow while staying inside the repository's current domain model.

## What Changes
- Add a `Data Peserta` feature area to the target Laravel + Inertia React application with navigation entries for `Peserta Didik`, `Wali Murid`, and `PPDB`.
- Rework the existing `Peserta Didik` flow into a newest-first list plus a read-oriented detail page that shows participant and family context while limiting write access to profile-picture replacement.
- Extend the existing `Wali Murid` flow so guardian listing, create, edit, delete, linked user management, student assignment, address lookups, and role assignment are handled within the current `guardians`, `students`, and `users` domain structure.
- Rework the existing `PPDB` flow into a list plus readonly detail with approve and reject actions only, including class placement and the related student status transitions.
- Preserve current repository semantics first, including `students`, `guardians`, `applicants`, `users`, role assignments, address reference lookups, and class placement relationships unless a later approved change requests a schema remap.
- Keep `PPDB` scoped to requested parity for this change: list, detail, approve, and reject only; new create, inline edit, and delete behaviors are explicitly out of scope.

## Impact
- Affected specs: `data-peserta-inertia-module`, `peserta-didik-management`, `wali-murid-management`, `ppdb-management`
- Related current specs and implementation areas: `prompter/specs/student-lifecycle/spec.md`, `prompter/specs/academic-operations/spec.md`, `platform/routes/web.php`, `platform/app/Http/Controllers/StudentController.php`, `platform/app/Http/Controllers/GuardianController.php`, `platform/app/Http/Controllers/AdmissionsController.php`, `platform/app/Domain/StudentLifecycle/Models/*`, `platform/app/Domain/AcademicOperations/Models/SchoolClass.php`, `platform/resources/js/pages/students/*`, `platform/resources/js/pages/guardians/*`, `platform/resources/js/pages/ppdb/*`, `platform/resources/js/components/app-sidebar.tsx`
- Expected target implementation areas: Laravel routes and controller actions, Inertia React pages and form components, file-upload handling, linked user and role assignment, student lookup endpoints, address reference lookups, class-placement queries, navigation wiring, and focused flow tests for the adjusted `Data Peserta` behavior
