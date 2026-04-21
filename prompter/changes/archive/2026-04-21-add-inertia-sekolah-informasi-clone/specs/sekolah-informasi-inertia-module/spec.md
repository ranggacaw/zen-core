## ADDED Requirements
### Requirement: Sekolah Informasi Inertia Navigation
The target Laravel + Inertia React application SHALL expose a `Sekolah` feature area with an `Informasi` entry for the cloned school-information workflow.

#### Scenario: Authorized user opens application navigation
- **WHEN** an authorized user views the target application's navigation
- **THEN** the user can access a `Sekolah` grouping
- **AND** the grouping contains an `Informasi` entry
- **AND** the entry routes to an Inertia-based page in the target application

### Requirement: Sekolah Informasi Source Behavior Parity
The target application SHALL preserve the current source behavior of the `Informasi Sekolah` workflow while adapting delivery to Laravel controllers and Inertia React pages.

#### Scenario: Feature is ported from source module
- **WHEN** the clone is implemented in the target application
- **THEN** the resulting pages preserve the same workflow boundaries, field coverage, validation intent, and approval flow provided by `Modules/Sekolah` for `Informasi`
- **AND** the implementation is not required to preserve nwidart, Blade partial, jQuery, or route-name-specific structures from the source project

### Requirement: Sekolah Informasi Shared Data Dependencies
The target application SHALL provide the data dependencies required by the cloned `Informasi` flow, including active class lookup data and storage-backed file handling for related uploads.

#### Scenario: User opens an Informasi form
- **WHEN** a user opens the create or edit page for `Informasi`
- **THEN** the page can resolve active class options equivalent to the source `Kelas::tahunSekarang()` behavior
- **AND** the backend can receive and persist cover-image or supporting-document uploads without depending on the source project's module-specific helpers
