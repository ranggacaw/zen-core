## 1. Module Skeleton
- [ ] 1.1 Scaffold `Modules/DataTutor` by cloning the `DataPegawai` module manifest, providers, config, routes, controllers, views, and related resources, then rename namespaces and aliases to `DataTutor` and `datatutor`.
- [ ] 1.2 Add `Data Tutor` menu entries with slug `data-tutor` plus child links for `tutor-pengajar` and `tutor-non-pengajar` in both menu seeders without changing existing `Data Pegawai` entries.

## 2. Tutor Pengajar Flow
- [ ] 2.1 Clone the current `pegawai-pengajar` CRUD flow into tutor-specific routes, controller actions, and views.
- [ ] 2.2 Clone the pengajar lookup API endpoint into a tutor-specific route and ensure redirects, view includes, and form actions reference tutor route names only.

## 3. Tutor Non-Pengajar Flow
- [ ] 3.1 Clone the current `pegawai-non-pengajar` CRUD flow into tutor-specific routes, controller actions, and views.
- [ ] 3.2 Ensure non-pengajar redirects, view includes, and form actions reference tutor route names only.

## 4. Validation
- [ ] 4.1 Run framework validation for module discovery and route registration, including a focused check that tutor routes are present and distinct from existing pegawai routes.
- [ ] 4.2 Manually verify the sidebar shows `Data Tutor` with `Pengajar` and `Non-Pengajar`, and that index/create/edit flows open correctly for both tutor submodules.

## Post-Implementation
- [ ] Review whether project instructions or seed data documentation need updates for the new module and update them only if required.
