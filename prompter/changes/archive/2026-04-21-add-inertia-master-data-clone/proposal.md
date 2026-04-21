# Change: Add Master Data clone for a Laravel Inertia app

## Why
`Modules/MasterData` in this repository already contains the requested `Master Data` workflows, but they are delivered through a Blade-based nwidart module with jQuery-driven modals and a mixed set of real and placeholder permission screens. The target application uses Laravel with Inertia React, so the clone needs a proposal that preserves the working user, role, and permission behavior while making the migration boundaries explicit before implementation.

## What Changes
- Add a `Master Data` feature area to the target Laravel + Inertia React application with navigation entries for `Users`, `User Group`, and `Permission`.
- Clone the working `Users` flow into Inertia pages backed by Laravel controllers, including list filters, create, edit, status updates, profile access, and password change behavior.
- Clone the working role-management flow into Inertia pages, including role listing, role creation and update, role-to-permission assignment, and the user-to-direct-permission assignment currently launched from the role page.
- Replace the source app's placeholder `Permission` Blade pages with an Inertia permission-management view backed by real permission data so the target app exposes a usable permission catalog instead of static mock records.
- Preserve current database semantics first, including `master_user`, Spatie `roles` and `permissions`, pivot tables, and source-aligned user-type relationships unless the target project explicitly requires a separate auth or schema remap later.

## Impact
- Affected specs: `master-data-inertia-module`, `master-data-user-management`, `master-data-role-management`, `master-data-permission-management`
- Source references: `Modules/MasterData/App/Http/Controllers/UserController.php`, `Modules/MasterData/App/Http/Controllers/RoleController/RoleController.php`, `Modules/MasterData/App/Http/Controllers/PermissionController.php`, `Modules/MasterData/routes/web.php`, `Modules/MasterData/resources/views/user/*`, `Modules/MasterData/resources/views/role/*`, `resources/views/masterdata/permission/*`, `app/Models/User.php`, `database/migrations/2024_03_10_091647_master_user.php`, `database/seeders/MenuSeeder.php`, `database/seeders/RolePermissionSeeder.php`
- Expected target implementation areas: Laravel routes/controllers/requests, Inertia React pages and shared form components, role and permission queries, auth and authorization mapping, navigation wiring, and any target-project menu or permission seeding needed to expose `Master Data`
