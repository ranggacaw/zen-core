# Change: Add Data Tutor module clone

## Why
The application already provides `Data Pegawai` with `Pengajar` and `Non-Pengajar` flows, but the requested tutor workflow needs the same capabilities under a separate module, menu, route set, and namespace. Defining this as a separate change keeps the existing `Data Pegawai` entry points stable while clarifying how the clone should be introduced.

## What Changes
- Add a new top-level module labeled `Data Tutor` with slug `data-tutor`.
- Clone the existing `Pengajar` and `Non-Pengajar` management flows into a separate module namespace, route set, and view namespace.
- Add tutor-specific menu entries and route names so the new module can coexist with `Data Pegawai` without collisions.
- Preserve current `Data Pegawai` behavior and leave its menu, routes, and module alias unchanged.

## Impact
- Affected specs: `data-tutor-module`, `data-tutor-pengajar`, `data-tutor-non-pengajar`
- Affected code: `Modules/DataPegawai/**` as source reference, new `Modules/DataTutor/**`, `database/seeders/MenuSeeder.php`, `database/seeders/MenuSeederAll.php`, and any navigation wiring that depends on the new menu aliases or URLs
