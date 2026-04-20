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

