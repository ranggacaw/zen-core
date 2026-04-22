# ppdb-management Specification

## Purpose
TBD - created by archiving change add-inertia-data-peserta-clone. Update Purpose after archive.
## Requirements
### Requirement: PPDB List And Status Actions
The target application SHALL provide a `PPDB` list that preserves the source workflow's admissions summary, status visibility, and approve or reject action entry points.

#### Scenario: Administrator reviews the PPDB list
- **WHEN** an administrator opens the cloned `PPDB` page
- **THEN** the page lists admissions records with guardian name, student name, gender, birth data, religion, phone number, and current PPDB status
- **AND** each row exposes detail, approve, and reject-related actions based on the current admissions state

### Requirement: PPDB Readonly Detail
The target application SHALL provide a readonly `PPDB` detail page aligned to the source admissions review screen.

#### Scenario: Administrator opens PPDB detail
- **WHEN** an administrator opens a cloned admissions detail entry
- **THEN** the page shows account, student, guardian, identity, and address data for that admission
- **AND** the page does not introduce new edit behavior for this change

### Requirement: PPDB Approval
The target application SHALL allow administrators to approve an admission by placing the participant into a class and transitioning the related student record into active student status.

#### Scenario: Administrator approves an admission
- **WHEN** an administrator selects a class and confirms approval for a `PPDB` record
- **THEN** the related student record is created or updated into active student status
- **AND** the student's class placement uses the selected class and its academic year context
- **AND** the student is attached to the selected class placement
- **AND** the administrator receives success or validation feedback

### Requirement: PPDB Rejection
The target application SHALL allow administrators to reject an admission with a required note.

#### Scenario: Administrator rejects an admission
- **WHEN** an administrator provides a rejection note and confirms rejection for a `PPDB` record
- **THEN** the related `m_murid` record is updated to rejected status
- **AND** the rejection note is stored on the admission record
- **AND** later list views can expose the saved rejection note

### Requirement: PPDB Exact Source Scope
The target application SHALL keep the cloned `PPDB` scope limited to the workflows that are currently implemented in the source module.

#### Scenario: Team reviews PPDB implementation scope
- **WHEN** the clone is implemented for this change
- **THEN** the required `PPDB` workflows are list, detail, approve, and reject
- **AND** new create or edit admissions forms are not required by this proposal

