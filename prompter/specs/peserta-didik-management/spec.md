# peserta-didik-management Specification

## Purpose
TBD - created by archiving change add-inertia-data-peserta-clone. Update Purpose after archive.
## Requirements
### Requirement: Peserta Didik List
The target application SHALL provide a `Peserta Didik` list that preserves the source workflow's newest-first ordering, participant summary fields, PPDB status visibility, and entry to open participant detail.

#### Scenario: Administrator reviews the Peserta Didik list
- **WHEN** an administrator opens the cloned `Peserta Didik` page
- **THEN** the page lists participant records ordered from newest to oldest
- **AND** each row shows the participant's full name, nickname, NIS, gender, current PPDB status, and detail entry point

### Requirement: Peserta Didik Readonly Detail
The target application SHALL provide a read-oriented `Peserta Didik` detail page aligned to the source participant screen.

#### Scenario: Administrator opens a participant detail page
- **WHEN** an administrator opens a cloned participant detail entry
- **THEN** the page shows the participant's profile, family, general, and address data in a read-oriented layout
- **AND** the page keeps non-photo participant fields non-editable for this change

### Requirement: Peserta Didik Profile Picture Update
The target application SHALL allow administrators to replace a participant's profile picture from the cloned detail page.

#### Scenario: Administrator uploads a new participant photo
- **WHEN** an administrator submits a valid replacement image for a participant from the detail page
- **THEN** the application stores the uploaded image using the target project's file-storage conventions
- **AND** the participant record points to the new profile image
- **AND** the administrator receives success or validation feedback and remains in the same participant context

