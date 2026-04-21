# student-lifecycle Specification

## Purpose
TBD - created by archiving change add-zen-core-platform-foundation. Update Purpose after archive.
## Requirements
### Requirement: Student Admissions and Enrollment Records
The system SHALL maintain applicant, student, and guardian records through admissions review, approval, rejection, and class placement workflows.

#### Scenario: Approve an applicant into an active student
- **WHEN** an admin approves an applicant that includes guardian details and a selected class
- **THEN** the system creates or activates the student record, preserves the guardian relationship, and assigns the student to the selected class

#### Scenario: Reject an applicant without losing history
- **WHEN** an admin rejects an applicant during admissions review
- **THEN** the system records the decision outcome and retains the applicant record for audit and follow-up purposes

### Requirement: Standardized Student Address Data
The system SHALL support standardized address capture for student and guardian records using Indonesian administrative reference data.

#### Scenario: Select a valid administrative address
- **WHEN** an admin enters a student or guardian address
- **THEN** the system allows the address to be selected from supported province, regency, district, and village reference data

### Requirement: Student Management - Create
The system SHALL provide a dedicated page for creating new student records.

#### Scenario: Navigate to create page
- **WHEN** admin clicks "Add student" button
- **THEN** navigate to /peserta-murid/create page showing empty form
- **AND** form fields are accessible and scrollable

#### Scenario: Submit new student
- **WHEN** admin fills required fields and submits
- **THEN** student is created and redirected to list
- **AND** success message is displayed

### Requirement: Student Management - Edit
The system SHALL provide a dedicated page for editing existing student records.

#### Scenario: Navigate to edit page
- **WHEN** admin clicks edit icon on student row
- **THEN** navigate to /peserta-murid/{id}/edit page showing populated form

#### Scenario: Update student
- **WHEN** admin modifies fields and submits
- **AND** student is updated and redirected to list
- **AND** success message is displayed

