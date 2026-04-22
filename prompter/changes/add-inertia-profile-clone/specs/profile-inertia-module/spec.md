## ADDED Requirements
### Requirement: Profile Inertia Entry
The target application SHALL provide an Inertia-native `Profile` screen for the cloned workflow so authorized users can manage a selected user's profile without relying on the source Blade delivery model.

#### Scenario: Administrator opens a profile entry
- **WHEN** an authorized user opens the cloned profile route for a selected user
- **THEN** the application renders the profile screen inside the target Inertia layout
- **AND** the screen exposes `Data Diri` and `Ubah Password` sections within the same selected-user context

#### Scenario: Source-era UI dependencies are removed
- **WHEN** the target application delivers the cloned `Profile` workflow
- **THEN** it does not depend on Blade partial injection, Dropify, Select2, flatpickr, or Bootstrap-only tab transport to complete the workflow
