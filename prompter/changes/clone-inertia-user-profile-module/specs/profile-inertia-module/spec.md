## ADDED Requirements

### Requirement: Render the profile module through Inertia at the existing path
The target project MUST provide the cloned profile module at `/masterdata/user/{id}/profile` using Laravel + Inertia so the existing profile entry point is preserved.

#### Scenario: Pegawai pengajar opens the cloned profile page
Given an authenticated user can access `/masterdata/user/{id}/profile`
And the referenced profile belongs to a `Pegawai` whose related employee type is `Pengajar`
When the profile page is rendered in the target project
Then the response is an Inertia page
And the page shows `Data Diri` and `Ubah Password` tabs
And `Data Diri` is the active tab by default.

#### Scenario: Non-pengajar opens the cloned profile page
Given an authenticated user can access `/masterdata/user/{id}/profile`
And the referenced profile does not meet the `Pegawai/Pengajar` condition for personal data editing
When the profile page is rendered in the target project
Then the page still loads successfully
And the page shows `Ubah Password`
And the page does not expose the `Data Diri` tab.

### Requirement: Provide the data contract required by the Inertia page
The target project MUST preload the profile data and reference values the Inertia page needs to render the cloned module without relying on Blade partials or jQuery-seeded state.

#### Scenario: Pengajar page props are prepared
Given the target project renders the profile page for a `Pegawai/Pengajar` user
When the Inertia props are built
Then the payload includes the user identity for the page
And the current personal data values needed to populate the full `Data Diri` form
And the role display data needed for the read-only jabatan field
And the selected subject identifiers for the multi-select field
And the current photo URL if a profile photo exists
And the current province, regency, district, and village identifiers needed to seed the cascading address selectors.
