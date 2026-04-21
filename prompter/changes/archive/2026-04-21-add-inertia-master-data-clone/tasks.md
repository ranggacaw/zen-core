## 1. Foundation
- [x] 1.1 Inventory the target app equivalents for auth, sidebar navigation, flash messaging, route helpers, modal or dialog patterns, and permission guards so the cloned `Master Data` pages fit the existing Inertia shell.
- [x] 1.2 Add or map the backend resources required by all `Master Data` flows: `master_user` records, target-project user model bindings, Spatie `roles` and `permissions`, pivot tables, and any equivalent user-type relations needed to render user names or profile context.
- [x] 1.3 Replace the source module's AJAX and Blade modal dependencies with target-app Inertia pages, dialogs, or endpoints for role editing, role-permission assignment, user-permission assignment, and any profile lookups.

## 2. Master Data Module Shell
- [x] 2.1 Add the `Master Data` navigation group and wire `Users`, `User Group`, and `Permission` routes in the target Laravel + Inertia application.
- [x] 2.2 Add a shared Inertia page structure for `Master Data` that matches target-project patterns while preserving the source workflow labels and grouping.

## 3. Users
- [x] 3.1 Implement the `Users` list page with newest-first ordering, user-type and date-range filtering, status badges, related display name resolution, and edit navigation.
- [x] 3.2 Implement create and edit flows so administrators can create users with a unique email and password, update email and status, and optionally replace a user's password.
- [x] 3.3 Implement source-aligned default role assignment for newly created users and preserve success or error feedback in the target app's flash or toast mechanism.
- [x] 3.4 Implement the user profile entry and password-change flow, preserving source-aligned behavior where profile detail depends on available related person data in the target project.

## 4. User Group
- [x] 4.1 Implement the `User Group` page with role summaries, assigned-user counts, and a user listing that exposes each user's current role and direct-permission editing entry point.
- [x] 4.2 Implement role create and update flows using target-app dialogs or pages instead of Blade-only modal partials.
- [x] 4.3 Implement role-permission assignment so administrators can review and sync permissions for a selected role without depending on the source `role_permission_modal` flow.

## 5. Permission
- [x] 5.1 Implement the `Permission` page using real permission data and grouping logic, not the source app's static placeholder rows.
- [x] 5.2 Implement direct user-permission assignment so administrators can review and sync a selected user's explicit permissions separately from inherited role permissions.
- [x] 5.3 Preserve the target app's ability to search or browse available permissions by group so administrators can manage a large permission set without Blade-era accordion dependencies.

## 6. Validation
- [ ] 6.1 Add focused backend tests for user list filters, user create and update rules, default role assignment, role-permission sync, and direct user-permission sync.
- [ ] 6.2 Add focused frontend or browser-level verification for the `Master Data` navigation group plus the `Users`, `User Group`, and `Permission` Inertia pages.
- [ ] 6.3 Manually verify the cloned flows work without Blade-era dependencies such as jQuery DataTables, Select2, AJAX-loaded modal partials, or source-project route names.

## Post-Implementation
- [x] Confirm whether the target project needs follow-up updates for permission seeding, menu seed data, or profile-related lookup sources and capture them only if required.