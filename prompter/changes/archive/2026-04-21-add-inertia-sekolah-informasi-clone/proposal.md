# Change: Add Sekolah Informasi clone for a Laravel Inertia app

## Why
`Modules/Sekolah` in this repository is mostly a Blade-based nwidart module, but the only source workflow with concrete backend behavior today is `Informasi Sekolah`. The requested target is a separate Laravel + Inertia React application, so the safest proposal is to clone the working `Informasi` flow first while keeping its current data dependencies and approval semantics explicit.

## What Changes
- Add a `Sekolah` area to the target Laravel + Inertia React application with an `Informasi` entry.
- Clone the current `Informasi Sekolah` management flow into Inertia pages backed by Laravel controllers, including list, create, edit, delete, and approval behavior.
- Preserve the source form and data semantics first, including date, information type, title, content, class targeting, cover-image upload, document attachment, and approval status.
- Preserve the existing database relationships around `t_informasi_sekolah`, `t_informasi_has_kelas`, `t_document`, and active `m_kelas` lookups unless the target project later requires a deliberate schema remap.
- Keep this change scoped to the working `Informasi` submodule and exclude the placeholder `Kelas`, `Jadwal`, and `Tugas` pages from the clone.

## Impact
- Affected specs: `sekolah-informasi-inertia-module`, `sekolah-informasi-management`, `sekolah-informasi-approval`
- Source references: `Modules/Sekolah/App/Http/Controllers/InformasiController.php`, `Modules/Sekolah/App/Models/Informasi.php`, `Modules/Sekolah/resources/views/informasi/*`, `Modules/DataRuangan/App/Models/Kelas.php`, `database/seeders/MenuSeeder.php`, `docs/erd-specification.md`, `docs/clone-database-migration-blueprint.md`
- Expected target implementation areas: Laravel routes/controllers/requests, Inertia React pages and form components, upload handling, class lookup sources, navigation wiring, and target-project authorization or menu configuration needed to expose `Sekolah > Informasi`
