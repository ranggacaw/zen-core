# daily-operations Specification

## Purpose
TBD - created by archiving change add-zen-core-platform-foundation. Update Purpose after archive.
## Requirements
### Requirement: Attendance Scan Workflow
The system SHALL capture daily attendance through scan or identifier input using first-scan check-in and second-scan check-out behavior.

#### Scenario: Record check-in then check-out from repeated scans
- **WHEN** a student's identifier is scanned for the first time on a school day and then scanned again later that day
- **THEN** the system records the first scan as check-in and the second scan as check-out for that student's daily attendance record

### Requirement: Daily Attendance Visibility
The system SHALL show recent attendance activity in an internal operational view for school staff.

#### Scenario: Review recent attendance activity
- **WHEN** an authorized user opens the attendance screen
- **THEN** the system shows recent scan activity with the student, class, and current check-in or check-out status

