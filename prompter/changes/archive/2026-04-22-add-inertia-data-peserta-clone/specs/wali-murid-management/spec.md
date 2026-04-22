## ADDED Requirements
### Requirement: Wali Murid List
The target application SHALL provide a `Wali Murid` list that preserves the source workflow's guardian summary view and management entry points.

#### Scenario: Administrator reviews the Wali Murid list
- **WHEN** an administrator opens the cloned `Wali Murid` page
- **THEN** the page lists guardians with name, child count, occupation, phone number, and avatar summary
- **AND** each row exposes create, edit, or delete management actions consistent with the target application's UI patterns

### Requirement: Wali Murid Create And Update
The target application SHALL allow administrators to create and update guardians with source-aligned validation, student assignment, and address lookup behavior.

#### Scenario: Administrator creates a guardian
- **WHEN** an administrator submits a new guardian with required identity, contact, child-count, and student-assignment data
- **THEN** the application creates the `m_wali_murid` record
- **AND** the selected participant relationships are persisted in `m_wali_murid_has_murid`
- **AND** the administrator receives success or validation feedback in the target application's UI pattern

#### Scenario: Administrator updates a guardian
- **WHEN** an administrator edits an existing guardian and submits revised profile, address, or student-assignment data
- **THEN** the application updates the guardian record and syncs the guardian-to-student relationships
- **AND** optional replacement photo uploads are stored using the target project's file-storage conventions

### Requirement: Wali Murid Linked User Account
The target application SHALL manage the linked guardian user account needed by the source workflow.

#### Scenario: Administrator creates a guardian with a login account
- **WHEN** an administrator creates a new guardian with a unique email address
- **THEN** the application creates the related `master_user` record with the source-aligned guardian user type
- **AND** the linked user receives the target equivalent of the source `Wali Murid` role assignment
- **AND** the guardian record stores the linked user reference

#### Scenario: Administrator updates a guardian email
- **WHEN** an administrator changes the email address for an existing guardian with a linked user account
- **THEN** the linked `master_user` email is updated to match the guardian workflow

### Requirement: Wali Murid Delete Flow
The target application SHALL allow administrators to delete a guardian from the cloned `Wali Murid` flow.

#### Scenario: Administrator deletes a guardian
- **WHEN** an administrator confirms deletion for a guardian from the list page
- **THEN** the application removes the guardian record according to target-project deletion conventions
- **AND** the linked guardian-student relationships are removed
- **AND** any linked guardian user account or uploaded guardian asset is cleaned up when the target application is configured to manage it within the same workflow
