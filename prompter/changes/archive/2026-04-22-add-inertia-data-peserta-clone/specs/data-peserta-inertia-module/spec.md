## ADDED Requirements
### Requirement: Data Peserta Inertia Navigation
The target Laravel + Inertia React application SHALL expose a `Data Peserta` feature area with navigation entries for `Peserta Didik`, `Wali Murid`, and `PPDB`.

#### Scenario: Authorized user opens Data Peserta navigation
- **WHEN** an authorized user opens the target application's navigation
- **THEN** the user can access a `Data Peserta` grouping
- **AND** the grouping contains `Peserta Didik`, `Wali Murid`, and `PPDB`
- **AND** each entry routes to an Inertia-based page in the target application

### Requirement: Data Peserta Shared Participant Resources
The target application SHALL provide the shared data resources required by the cloned `Data Peserta` flows, including student records, guardian records, admissions records, guardian-student relationships, linked user accounts, address reference lookups, class placement options, and student lookup by name or student number.

#### Scenario: Wali Murid form loads clone dependencies
- **WHEN** an administrator opens a cloned `Wali Murid` create or edit flow
- **THEN** the page can search eligible student records by participant name or student number
- **AND** the page can resolve province, regency, district, and village lookup data
- **AND** the workflow does not depend on source-project Select2 or jQuery AJAX callbacks

#### Scenario: PPDB action loads class placement dependencies
- **WHEN** an administrator opens the cloned `PPDB` approve flow
- **THEN** the page can load the available class placement options required to complete approval
- **AND** the cloned workflow can persist the admissions-to-student-to-class relationships used by the current repository

### Requirement: Data Peserta Source Behavior Parity
The target application SHALL preserve the current source behavior of the working `Data Peserta` controllers while adapting delivery to Laravel controllers and Inertia React pages.

#### Scenario: Feature is ported from source module
- **WHEN** the clone is implemented in the target application
- **THEN** the resulting pages preserve the same workflow boundaries, field coverage, validation intent, state transitions, and navigation relationships described by the source `Peserta Didik`, `Wali Murid`, and `PPDB` flows
- **AND** the implementation is not required to preserve nwidart, Blade partial, DataTables, Select2, Bootstrap modal, or jQuery-specific structures
