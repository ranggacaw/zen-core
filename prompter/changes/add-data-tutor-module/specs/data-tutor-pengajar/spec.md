## ADDED Requirements
### Requirement: Tutor Pengajar CRUD Flow
The system SHALL provide a cloned `Pengajar` management flow under `Data Tutor` that preserves the current `Data Pegawai` pengajar capabilities while using tutor-specific routes, controllers, and views.

#### Scenario: User opens tutor pengajar list
- **WHEN** the user selects `Data Tutor > Pengajar`
- **THEN** the application opens the tutor pengajar index page
- **AND** the page is served through tutor-specific route names and view references
- **AND** the existing `pegawai-pengajar` flow remains available separately

#### Scenario: User manages tutor pengajar data
- **WHEN** the user creates, edits, views, or deletes tutor pengajar entries
- **THEN** the application follows the same field coverage, validation behavior, and success or error handling as the current `Data Pegawai` pengajar flow
- **AND** all form actions and redirects stay within tutor-specific routes

### Requirement: Tutor Pengajar Lookup API
The system SHALL expose a tutor pengajar lookup endpoint that mirrors the current pengajar API behavior under a tutor-specific route namespace.

#### Scenario: Consumer requests tutor pengajar lookup data
- **WHEN** an internal consumer requests the tutor pengajar list endpoint
- **THEN** the application responds from a tutor-specific API route
- **AND** the response structure is compatible with the existing pengajar lookup behavior
