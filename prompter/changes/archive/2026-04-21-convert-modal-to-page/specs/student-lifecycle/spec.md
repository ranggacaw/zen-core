## ADDED Requirements
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