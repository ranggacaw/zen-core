## MODIFIED Requirements
### Requirement: Student Admissions and Enrollment Records
The system SHALL maintain applicant, student, and guardian records through admissions review, approval, rejection, guardian linking, and class placement workflows.

#### Scenario: Approve an applicant into an active student
- **WHEN** an admin approves an applicant that includes guardian details and a selected class
- **THEN** the system creates or activates the student record, preserves the guardian relationship, and assigns the student to the selected class

#### Scenario: Reject an applicant without losing history
- **WHEN** an admin rejects an applicant during admissions review
- **THEN** the system records the decision outcome and retains the applicant record for audit and follow-up purposes

#### Scenario: Link one guardian to multiple students
- **WHEN** an admin links an existing guardian to more than one student record
- **THEN** the system preserves each guardian-student relationship without duplicating the guardian profile

### Requirement: Standardized Student Address Data
The system SHALL support standardized address capture for student and guardian records using Indonesian administrative reference data.

#### Scenario: Select a valid administrative address
- **WHEN** an admin enters a student or guardian address
- **THEN** the system allows the address to be selected from supported province, regency, district, and village reference data

#### Scenario: Preserve address consistency across admissions data
- **WHEN** applicant or guardian address data is promoted from admissions into active records
- **THEN** the system keeps the selected administrative references consistent in the resulting student and guardian records
