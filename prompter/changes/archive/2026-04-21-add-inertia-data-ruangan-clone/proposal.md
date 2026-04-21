# Change: Add Data Ruangan clone for a Laravel Inertia app

## Why
`Modules/DataRuangan` in this repository already provides the requested room-management workflows, but it is implemented as a Blade-based nwidart module and depends on several shared modules. The target application uses Laravel with Inertia React, so the clone needs a proposal that preserves current behavior while making the required dependencies and nested class flows explicit before implementation.

## What Changes
- Add a `Data Ruangan` area to the target Laravel + Inertia React application with child entries for `Rombongan Belajar`, `Ruangan Belajar`, `Fasilitas Sekolah`, and `Penggunaan Fasilitas`.
- Clone the current `ruang-kelas` behavior into `Rombongan Belajar`, including its nested overview, murid, guru, jadwal, kelas harian, tugas, indikator, and raport-oriented detail flows.
- Clone the current `ruang-belajar`, `ruang-fasilitas`, and `ruang-penggunaan` CRUD flows into Inertia pages backed by Laravel controllers and routes.
- Recreate the shared lookup and validation behavior the source module relies on, including room-by-type lookups, teacher lookup, student lookup, indicator lookup, and booking conflict detection.
- Preserve the current database semantics first, including the existing room, class, schedule, assignment, and booking tables, unless the target project explicitly requires a separate schema change later.

## Impact
- Affected specs: `data-ruangan-inertia-module`, `rombongan-belajar`, `ruangan-belajar`, `fasilitas-sekolah`, `penggunaan-fasilitas`
- Source references: `Modules/DataRuangan/**`, `Modules/DataPegawai/routes/web.php`, `Modules/DataPeserta/routes/web.php`, `docs/erd-specification.md`
- Expected target implementation areas: Laravel routes/controllers/requests, Inertia React pages and shared form components, lookup endpoints, navigation wiring, and any target-project authorization or menu configuration needed to expose the new module
