# Change: Add Absensi clone for a Laravel Inertia app

## Why
`Modules/Absensi` in this repository already provides the requested student-attendance workflows, but it is implemented as a Blade-based nwidart module and depends on shared student data from `Modules/DataPeserta`. The target application uses Laravel with Inertia React and is not available in this workspace, so the clone needs a source-driven proposal that preserves the current attendance semantics while making target-app integration assumptions explicit.

## What Changes
- Add an `Absensi` area to the target Laravel + Inertia React application with child entries for `Absensi Peserta Didik` and `Absensi Peserta Didik List`.
- Clone the current student attendance scan flow so a submitted scan value resolves a student, creates the same-day check-in when no attendance exists yet, and fills the same-day check-out when an open record already exists.
- Clone the current attendance list flow as an Inertia page that shows recent student attendance entries with student identity, class context, and check-in or check-out times.
- Preserve the current attendance and student data semantics first, including the `t_absensi_murid` shape and the source module's dependency on student and class relationships, unless the target project later requires a deliberate schema remap.
- Keep this change scoped to the two requested student-attendance submodules and exclude unfinished `Absensi Pegawai` CRUD behavior from the clone.

## Impact
- Affected specs: `absensi-inertia-module`, `absensi-peserta-didik`, `absensi-peserta-didik-list`
- Source references: `Modules/Absensi/**`, `Modules/DataPeserta/**`, `database/seeders/MenuSeeder.php`, `database/seeders/MenuSeederAll.php`, `docs/erd-specification.md`
- Expected target implementation areas: Laravel routes/controllers/requests, Inertia React pages and shared form components, attendance or student models equivalent to `AbsensiMurid` and `Murid`, flash-message handling, and any target-project navigation or authorization wiring needed to expose the new module
