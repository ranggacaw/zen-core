# sekolah-informasi-management Specification

## Purpose
TBD - created by archiving change add-inertia-sekolah-informasi-clone. Update Purpose after archive.
## Requirements
### Requirement: Informasi Sekolah List Flow
The target application SHALL provide an `Informasi` list page that surfaces active school-information records ordered from newest to oldest.

#### Scenario: User opens Informasi list
- **WHEN** the user opens the `Informasi` page
- **THEN** the application lists active information records in descending record order
- **AND** each row includes a content excerpt, information date, approval status, created timestamp, and available row actions

### Requirement: Informasi Sekolah Create And Edit Flow
The target application SHALL provide create and edit flows for school-information records with source-aligned fields for date, information type, class targets, title, content, cover image, and supporting document attachment.

#### Scenario: User creates or edits school information
- **WHEN** the user submits the `Informasi` create or edit form
- **THEN** the application validates the source-aligned required fields for date, type, class targets, title, and content
- **AND** the application persists the information record with its selected class targets
- **AND** the application stores any uploaded cover image or supporting document in a target-project-compatible storage flow

### Requirement: Informasi Sekolah Edit Prefill
The target application SHALL preload existing field values and selected class targets when a user edits a school-information record.

#### Scenario: User opens edit page
- **WHEN** the user opens the edit flow for an existing `Informasi` record
- **THEN** the page loads the record's current date, type, title, content, and selected class targets
- **AND** the user can submit updates without re-entering unchanged relation data manually

### Requirement: Informasi Sekolah Delete Cleanup
The target application SHALL allow deletion of a school-information record while cleaning up its related class links and uploaded assets.

#### Scenario: User deletes school information
- **WHEN** the user confirms deletion of an `Informasi` record
- **THEN** the application removes the information record
- **AND** the application removes the record's related class-target links
- **AND** the application removes any related uploaded cover image or supporting document assets linked to that record

