## 1. Foundation
- [x] 1.1 Inventory the target app equivalents for auth, authorization, navigation entry points, flash messaging, file uploads, lookup selects, date inputs, and Inertia layout conventions so the cloned `Profile` flow fits the existing shell.
- [x] 1.2 Map the target app data sources needed by `Profile`, including `master_user` or equivalent auth records, optional `Pegawai` profile data, roles, subjects, religion options, address master tables, and profile-photo storage.
- [x] 1.3 Replace the source Blade partials, Bootstrap tab markup, Dropify, Select2, and flatpickr dependencies with Inertia pages, components, and JSON-backed lookups or inputs.

## 2. Profile Module Shell
- [x] 2.1 Add the admin-accessible `Profile` route and target-app navigation wiring so authorized users can open a selected user's profile in the Inertia application.
- [x] 2.2 Add shared profile data loading for the selected user, optional employee-profile relations, role display, and source-aligned success or validation feedback.

## 3. Data Diri
- [x] 3.1 Implement the Inertia `Profile` screen with `Data Diri` and `Ubah Password` sections while keeping the selected user context intact.
- [x] 3.2 Implement the `Data Diri` form with source-aligned personal, general, and address groups, including profile photo, role display, and dependency-aware subject or geography fields when equivalent target data exists.
- [x] 3.3 Preserve a usable fallback when the target project lacks some `Pegawai`, subject, or geography dependencies so the screen still supports the selected user's profile context and password management.

## 4. Password
- [x] 4.1 Implement the `Ubah Password` flow with source-aligned minimum validation, secure password persistence, and same-page feedback without leaving the profile screen.

## 5. Validation
- [ ] 5.1 Add focused backend tests for profile access authorization, dependency-aware data loading, `Data Diri` updates, and password-change validation.
- [ ] 5.2 Add focused frontend or browser-level verification for the Inertia `Profile` page, including `Data Diri` rendering, dependency fallbacks, and same-context password feedback.
- [ ] 5.3 Manually verify the cloned flow works without Blade-era dependencies such as server-rendered partial tabs, Dropify, Select2, or Bootstrap-only tab interactions.

## Post-Implementation
- [ ] Confirm whether the target project needs follow-up updates for menu seeding, route exposure, employee-profile data mapping, subject or geography lookup sources, or file-storage configuration and capture them only if required.