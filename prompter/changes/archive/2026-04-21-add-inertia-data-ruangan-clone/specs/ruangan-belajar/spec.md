## ADDED Requirements
### Requirement: Ruangan Belajar CRUD Flow
The target application SHALL provide a `Ruangan Belajar` CRUD flow backed by `m_ruangan` records filtered to room type `Ruang Kelas`.

#### Scenario: User opens ruangan belajar list
- **WHEN** the user opens `Ruangan Belajar`
- **THEN** the application lists active room records whose type is `Ruang Kelas`
- **AND** the user can create, edit, and delete entries from that filtered room set

#### Scenario: User saves a ruang belajar entry
- **WHEN** the user submits a create or edit form for `Ruangan Belajar`
- **THEN** the application validates the room name with the same uniqueness intent as the source flow
- **AND** newly created entries are stored with room type `Ruang Kelas`
- **AND** updates do not change the room's role outside the `Ruangan Belajar` scope
