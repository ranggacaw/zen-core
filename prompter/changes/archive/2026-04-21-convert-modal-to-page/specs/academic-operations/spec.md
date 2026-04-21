## ADDED Requirements
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