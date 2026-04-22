## ADDED Requirements
### Requirement: Admin Profile Access And Data Diri
The target application SHALL allow administrators to open a selected user's `Profile` screen and edit `Data Diri` with source-aligned `Pegawai`-oriented sections when equivalent backing data exists in the target project.

#### Scenario: Administrator opens a profile with equivalent employee data
- **WHEN** an administrator opens the profile for a user that has equivalent employee-profile data in the target application
- **THEN** the screen shows source-aligned identity and `Data Diri` sections, including personal, general, and address groups
- **AND** the page can expose role display, profile photo, subject or program-study selections, religion options, and geography lookups when those source dependencies exist in the target project

#### Scenario: Equivalent profile dependencies are missing
- **WHEN** an administrator opens a selected user's profile in a target project that lacks one or more equivalent employee, subject, or geography data sources
- **THEN** the profile still loads for the selected user
- **AND** unsupported `Data Diri` fields are omitted, read-only, or otherwise unavailable without blocking password management

### Requirement: Profile Password Change
The target application SHALL allow administrators to change a selected user's password from the `Profile` screen with source-aligned validation and same-page feedback.

#### Scenario: Administrator changes a user's password
- **WHEN** an administrator submits a valid replacement password from the `Ubah Password` section
- **THEN** the application updates the stored password for the selected user
- **AND** the administrator receives success feedback without leaving the profile screen

#### Scenario: Password validation fails
- **WHEN** an administrator submits an empty password or one shorter than the required minimum
- **THEN** the application keeps the administrator on the same profile screen
- **AND** validation feedback is shown in the `Ubah Password` context without applying the password change
