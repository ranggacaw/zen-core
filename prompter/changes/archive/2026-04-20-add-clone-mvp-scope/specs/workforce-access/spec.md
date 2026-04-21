## MODIFIED Requirements
### Requirement: Staff Onboarding and Account Provisioning
The system SHALL maintain staff and teacher records, including position assignments, and optionally create linked user accounts with role-based access during onboarding.

#### Scenario: Onboard a teacher with system access
- **WHEN** an admin creates a teacher record, assigns a staff position, and assigns an application role
- **THEN** the system stores the staff details, links the position, creates the linked user account, and grants access according to the assigned role

#### Scenario: Onboard a staff member without immediate login access
- **WHEN** an admin creates a staff record without assigning a user account yet
- **THEN** the system preserves the staff and position records without requiring immediate authentication access

### Requirement: Role-Based Navigation and Permissions
The system SHALL provide role-aware navigation and permission checks for authenticated school users based on configured roles, permissions, and menu assignments.

#### Scenario: Show only authorized navigation items
- **WHEN** a user signs in with a specific role and permission set
- **THEN** the system shows only the menu items and actions that user is authorized to access

#### Scenario: Restrict protected staff actions
- **WHEN** a user attempts to open or modify a staff-management action without the required permission
- **THEN** the system denies access to the protected action
