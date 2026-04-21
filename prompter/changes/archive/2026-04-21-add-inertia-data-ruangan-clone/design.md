## Context
The source implementation lives in `Modules/DataRuangan` and is built as a Blade-based nwidart module. It exposes four top-level workflows:
- `ruang-kelas` for class management and a nested class workspace
- `ruang-belajar` for room master data where `m_ruangan.tipe_ruangan = Ruang Kelas`
- `ruang-fasilitas` for facility master data where `m_ruangan.tipe_ruangan = Fasilitas Sekolah`
- `ruang-penggunaan` for facility booking records in `t_penggunaan_ruangan`

The requested target is a separate Laravel + Inertia React application, not a second nwidart module inside this repository. The proposal therefore needs to preserve business behavior while translating the delivery model from Blade partials, jQuery widgets, and module-specific routes into Laravel controllers plus Inertia pages.

Current source dependencies are broader than the four visible menus:
- `Rombongan Belajar` depends on `JenjangKelas`, `Pegawai`, `Murid`, `Indikator`, `KelasHasPegawai`, `KelasHasIndikator`, `Jadwal`, `JadwalDetail`, `KelasHarian`, and `Tugas`.
- Shared AJAX lookups come from `api.ruangan.index`, `pegawai-pengajar.api.list`, and `datapeserta.api.list`.
- The class detail page is effectively a workspace with multiple child flows, not a single CRUD screen.

## Goals / Non-Goals
- Goals:
- Add a `Data Ruangan` feature area to the target Inertia app with the same four user-facing module entries requested by the user.
- Preserve source behavior for room masters, facility masters, class masters, nested class operations, and facility bookings.
- Translate Blade-page workflows into Inertia pages without keeping the old module, view, or jQuery structure.
- Recreate the shared lookup and validation rules the current source relies on.
- Non-Goals:
- Redesign the room-management domain or normalize the existing schema in this change.
- Rebuild unrelated modules outside the dependencies already needed by `Data Ruangan`.
- Introduce a new permission model unless the target app already requires one.

## Decisions
- Decision: Treat the target implementation as an Inertia-native feature area instead of trying to preserve the nwidart module boundary.
- Why: The destination app is a separate Laravel + Inertia React project. Copying the Blade module structure would increase migration work without matching the target architecture.

- Decision: Rename the source `Kelas Belajar` entry to `Rombongan Belajar` in the target UI while keeping the same underlying class-management behavior.
- Why: The user explicitly asked for `Rombongan Belajar`, and the source `ruang-kelas` flow already covers the required class-management functions.

- Decision: Keep the existing table semantics and business rules as the first implementation target.
- Why: The safest clone is behaviorally equivalent. The source logic already assumes shared tables such as `m_ruangan`, `m_kelas`, `m_kelas_has_pegawai`, `m_jadwal_belajar`, `t_rkh`, `t_tugas`, and `t_penggunaan_ruangan`.

- Decision: Replace Blade-era AJAX widget dependencies with target-app lookup endpoints or initial Inertia props.
- Why: The current forms depend on Select2, Flatpickr, and Summernote plus several route-name-specific AJAX calls. The clone needs equivalent data sources, but not the same frontend implementation.

- Decision: Preserve the nested `Rombongan Belajar` workspace as a class-scoped feature area instead of flattening everything into one page.
- Why: The source behavior groups overview, students, teachers, schedules, journals, tasks, indicators, and raport context around a single class. Flattening that structure would change user workflows and make parity harder to verify.

## Risks / Trade-offs
- The class workspace pulls data from several external domains (`Pegawai`, `Murid`, `Indikator`, `Raport`), so the clone may be blocked if the target app lacks compatible sources.
Mitigation: Keep lookup and relation requirements explicit in the specs and validate target availability before implementation starts.

- The source code includes some implementation quirks from the Blade era, such as route coupling and direct table access.
Mitigation: Clone the intended behavior, validation coverage, and data semantics first, but allow the Inertia implementation to use cleaner controllers, requests, and page props.

- Booking conflict logic is easy to regress during the port because it compares overlapping datetime ranges.
Mitigation: Make overlap detection a named requirement and require focused backend tests for it.

## Migration Plan
1. Map the target app's existing auth, menu, and shared layout conventions.
2. Implement shared models, lookups, and validations that match the source data contract.
3. Deliver the two room master flows and facility booking flow.
4. Deliver the `Rombongan Belajar` CRUD and nested workspace flows.
5. Run focused validation for route coverage, lookup behavior, nested class actions, and booking overlap checks.

## Open Questions
- None for proposal scope. If the target app needs a different schema or a reduced raport dependency, that should be captured as a follow-up proposal instead of expanding this clone request implicitly.
