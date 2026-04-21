# penggunaan-fasilitas Specification

## Purpose
TBD - created by archiving change add-inertia-data-ruangan-clone. Update Purpose after archive.
## Requirements
### Requirement: Penggunaan Fasilitas CRUD Flow
The target application SHALL provide a `Penggunaan Fasilitas` flow for creating, listing, editing, and deleting facility booking records backed by `t_penggunaan_ruangan`.

#### Scenario: User creates or edits a facility booking
- **WHEN** the user submits a `Penggunaan Fasilitas` form
- **THEN** the application captures requester type, requester identity, facility, start datetime, end datetime, and description fields equivalent to the source flow
- **AND** facility selection is limited to `Fasilitas Sekolah` rooms
- **AND** the booking record stores both the split date or time fields and the combined datetime fields expected by the source semantics

### Requirement: Penggunaan Fasilitas Requester Coverage
The target application SHALL support facility booking requests for either murid or guru, matching the source flow's conditional requester behavior.

#### Scenario: User books a facility for a murid
- **WHEN** the user selects requester type `murid`
- **THEN** the booking form requires a murid selection
- **AND** the guru selection is not required for that booking

#### Scenario: User books a facility for a guru
- **WHEN** the user selects requester type `guru`
- **THEN** the booking form requires a guru selection
- **AND** the murid selection is not required for that booking

### Requirement: Penggunaan Fasilitas Conflict Detection
The target application SHALL reject a booking when its requested datetime range overlaps an existing booking for the same facility.

#### Scenario: User attempts to save an overlapping booking
- **WHEN** the requested facility already has a booking whose active time range overlaps the submitted start and end datetimes
- **THEN** the application rejects the save
- **AND** the user receives an error indicating the facility is already taken for that time range

### Requirement: Penggunaan Fasilitas Usage Status
The target application SHALL show whether a facility booking has already finished based on its end datetime.

#### Scenario: User views facility booking list
- **WHEN** the user opens the `Penggunaan Fasilitas` list
- **THEN** each row shows the facility, requester name, requester type, start datetime, end datetime, and a completion status derived from whether the booking end time has passed

