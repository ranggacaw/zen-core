## Context
The source implementation is split across several places:
- `Modules/MasterData/App/Http/Controllers/UserController.php` provides the working `Users` CRUD, default `superadmin` assignment on create, a profile entry point, and password change handling.
- `Modules/MasterData/App/Http/Controllers/RoleController/RoleController.php` provides the working role list, role create and update flows, role-permission sync, and direct user-permission sync.
- `resources/views/masterdata/permission/*` exposes standalone `Permission` pages, but they are mostly static placeholder Blade screens and are not the real source of permission state.
- `app/Models/User.php` and the auth schema use `master_user` plus Spatie roles and permissions, with optional `Pegawai`, `Murid`, and `Wali` relations used for labels and profile context.

The requested target is a separate Laravel + Inertia React application, not another nwidart Blade module. The proposal therefore needs to preserve business behavior while translating modal-heavy Blade workflows into Laravel controllers and Inertia pages.

## Goals / Non-Goals
- Goals:
- Add a `Master Data` area to the target Inertia app with `Users`, `User Group`, and `Permission` entries.
- Preserve the working source behavior for user management, role management, role-permission assignment, and direct user-permission assignment.
- Replace static or placeholder permission pages with an Inertia-native permission catalog backed by real permission data.
- Keep the first implementation aligned with the current `master_user` plus Spatie authorization model unless the target project explicitly requests a schema remap.
- Non-Goals:
- Redesign the target app's authentication architecture in this change.
- Rebuild unrelated profile-editing features whose source controller actions are not implemented today.
- Preserve Blade partials, jQuery modal loading, DataTables, or Select2-specific frontend structures.

## Decisions
- Decision: Treat the target implementation as an Inertia-native feature area instead of trying to preserve the nwidart module boundary.
- Why: The destination app is a separate Laravel + Inertia React project. Copying the source module structure would preserve delivery mechanics that the target app does not use.

- Decision: Treat `Users` and `User Group` controller behavior as the source of truth, but treat the standalone `Permission` views as placeholders that should be replaced with a real permission-management page.
- Why: The source permission pages render hard-coded sample rows, while actual permission state and syncing already live in Spatie tables and the role controller flows. Cloning the placeholders would reproduce a mock UI instead of useful behavior.

- Decision: Keep source-aligned authorization semantics first, including `master_user`, role membership, direct permissions, and the default `superadmin` assignment on user creation.
- Why: This is the safest behavioral clone and minimizes hidden differences between the source and target projects during the first port.

- Decision: Preserve user profile access and password-change behavior, but only require related profile detail where the target app has equivalent person data sources.
- Why: The profile view depends on optional `Pegawai`, `Murid`, `Wali`, subject, and geography lookups that may not exist in the target app. Password management is core to the module; extended profile data is a dependency-sensitive enhancement.

- Decision: Replace Blade-loaded permission modals with target-app pages or dialogs that use Inertia-friendly data loading.
- Why: The current role and permission flows depend on AJAX endpoints that return HTML partials. The clone needs the same outcomes, not the same transport mechanism.

## Risks / Trade-offs
- The source profile screen depends on modules outside `MasterData`, including person records and lookup endpoints for geography and subject data.
Mitigation: Keep profile requirements explicit but dependency-aware, and avoid expanding this change into a broader profile-data migration unless the target app already has compatible sources.

- The current source behavior mixes real authorization logic with placeholder permission UI.
Mitigation: Define permission-management requirements around real `permissions`, `role_has_permissions`, and direct user permissions so the target build is useful on day one.

- A target app with a different auth table or without Spatie permissions will require extra mapping work.
Mitigation: Keep the proposal aligned to the source contract first and treat auth remapping as a deliberate follow-up if needed.

## Migration Plan
1. Map the target app's auth, navigation, and Inertia layout conventions.
2. Implement shared role, permission, and user data access that matches the source contract.
3. Deliver the `Users` list, create, edit, profile, and password-change flows.
4. Deliver the `User Group` role list, create or update flow, and role-permission assignment.
5. Deliver the `Permission` catalog and direct user-permission assignment flow.
6. Run focused validation for filters, assignments, sync behavior, and navigation coverage.

## Open Questions
- None for proposal scope. If the target project uses a non-Spatie authorization model or lacks equivalent person-profile relations, that should be captured as an implementation constraint or a follow-up proposal rather than assumed here.
