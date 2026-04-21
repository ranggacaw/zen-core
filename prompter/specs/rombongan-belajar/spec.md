# rombongan-belajar Specification

## Purpose
TBD - created by archiving change add-inertia-data-ruangan-clone. Update Purpose after archive.
## Requirements
### Requirement: Rombongan Belajar CRUD Flow
The target application SHALL provide a `Rombongan Belajar` management flow that clones the current `ruang-kelas` behavior with fields for class name, class level, homeroom teacher, assigned room, and school year.

#### Scenario: User manages rombongan belajar data
- **WHEN** the user opens the `Rombongan Belajar` list or submits a create or edit form
- **THEN** the application lists or persists class records backed by the source class semantics
- **AND** the flow uses class level, teacher, and room lookups equivalent to the source module
- **AND** validation requires the same core fields as the source flow

### Requirement: Rombongan Belajar Detail Workspace
The target application SHALL provide a class-scoped detail workspace for each `Rombongan Belajar` record with sections for overview, murid, guru, jadwal, kelas harian, tugas, indikator, and raport-related context.

#### Scenario: User opens a rombongan belajar detail page
- **WHEN** the user selects a `Rombongan Belajar` record from the list
- **THEN** the application opens a class-specific detail page
- **AND** the page exposes the same child workflow groupings that the source `ruang-kelas.show`, `murid`, `guru`, `jadwal`, `kelas-harian`, `tugas`, `indikator`, and `raport` flows currently provide

### Requirement: Rombongan Belajar Teacher Assignment
The target application SHALL allow teacher-subject assignments within a selected `Rombongan Belajar` using the source `m_kelas_has_pegawai` semantics.

#### Scenario: User assigns a teacher to a subject in a class
- **WHEN** the user submits a teacher assignment for a selected class and indikator
- **THEN** the assignment is stored against that class
- **AND** subsequent class schedule or task flows can reuse that teacher-subject assignment
- **AND** the application can resolve the assigned teacher for a given subject inside the selected class

### Requirement: Rombongan Belajar Schedule Management
The target application SHALL support class schedule headers and schedule slot details for each `Rombongan Belajar` using the current semester and per-day slot model.

#### Scenario: User manages a class schedule
- **WHEN** the user creates a semester schedule or adds, edits, or deletes schedule slots for a class
- **THEN** the application stores the schedule under the selected class
- **AND** each slot references an existing teacher-subject assignment for that class
- **AND** slot data preserves day, start time, and end time semantics from the source flow

### Requirement: Rombongan Belajar Daily Journal And Task Management
The target application SHALL provide class-scoped `Kelas Harian` and `Tugas` flows within each `Rombongan Belajar`.

#### Scenario: User manages kelas harian entries
- **WHEN** the user creates, edits, or deletes a daily journal entry inside a class
- **THEN** the entry remains scoped to that class
- **AND** the stored data preserves the source date and content fields

#### Scenario: User manages tugas entries
- **WHEN** the user creates, edits, or deletes a task inside a class
- **THEN** the task remains scoped to that class through its teacher-subject assignment
- **AND** the stored data preserves subject, teacher, due date, title, and description coverage from the source flow

### Requirement: Rombongan Belajar Indicator And Raport Context
The target application SHALL expose indikator activation and raport-related summary context for each `Rombongan Belajar`.

#### Scenario: User updates active indikator details for a class
- **WHEN** the user edits indikator selections for a class
- **THEN** the application updates the class's active indikator detail mappings
- **AND** the class detail workspace reflects the updated indikator state for raport-related use cases

#### Scenario: User views raport context for a class
- **WHEN** the user opens the raport-related section of a class workspace
- **THEN** the application shows the class-level raport context and related indikator availability needed by the source flow
- **AND** the clone does not need to redesign the report-card domain to provide that context

