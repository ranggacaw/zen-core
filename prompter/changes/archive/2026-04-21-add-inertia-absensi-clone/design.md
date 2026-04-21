## Context
The source implementation lives in `Modules/Absensi` as a Blade-based nwidart module. The requested clone is for a different Laravel application that uses Inertia React and is not present in this workspace, so the proposal must describe behavior in a way that is grounded in the source code without assuming target-project conventions that cannot be verified yet.

The source module currently delivers two effective student-attendance workflows:
- `Absensi Peserta Didik`: a scan-first page that posts a submitted value, looks up a student via the RFID-backed student identity field, and writes the same-day check-in or check-out to `t_absensi_murid`
- `Absensi Peserta Didik List`: a recent-attendance page that loads attendance records with related student and class data

## Goals / Non-Goals
- Goals:
- Preserve the current student-attendance behavior and data semantics first.
- Translate the Blade module into normal Laravel routes and Inertia React pages.
- Keep the proposal scoped to the two requested student-attendance submodules.
- Non-Goals:
- Recreating unfinished `Absensi Pegawai` flows.
- Designing a brand-new attendance domain model.
- Adding new backend filtering, editing, or deletion behavior that the source module does not effectively provide today.

## Decisions
- Decision: Preserve the current data semantics first.
  - Why: The source controller and ERD already define a simple attendance contract around `murid_id`, `tanggal`, `jam_masuk`, and `jam_keluar`, and the user confirmed the proposal should keep that model unless the target app later requires remapping.
  - Alternatives considered: Immediate target-specific schema redesign. Rejected because the target app is not available here and that would turn a clone request into a migration project.
- Decision: Specify the clone in terms of behavior, not nwidart module structure.
  - Why: The target app uses Laravel + Inertia React, so the proposal should require route, controller, validation, and page behavior rather than prescribing a module package layout that may not exist there.
  - Alternatives considered: Cloning the entire module tree verbatim. Rejected because Blade layouts, SweetAlert helpers, and module namespaces are implementation details that do not directly transfer to an Inertia app.
- Decision: Keep the list page read-oriented in this change.
  - Why: The source list page mainly displays recent attendance and contains placeholder or inconsistent controls for deeper CRUD. Carrying those forward as firm requirements would expand scope without clear user value.
  - Alternatives considered: Adding edit, delete, and date-range filtering to the proposal. Rejected because those behaviors are not completed in the source flow and were not requested explicitly.

## Risks / Trade-offs
- Target app shell differences may require navigation, flash messaging, or authorization integration that cannot be fully specified from this repository alone.
  - Mitigation: Keep the proposal explicit about expected target integration areas and validate them during implementation discovery.
- Student identity lookup may use different field names in the target app even if the attendance semantics stay the same.
  - Mitigation: Specify the behavior as resolving a submitted scan value to a student while preserving the current source semantics first.
- The source list page contains inconsistent labels and actions.
  - Mitigation: Specify only the effective read behavior that is clearly supported by the controller and view data.

## Migration Plan
1. Map the target app's student model, class relation, navigation system, and flash-message pattern to the source attendance behavior.
2. Implement the `Absensi` shell and the scan-first `Absensi Peserta Didik` flow.
3. Implement the `Absensi Peserta Didik List` page with source-aligned recent-attendance data loading.
4. Verify route wiring, repeated scan behavior, and list rendering in the target project before considering any follow-up enhancements.

## Open Questions
- Which concrete target-app menu, permission, and layout primitives should host the new `Absensi` area during implementation?
- Does the target app already expose a student identity field equivalent to the source RFID-backed lookup, or will a thin mapping layer be needed?
