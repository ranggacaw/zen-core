## ADDED Requirements
### Requirement: Informasi Sekolah Approval Action
The target application SHALL allow privileged users to approve school-information records from the `Informasi` management flow.

#### Scenario: Privileged user approves an information item
- **WHEN** a user with target-project access equivalent to `Kepala Sekolah` or `superadmin` approves an `Informasi` record
- **THEN** the application updates the record so it is marked approved
- **AND** the user receives success feedback in the target application's flash or toast mechanism

### Requirement: Informasi Sekolah Approval Visibility
The target application SHALL show approval controls only to privileged users mapped to the source workflow's approval authority.

#### Scenario: Non-privileged user views Informasi list
- **WHEN** a user without target-project access equivalent to `Kepala Sekolah` or `superadmin` views the `Informasi` list
- **THEN** the user can still view the approval status of each record
- **AND** the user is not offered the approval action control
