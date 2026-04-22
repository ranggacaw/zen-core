## ADDED Requirements

### Requirement: Update full pengajar personal data from the cloned profile module
The target project MUST allow the cloned profile module to update the full current `Data Diri` scope for `Pegawai/Pengajar` users, including personal fields, employment-related fields, subject associations, address data, and optional photo replacement.

#### Scenario: Pengajar submits valid personal data
Given a `Pegawai/Pengajar` profile is loaded in the cloned Inertia module
When the user submits valid personal data from the `Data Diri` form
Then the target project updates the owned profile fields with the submitted values
And synchronizes the selected subjects
And keeps related user identity data consistent where the source module currently does so
And stores a replacement photo when a new image is uploaded
And returns success feedback on the profile page.

#### Scenario: Personal data submission fails validation
Given a `Pegawai/Pengajar` profile is loaded in the cloned Inertia module
When the user submits invalid profile data such as a missing required field, invalid email, or unsupported photo upload
Then the target project rejects the update
And persists no partial changes for that submission
And returns field-level validation feedback to the Inertia page.

### Requirement: Support cascading geographic lookups for the profile form
The target project MUST provide the lookup behavior required for province, regency, district, and village selection in the cloned profile form.

#### Scenario: User changes the selected province
Given the user is editing `Data Diri`
When the user selects a province
Then the target project can return only regencies for that province
And lower-level selections can be refreshed from that choice.

#### Scenario: Existing address values are shown on edit
Given the profile already has province, regency, district, and village values saved
When the cloned profile page loads
Then the current address selections are shown in the form before the user makes changes.

### Requirement: Update passwords from the cloned profile module
The target project MUST allow password updates from the `Ubah Password` tab using the same minimum validation expectation as the source module.

#### Scenario: User submits a valid new password
Given the user is on the `Ubah Password` tab
When the user submits a new password with at least 8 characters
Then the target project hashes and stores the password for the referenced user
And returns success feedback on the profile page.

#### Scenario: User submits an invalid new password
Given the user is on the `Ubah Password` tab
When the user submits an empty password or one shorter than 8 characters
Then the target project rejects the update
And the existing password remains unchanged
And validation feedback is shown on the profile page.
