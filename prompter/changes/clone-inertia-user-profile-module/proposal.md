## Why
The current profile workflow exists only in the Blade-based source module at `/masterdata/user/{id}/profile`, while `clone-output/` is the target Laravel + Inertia scaffold for cloned modules and does not yet provide a profile implementation. The new project needs the same profile capability, including full `Data Diri` handling for `Pegawai/Pengajar` users and `Ubah Password` from the same screen.

## What Changes
- Add an Inertia-based profile page in `clone-output/` for `/masterdata/user/{id}/profile`.
- Preserve the current tab behavior: `Data Diri` is shown only for `Pegawai/Pengajar`, while `Ubah Password` remains available from the profile screen.
- Port the full `Data Diri` workflow, including subject multi-select, photo upload, geographic address cascade, and existing field groupings.
- Add backend update flows for profile data and password changes, including validation, persistence, and user feedback.
- Add the supporting lookup endpoints or equivalent backend data sources needed for province, regency, district, and village selection.

## Impact
- Introduces a new profile module in `clone-output/` across Laravel routes/controllers and Inertia React pages.
- Depends on authenticated user context plus equivalents for Pegawai profile data, subject relations, roles, file uploads, and location master tables in the target project.
- Consolidates behavior that is currently split between `Modules\MasterData\App\Http\Controllers\UserController` and `Modules\DataPegawai\App\Http\Controllers\DataPegawaiController`.

## Assumptions
- `clone-output/` is the intended target project even though it currently contains only empty scaffolding.
- The clone should keep the current source behavior rather than redesign the UX or validation rules.
- The target project may normalize internal endpoint names even if the source module contains route typos such as `chage-password`.
