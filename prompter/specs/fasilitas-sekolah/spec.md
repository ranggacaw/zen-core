# fasilitas-sekolah Specification

## Purpose
TBD - created by archiving change add-inertia-data-ruangan-clone. Update Purpose after archive.
## Requirements
### Requirement: Fasilitas Sekolah CRUD Flow
The target application SHALL provide a `Fasilitas Sekolah` CRUD flow backed by `m_ruangan` records filtered to room type `Fasilitas Sekolah`.

#### Scenario: User opens fasilitas sekolah list
- **WHEN** the user opens `Fasilitas Sekolah`
- **THEN** the application lists active room records whose type is `Fasilitas Sekolah`
- **AND** the user can create, edit, and delete entries from that filtered facility set

#### Scenario: User saves a fasilitas sekolah entry
- **WHEN** the user submits a create or edit form for `Fasilitas Sekolah`
- **THEN** the application validates the facility name with the same uniqueness intent as the source flow
- **AND** newly created entries are stored with room type `Fasilitas Sekolah`
- **AND** updates keep the record in the facility scope used by `Penggunaan Fasilitas`

