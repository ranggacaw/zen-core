# Change: Add Profile clone for a Laravel Inertia app

## Why
The existing `Profile` workflow already exists in this repository, but it is delivered through the Blade-based `MasterData` user flow and depends on server-rendered partials plus UI plugins that do not fit a Laravel + Inertia React target application. A focused proposal is needed so the target app can clone the admin-accessible profile route, `Data Diri`, and `Ubah Password` behavior without taking on the rest of the broader `Master Data` area.

## What Changes
- Add a focused `Profile` feature to the target Laravel + Inertia React application for the current admin-style user profile route.
- Clone the `Profile` screen into an Inertia-native page that keeps `Data Diri` and `Ubah Password` in the same user context.
- Preserve the source `Pegawai`-oriented `Data Diri` workflow, including personal, general, address, role-display, subject, religion, geography, and profile-photo behavior where equivalent target-project data exists.
- Preserve the source password-change flow with same-page success and validation feedback.
- Keep this proposal intentionally scoped to `Profile` only; user listing, create or edit, roles, and permissions remain out of scope unless requested separately.

## Impact
- Affected specs: `profile-inertia-module`, `user-profile-management`
- Source references: `Modules/MasterData/routes/web.php`, `Modules/MasterData/App/Http/Controllers/UserController.php`, `Modules/MasterData/resources/views/user/profile.blade.php`, `Modules/MasterData/resources/views/user/profile/profile.blade.php`, `Modules/MasterData/resources/views/user/profile/non-pengajar.blade.php`, `Modules/MasterData/resources/views/user/profile/password.blade.php`, `resources/views/layouts/header_nav.blade.php`
- Expected target implementation areas: Laravel routes/controllers/requests, Inertia React profile page and form components, optional employee-profile data mapping, subject and geography lookups, file-upload handling for profile photos, password update handling, authorization checks, flash or toast feedback, and any target-project navigation wiring needed to expose `Profile`
