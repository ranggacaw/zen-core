## Context
The current repository already contains Laravel + Inertia flows for `peserta-murid`, `peserta-wali`, and `peserta-ppdb`, backed by `platform/app/Domain/StudentLifecycle`. Those flows expose the right broad domain areas, but they do not yet match the requested `Data Peserta` behavior.

The biggest gaps in the current implementation are:
- `StudentController` and the `students/*` pages still implement create, edit, and delete workflows instead of a list plus readonly detail with photo replacement only.
- `AdmissionsController` and `ppdb/index.tsx` still expose create, update, and delete interactions inline instead of a list plus readonly detail with approve and reject actions only.
- `GuardianController` already supports guardian CRUD and address data, but linked user creation, guardian role assignment, richer list summaries, and explicit student lookup behavior are not implemented yet.
- The repository uses `students`, `guardians`, `applicants`, `users`, custom role tables, and `school_classes` rather than the legacy table names referenced in the initial draft.

The requested target is therefore not a module port in the filesystem sense. It is a behavior-alignment change inside the existing Laravel + Inertia application.

## Goals / Non-Goals
- Goals:
- Add a `Data Peserta` area to the target Inertia app with `Peserta Didik`, `Wali Murid`, and `PPDB` entries.
- Align the current participant review, guardian management, guardian-linked accounts, student assignment, and admissions approve or reject workflows to the requested `Data Peserta` behavior.
- Keep the first implementation aligned with the current repository schema and auth semantics unless a later approved change requests a remap.
- Make the `PPDB` scope explicit so implementation keeps list, detail, approve, and reject flows only and removes unsupported CRUD behavior from the admin path.
- Non-Goals:
- Rebuild the source module as another nwidart package.
- Invent new `PPDB` create or edit workflows in this change.
- Redesign unrelated admissions intake, student onboarding, or broader profile-editing experiences outside the current source behavior.
- Preserve DataTables, Select2, Bootstrap modal markup, or jQuery AJAX transport details.

## Decisions
- Decision: Treat the target implementation as an Inertia-native feature area instead of trying to preserve the nwidart module boundary.
- Why: The destination app is a separate Laravel + Inertia React project. Copying the source delivery structure would preserve mechanics the target app does not use.

- Decision: Preserve source schema and auth semantics first, including `master_user`, Spatie roles, guardian-linked accounts, admissions records, address lookups, and class placement relationships.
- Decision: Preserve the current repository schema and auth semantics first, including `users`, role assignments, guardian-linked accounts, admissions records, address lookups, and class placement relationships.
- Why: This is the safest way to deliver the requested behavior without introducing a parallel legacy data model into a repository that already has working student-lifecycle tables and controllers.

- Decision: Keep `Peserta Didik` intentionally read-oriented for this change, with profile-picture update as the only cloned write action.
- Why: The requested target behavior is list, inspect, and replace the participant photo, and that is smaller and safer than keeping the current full student CRUD surface.

- Decision: Keep `PPDB` scoped to list, detail, approve, and reject only.
- Why: The requested admin behavior is review and decision-making, not applicant CRUD. Keeping create, inline edit, and delete actions would conflict with the requested scope.

- Decision: Replace source lookup widgets and modal actions with Inertia-friendly pages, dialogs, or endpoints while preserving outcomes.
- Why: Guardian forms depend on student and address search lookups, and `PPDB` depends on approve or reject interactions. The implementation needs the same workflow results, not the missing source module's delivery mechanics.

## Risks / Trade-offs
- The requested `Wali Murid` flow depends on multiple shared resources, including address lookups, role assignment, linked user creation, and the current guardian-student relationship model.
Mitigation: Make those shared dependencies explicit in the module-shell spec and early implementation tasks before page work begins.

- The current repository stores guardian linkage directly on `students.guardian_id`, while the original draft assumed a separate guardian-student pivot.
Mitigation: Preserve user-visible assignment behavior while implementing it through the repository's existing one-to-many relationship model.

- The `PPDB` approve flow depends on class placement data from outside `DataPeserta`.
Mitigation: Keep class lookup and student-to-class attachment as a named dependency in the shared resources and tasks so the admissions workflow is not treated as self-contained.

## Migration Plan
1. Map the target app's auth, navigation, Inertia layout, lookup patterns, and file-upload conventions.
2. Implement the shared participant, guardian, admissions, address, and class-placement data access needed by all three submodules.
3. Deliver the `Peserta Didik` list and readonly detail plus profile-picture update flow.
4. Deliver the `Wali Murid` list, create, edit, linked-account, assignment, and delete flows.
5. Deliver the `PPDB` list, readonly detail, approve, and reject flows.
6. Run focused validation for lookups, assignments, file uploads, admissions transitions, and navigation coverage.

## Open Questions
- None for proposal scope. If the target app lacks the current participant schema, address lookup data, Spatie roles, or class-placement structures, that should be captured as an implementation constraint or a follow-up proposal rather than assumed here.
