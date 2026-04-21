# academic-operations Specification

## Purpose
TBD - created by archiving change add-zen-core-platform-foundation. Update Purpose after archive.
## Requirements
### Requirement: Class Workspace Management
The system SHALL provide a class workspace that centralizes class details, students, teachers, schedules, tasks, and academic indicators.

#### Scenario: Open a class workspace
- **WHEN** an admin or teacher opens a class record
- **THEN** the system shows the class details, enrolled students, assigned teachers, schedule data, task data, and academic indicator context in one workspace

### Requirement: Assessment Ownership and Report Outputs
The system SHALL support indicator-based score entry and printable academic outputs based on class, term, subject, and teacher responsibilities.

#### Scenario: Enter scores for an assigned teaching context
- **WHEN** a teacher opens score entry for a class, subject, semester, and assigned indicator set
- **THEN** the system allows the teacher to enter scores only for the contexts they are authorized to manage and makes the resulting data available for report outputs

### Requirement: Guardian Management - Create
The system SHALL provide a dedicated page for creating new guardian records.

#### Scenario: Navigate to create page
- **WHEN** user clicks "Add guardian" button
- **THEN** navigate to /wali-murid/create page showing empty form

#### Scenario: Submit new guardian
- **WHEN** user fills required fields and submits
- **THEN** guardian is created and redirected to list
- **AND** success message is displayed

### Requirement: Guardian Management - Edit
The system SHALL provide a dedicated page for editing existing guardian records.

#### Scenario: Navigate to edit page
- **WHEN** user clicks edit icon on guardian row
- **THEN** navigate to /wali-murid/{id}/edit page showing populated form

#### Scenario: Update guardian
- **WHEN** user modifies fields and submits
- **THEN** guardian is updated and redirected to list
- **AND** success message is displayed

