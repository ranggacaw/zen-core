## Context
The source implementation lives in `Modules/Sekolah` and is built as a Blade-based nwidart module. Within that module, the only workflow with substantive backend behavior is `Informasi Sekolah`:
- `InformasiController` provides list, create, edit, update, delete, and approve actions.
- `Informasi` records live in `t_informasi_sekolah` and relate to classes through `t_informasi_has_kelas`.
- Optional files are stored through the shared document upload service and linked through `t_document`.

The requested target is a separate Laravel + Inertia React application, not another nwidart module inside this repository. The proposal therefore needs to preserve business behavior while translating Blade views, jQuery widgets, and module route conventions into Laravel controllers plus Inertia pages.

The surrounding `Sekolah` menu in this repo also contains `Kelas`, `Jadwal`, and `Tugas`, but those controllers are currently placeholders that only return static Blade views. Based on the clarified scope, this change intentionally clones only the working `Informasi` submodule.

## Goals / Non-Goals
- Goals:
- Add a `Sekolah` feature area to the target Inertia app with an `Informasi` entry.
- Preserve source behavior for school-information management, including list, create, edit, delete, class targeting, document or cover handling, and approval.
- Translate the workflow into Inertia-native pages without carrying over Blade partials or jQuery dependencies.
- Keep the target implementation aligned with the existing table semantics unless a later proposal explicitly changes the schema.
- Non-Goals:
- Clone the placeholder `Kelas`, `Jadwal`, or `Tugas` screens in this change.
- Redesign the school-information domain or introduce a new approval model.
- Require the target app to keep the nwidart module structure from the source project.

## Decisions
- Decision: Scope the clone to `Informasi` only.
- Why: The user confirmed `Informasi` is the intended scope, and it is the only `Sekolah` submodule here with real backend behavior worth porting.

- Decision: Treat the target implementation as an Inertia-native feature area instead of preserving the Blade module boundary.
- Why: The destination is a separate Laravel + Inertia React app, so copying Blade views and nwidart conventions would add migration overhead without matching the target architecture.

- Decision: Preserve the existing data relationships and approval flag semantics first.
- Why: The source workflow already assumes `t_informasi_sekolah`, `t_informasi_has_kelas`, `t_document`, and active current-year class data. A parity-first clone is lower risk than mixing migration and behavior changes.

- Decision: Replace Blade-era widgets and dialogs with target-project-native Inertia form controls and feedback mechanisms.
- Why: The current UI depends on Select2, Summernote, DataTables, SweetAlert, and jQuery confirm dialogs. The clone needs equivalent user outcomes, not the same frontend stack.

- Decision: Map approval access to target-project roles equivalent to `Kepala Sekolah` or `superadmin`.
- Why: The source list page exposes approval only to those privileged roles, so the proposal should preserve the same authorization intent while allowing implementation details to follow the target app's permission system.

## Risks / Trade-offs
- The target app may not yet expose an active-class source equivalent to `Kelas::tahunSekarang()`.
Mitigation: Make current-year class lookup an explicit requirement and validate the dependency before implementation starts.

- The source flow mixes intended behavior with Blade-era quirks, including client-side widgets and direct route coupling.
Mitigation: Specify behavior parity at the workflow level and allow the Inertia implementation to use cleaner requests, controllers, and page props.

- Upload behavior can regress during the port because cover images, supporting documents, and relation cleanup are handled across multiple tables and storage paths.
Mitigation: Make file handling and delete cleanup explicit in the specs and require focused backend tests around record updates and removal.

## Migration Plan
1. Map the target app's existing auth, menu, upload, and shared page conventions.
2. Implement or map the backend models, relations, and validation needed for school information records and active class targets.
3. Deliver the `Sekolah > Informasi` list and create or edit flows.
4. Deliver delete and approval actions with target-native feedback.
5. Run focused validation for list ordering, class-target sync, upload handling, and approval behavior.

## Open Questions
- None for proposal scope. If the target app needs a different class source, storage layout, or broader `Sekolah` expansion later, that should be captured as a follow-up proposal.
