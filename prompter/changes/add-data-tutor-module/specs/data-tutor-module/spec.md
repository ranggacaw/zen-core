## ADDED Requirements
### Requirement: Data Tutor Module Registration
The system SHALL register `Data Tutor` as an independent module so it can coexist with `Data Pegawai` without namespace, provider, route, or view collisions.

#### Scenario: Module boots independently from Data Pegawai
- **WHEN** the application loads registered modules
- **THEN** `Data Tutor` is discovered through its own module metadata and service provider
- **AND** tutor resources resolve through a tutor-specific namespace and view alias
- **AND** existing `Data Pegawai` module registration remains unchanged

### Requirement: Data Tutor Navigation Group
The system SHALL expose a top-level navigation group labeled `Data Tutor` with slug `data-tutor` that contains cloned `Pengajar` and `Non-Pengajar` entries.

#### Scenario: Sidebar shows tutor navigation group
- **WHEN** menu data is seeded and rendered in the application sidebar
- **THEN** a top-level `Data Tutor` menu is shown
- **AND** it contains child entries labeled `Pengajar` and `Non-Pengajar`
- **AND** the existing `Data Pegawai` menu is still shown separately
