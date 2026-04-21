## ADDED Requirements
### Requirement: Data Ruangan Inertia Navigation
The target Laravel + Inertia React application SHALL expose a `Data Ruangan` feature area with navigation entries for `Rombongan Belajar`, `Ruangan Belajar`, `Fasilitas Sekolah`, and `Penggunaan Fasilitas`.

#### Scenario: User opens Data Ruangan navigation
- **WHEN** an authorized user opens the target application's navigation
- **THEN** the user can access a `Data Ruangan` grouping
- **AND** the grouping contains `Rombongan Belajar`, `Ruangan Belajar`, `Fasilitas Sekolah`, and `Penggunaan Fasilitas`
- **AND** each entry routes to an Inertia-based page in the target application

### Requirement: Data Ruangan Shared Lookup Services
The target application SHALL provide the lookup data required by the cloned `Data Ruangan` flows, including room lookup by type, teacher lookup, student lookup, class level lookup, and indikator lookup where the source workflows depend on them.

#### Scenario: Inertia form loads lookup data
- **WHEN** a user opens a create or edit flow inside `Data Ruangan`
- **THEN** the page can resolve the lookup data needed for its selects and relational inputs
- **AND** the lookup contract is available without depending on the source project's Blade route names such as `api.ruangan.index`, `pegawai-pengajar.api.list`, or `datapeserta.api.list`

### Requirement: Data Ruangan Source Behavior Parity
The target application SHALL preserve the current source behavior of `Modules/DataRuangan` while adapting delivery to Laravel controllers and Inertia React pages.

#### Scenario: Feature is ported from source module
- **WHEN** the clone is implemented in the target application
- **THEN** the resulting pages preserve the same module boundaries, field coverage, validation intent, and nested workflow relationships described by the source `Data Ruangan` module
- **AND** the implementation is not required to preserve nwidart, Blade partial, or jQuery-specific structures
