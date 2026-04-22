## Context
The source implementation is concentrated in the `MasterData` user flow:
- `Modules/MasterData/routes/web.php` exposes `user/{id}/profile` and `user/{id}/chage-password` inside the authenticated `masterdata` area.
- `Modules/MasterData/App/Http/Controllers/UserController.php` provides the working profile view and password update action.
- `Modules/MasterData/resources/views/user/profile.blade.php` renders the tab shell, while `profile/profile.blade.php`, `profile/non-pengajar.blade.php`, and `profile/password.blade.php` define the `Data Diri` and `Ubah Password` forms.
- `resources/views/layouts/header_nav.blade.php` links the current UI entry point to the profile screen.

The requested target is a separate Laravel + Inertia React application. The clone therefore needs to preserve business behavior while replacing Blade partial composition and plugin-heavy inputs with an Inertia-native profile experience. There is also an active broader proposal, `add-inertia-master-data-clone`, that includes higher-level user profile access; this change intentionally narrows the scope to the standalone `Profile` flow so it can be planned independently or merged into the broader work later.

## Goals / Non-Goals
- Goals:
- Add a standalone `Profile` clone for the target Inertia app that matches the current admin-style user profile route.
- Preserve `Data Diri` and `Ubah Password` within the same selected-user context.
- Keep the `Data Diri` clone aligned to the source `Pegawai` profile flow where equivalent target data and lookups exist.
- Make dependency boundaries explicit so the target app can still deliver password management even when some profile relations are unavailable.
- Non-Goals:
- Clone the full `Users`, `Role`, or `Permission` feature areas in this change.
- Redesign the target application's authentication model or authorization package.
- Require the target app to invent missing `Pegawai`, subject, or geography data sources purely to satisfy the first profile clone.

## Decisions
- Decision: Treat `Profile` as an Inertia-native screen instead of copying the Blade tab, partial, and plugin structure.
- Why: The target application uses Laravel + Inertia React. Recreating Blade delivery mechanics would preserve transport details rather than the underlying workflow.

- Decision: Preserve the current admin-style route model where an authorized user opens a selected user's profile context.
- Why: The source route and user-menu entry point both resolve to a dedicated user profile page keyed by user ID. This is the clearest behavioral contract to clone first.

- Decision: Keep `Data Diri` dependency-aware rather than universally required.
- Why: The source form depends on optional `Pegawai` data plus subject, religion, and geography lookups that may not exist in every target project. Password change is core to the module; rich identity editing depends on compatible data sources.

- Decision: Keep `Data Diri` and `Ubah Password` in one screen.
- Why: The source workflow uses a shared page context for both tabs, and same-context feedback reduces navigation churn for administrators managing a selected user.

## Risks / Trade-offs
- The source `Data Diri` flow spans optional relations, lookup tables, and profile-photo storage that may differ in the target app.
Mitigation: Define the profile requirements so unsupported fields can be omitted or disabled without blocking password management.

- This proposal overlaps conceptually with the active `add-inertia-master-data-clone` change.
Mitigation: Keep this change tightly scoped to `Profile` only and maintain the same route and behavior assumptions so it can either stand alone or be merged into the broader user-management implementation.

- The source UI uses plugin-driven controls for uploads, selects, and date inputs.
Mitigation: Specify behavior, validation, and data requirements rather than plugin parity so the target app can use native or existing Inertia-friendly components.

## Migration Plan
1. Map the target app's auth, authorization, and navigation conventions for opening a selected user's profile.
2. Map the profile data dependencies required for `Data Diri`, including optional employee, subject, religion, address, and file-storage sources.
3. Deliver the Inertia `Profile` page shell with selected-user loading and same-page feedback.
4. Deliver the dependency-aware `Data Diri` form.
5. Deliver the `Ubah Password` flow with focused validation and secure persistence.
6. Run focused verification for authorization, profile rendering, dependency fallbacks, and password updates.

## Open Questions
- None for proposal scope. If the target project uses a different auth table, lacks a `Pegawai` equivalent, or needs self-service instead of admin-accessible routing, that should be captured as an implementation constraint or follow-up proposal rather than assumed here.
