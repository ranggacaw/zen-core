## ADDED Requirements
### Requirement: ERD-Aligned Clone MVP Boundary
The project SHALL define its Phase 1 clone MVP around the ERD-backed school operations baseline consisting of access control, staff and student records, guardian and admissions workflows, class and room structure, academic indicator and schedule structure, report-card scoring, student attendance, school announcements, document attachments, and room-booking workflows.

#### Scenario: Select the included clone modules
- **WHEN** the team plans Phase 1 delivery from the ERD
- **THEN** the MVP scope includes `User`, roles and permissions, menus, staff records, student records, guardian records, admissions, class levels, rooms, classes, class membership, teacher assignments, indicators, indicator details, class indicators, schedules, report cards, student attendance, school announcements, documents, and room usage

#### Scenario: Preserve end-to-end school operations in scope
- **WHEN** a workflow depends on linked records across admissions, class setup, teaching assignments, attendance, communication, or report outputs
- **THEN** the MVP scope keeps the upstream entities and relationships required to complete that workflow without depending on deferred modules

### Requirement: Deferred Non-MVP Domains and Expansions
The project SHALL defer domains that the ERD marks as partial, ambiguous, or unnecessary for the safe clone baseline, including finance and payment workflows, inventory and asset management, events, chat, academy expansions, blogs, ebooks, extracurricular management, discipline tracking, broad analytics, and staff-attendance expansion beyond what is strictly required for the MVP.

#### Scenario: Exclude partial modules from Phase 1
- **WHEN** a requested feature depends on inventory, finance, event, chat, academy, or other partially implemented domains identified in the ERD notes
- **THEN** the feature is planned outside the Phase 1 clone MVP unless a later approved change explicitly brings that domain into scope

#### Scenario: Exclude broad platform services that are not workflow-critical
- **WHEN** a potential MVP feature only adds analytics, realtime updates, broad full-text search, or other non-essential platform enhancements
- **THEN** the feature remains out of scope for Phase 1 unless a scoped ERD-backed workflow cannot function without it

### Requirement: Dependency-Ordered MVP Delivery
The project SHALL deliver the clone MVP in slices that follow the ERD dependency order so that each increment unlocks the next school workflow without requiring speculative infrastructure.

#### Scenario: Build the clone in dependency order
- **WHEN** implementation planning is prepared for the Phase 1 clone
- **THEN** the work is sequenced as access foundation first, then people records and admissions, then class and room structure, then academic structures and scoring, then attendance and communication workflows, and finally any MVP reporting polish required by those workflows
