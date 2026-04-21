# absensi-peserta-didik-list Specification

## Purpose
TBD - created by archiving change add-inertia-absensi-clone. Update Purpose after archive.
## Requirements
### Requirement: Student Attendance List Page
The system SHALL provide an `Absensi Peserta Didik List` page that shows recent student attendance records in descending order.

#### Scenario: User opens the attendance list
- **WHEN** an authorized user navigates to `Absensi Peserta Didik List`
- **THEN** the page displays recent student attendance records ordered from newest to oldest

### Requirement: Attendance List Data Presentation
The system SHALL render each recent attendance entry with the student and timing context needed to review the attendance event.

#### Scenario: Attendance records are displayed with related context
- **WHEN** recent attendance records are available
- **THEN** each row shows the related student identity, student number, class context, and check-in or check-out times

### Requirement: Read-Oriented List Scope
The system SHALL keep `Absensi Peserta Didik List` scoped to read-oriented attendance review for this change unless the target project explicitly requires more.

#### Scenario: User reviews the cloned attendance list
- **WHEN** the user uses `Absensi Peserta Didik List`
- **THEN** the page supports reviewing recent attendance data without depending on newly introduced edit, delete, or persistent filtering behavior

