## 1. Foundation
- [x] 1.1 Inventory the target app equivalents for auth, sidebar navigation, flash messaging, and route helpers so the cloned `Data Ruangan` pages fit the existing Inertia shell.
- [x] 1.2 Implement the shared backend resources needed by all submodules: models or repositories for `Ruangan`, `Kelas`, `JenjangKelas`, `KelasHasPegawai`, `KelasHasIndikator`, `Jadwal`, `JadwalDetail`, `KelasHarian`, `Tugas`, and `PenggunaanRuangan`, plus any request validation classes the target app uses.
- [x] 1.3 Add shared lookup endpoints or page props for room type filtering, teacher lookup, student lookup, class levels, and indikator data so the cloned forms can populate selects without Blade-era AJAX dependencies.

## 2. Data Ruangan Module Shell
- [x] 2.1 Add the `Data Ruangan` navigation group and wire child routes for `Rombongan Belajar`, `Ruangan Belajar`, `Fasilitas Sekolah`, and `Penggunaan Fasilitas` in the target app.
- [x] 2.2 Add a common Inertia layout or page structure for the module that matches target-project patterns while preserving the source module labels and workflow grouping.

## 3. Ruangan Master Data
- [x] 3.1 Implement `Ruangan Belajar` CRUD using `m_ruangan` records filtered to `Ruang Kelas`.
- [x] 3.2 Implement `Fasilitas Sekolah` CRUD using the same room source filtered to `Fasilitas Sekolah`.
- [x] 3.3 Verify create, edit, delete, and list pages preserve the current uniqueness and success or error handling behavior.

## 4. Rombongan Belajar
- [x] 4.1 Implement the `Rombongan Belajar` index, create, edit, delete, and detail pages with fields for class name, class level, homeroom teacher, assigned room, and school year.
- [x] 4.2 Port the detail workspace tabs for overview, murid, guru assignments, jadwal, kelas harian, tugas, indikator, and raport-related summary data.
- [x] 4.3 Port nested actions for teacher-subject assignment, semester schedule headers, schedule slots, daily journals, tasks, and indikator activation so they stay scoped to the selected class.
- [x] 4.4 Verify redirects and data loading remain inside the `Rombongan Belajar` route namespace and no Blade-only conventions remain.

## 5. Penggunaan Fasilitas
- [x] 5.1 Implement `Penggunaan Fasilitas` list, create, edit, and delete flows using facility-only room lookup plus requester selection for murid or guru.
- [x] 5.2 Preserve the current overlap detection rule so a facility cannot be booked for conflicting time ranges.
- [x] 5.3 Preserve usage status presentation based on whether the booking end time has passed.

## 6. Validation
- [x] 6.1 Add focused backend tests for room filtering, class CRUD, nested class actions, and facility booking conflict checks.
- [x] 6.2 Add focused frontend or browser-level verification for the four navigation entries and the major Inertia pages, especially the nested `Rombongan Belajar` workspace.
- [x] 6.3 Manually verify lookups for teacher, student, room, and indikator data resolve in the target project without depending on source-project route names.

## Post-Implementation
- [x] Confirm whether target-project documentation, menu seed data, or permission mapping needs follow-up updates and capture them only if required.
