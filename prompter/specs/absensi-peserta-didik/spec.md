# absensi-peserta-didik Specification

## Purpose
TBD - created by archiving change add-inertia-absensi-clone. Update Purpose after archive.
## Requirements
### Requirement: Student Attendance Scan Page
The system SHALL provide an `Absensi Peserta Didik` page for fast repeated attendance submission in the target Laravel + Inertia React application.

#### Scenario: User opens the student attendance page
- **WHEN** an authorized user navigates to `Absensi Peserta Didik`
- **THEN** the page is ready for scanner or manual input without requiring extra navigation away from the attendance form

### Requirement: Student Attendance Recording
The system SHALL resolve each submitted scan value to a student and write same-day attendance using the source attendance behavior.

#### Scenario: First successful scan on a date creates check-in
- **WHEN** the submitted scan value matches a student and no attendance record exists yet for that student on the current date
- **THEN** the system creates a same-day attendance record with a check-in time

#### Scenario: Second successful scan on a date fills check-out
- **WHEN** the submitted scan value matches a student and a same-day attendance record already exists without a check-out time
- **THEN** the system updates that record with a check-out time instead of creating a second attendance row

#### Scenario: Unknown scan value is rejected
- **WHEN** the submitted scan value does not match any student
- **THEN** the system does not create or update an attendance record
- **AND** the user receives error feedback and remains in the student attendance flow

### Requirement: Attendance Submission Feedback
The system SHALL provide submission feedback that matches the outcome of each attendance attempt.

#### Scenario: Successful attendance submission returns to the scan flow
- **WHEN** a student attendance submission succeeds
- **THEN** the user receives success feedback through the target app's flash or toast mechanism
- **AND** the application returns the user to the `Absensi Peserta Didik` page so the next scan can be entered immediately

