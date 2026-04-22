## Context
The source profile module is split across multiple Laravel modules:
- `Modules/MasterData/routes/web.php` exposes `/masterdata/user/{id}/profile` and the password update endpoint.
- `Modules/MasterData/App/Http/Controllers/UserController.php` loads the profile page and handles password changes.
- `Modules/DataPegawai/App/Http/Controllers/DataPegawaiController.php` performs the full `Pegawai/Pengajar` personal data update, including subject sync and photo replacement.
- `Modules/MasterData/resources/views/user/profile.blade.php` and its partials define the current tab behavior and the complete `Data Diri` form.

`clone-output/` currently has only empty `app/`, `resources/js/`, and `routes/` scaffolding, so the clone must define both backend and Inertia frontend structure from scratch.

Implementation note: `clone-output/` was not present in the workspace during execution. The user confirmed `platform/` as the target Laravel + Inertia application, so the clone was applied there while preserving the requested `/masterdata/user/{id}/profile` route contract.

## Platform Mapping
- `App\Models\User` is the target auth record for the referenced profile and password updates.
- `App\Domain\WorkforceAccess\Models\Staff` is the target equivalent for `Pegawai`, with `staff_type = pengajar` used for the `Pegawai/Pengajar` visibility rule.
- `App\Domain\AcademicOperations\Models\AcademicIndicator` is the target source for subject multi-select synchronization.
- `App\Services\AddressReferenceService` plus the authenticated `address-reference` endpoint provide the cascading province, regency, district, and village lookups.
- `zen.upload_disk` storage is the target photo storage mechanism for profile image replacement.

## Goals
- Keep the user-visible behavior of the source profile module.
- Preserve the current route path `/masterdata/user/{id}/profile`.
- Keep `Data Diri` available only for `Pegawai/Pengajar` users.
- Support the full current form scope, not a reduced profile subset.

## Non-Goals
- Redesigning the form UX beyond what is needed for an Inertia/React implementation.
- Expanding password behavior beyond the current source rule set.
- Generalizing the profile editor for user types that are not currently supported by the source module.

## Proposed Structure
1. Add a dedicated profile controller in `clone-output/app/Http/Controllers` responsible for rendering the Inertia page and handling password updates.
2. Add a profile update action that handles `Pegawai/Pengajar` personal data updates in the target project instead of routing that concern through a separate legacy module.
3. Expose lookup endpoints or reusable controller actions for province, regency, district, and village queries so the React page can drive cascading selects without preloading the full location tree.
4. Build one Inertia page at `clone-output/resources/js/Pages/Profile` with tabbed sections for `Data Diri` and `Ubah Password`.

## Key Decisions
### Consolidate target behavior behind the profile module
The source implementation splits page rendering, password changes, and personal data updates across different modules. In the target Inertia project, the clone should present one coherent profile module API so the page has a single ownership point. This keeps the clone easier to reason about and avoids carrying over module boundaries that do not exist in `clone-output/`.

### Keep the source visibility rule exactly
The source page only exposes `Data Diri` when the authenticated user is `Pegawai` and their related employee record is `Pengajar`. The clone should preserve that rule rather than widening profile access during the first migration.

### Replace Blade-specific client dependencies with native Inertia patterns
The source page uses Blade partials, jQuery plugins, and server-rendered option seeding. The clone should keep the same data contract but render it through Inertia props, React form state, multipart submissions, and lightweight async lookups.

## Risks And Mitigations
### Data ownership mismatch
The source module mixes `User` and `Pegawai` updates. The target implementation should document the exact field ownership in controller or service boundaries before coding.

### Incomplete target scaffolding
`clone-output/` does not yet expose shared layout, auth wrappers, or existing Inertia conventions. The implementation tasks should verify these conventions before coding so the new page fits the target project instead of inventing an incompatible structure.

### Upload and address dependencies
Photo storage and geographic lookup data are required for a faithful clone. The implementation should verify storage paths and location table availability early, because these dependencies affect both backend contracts and the React form.
