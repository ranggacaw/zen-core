## ADDED Requirements
### Requirement: User List And Filters
The target application SHALL provide a `Users` list that preserves the source workflow's newest-first ordering, related display-name rendering, user-type filtering, created-date filtering, status visibility, and edit access.

#### Scenario: Administrator filters the Users list
- **WHEN** an administrator opens the `Users` page and filters by one or more user types or a created-date range
- **THEN** the list shows matching `master_user` records ordered from newest to oldest
- **AND** each row shows the user's display name, email, user type, status, created date, and edit action

### Requirement: User Create And Update
The target application SHALL allow administrators to create and update users with source-aligned validation and persistence behavior.

#### Scenario: Administrator creates a new user
- **WHEN** an administrator submits a new user with a unique email and valid password
- **THEN** the application creates the `master_user` record with active status
- **AND** the user receives the source-aligned default role assignment equivalent to `superadmin`
- **AND** the administrator receives success feedback in the target application's flash or toast mechanism

#### Scenario: Administrator updates an existing user without replacing password
- **WHEN** an administrator updates a user's email or status and leaves the password input empty
- **THEN** the application saves the changed non-password fields
- **AND** the existing password remains unchanged

### Requirement: User Profile Access And Password Change
The target application SHALL provide user profile access and a password-change flow aligned to the source `Users` module.

#### Scenario: Administrator opens a user profile entry
- **WHEN** an administrator opens the cloned user profile entry for a user
- **THEN** the page exposes password-management actions
- **AND** the page may also show related person details when equivalent profile data exists in the target project

#### Scenario: Administrator changes a user's password
- **WHEN** an administrator submits a valid replacement password for a user from the profile flow
- **THEN** the application updates the stored password for that user
- **AND** the administrator receives success or validation feedback without leaving the profile context
