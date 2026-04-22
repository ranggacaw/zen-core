## 1. Implementation
- [x] 1.1 Map the source profile flow into the target project by documenting the required models, relationships, and reference data for `User`, `Pegawai`, roles, subjects, photo storage, and master locations. Implemented against `platform/` after the user confirmed `clone-output/` was not the active workspace target.
- [x] 1.2 Add backend routes and controllers in the target project for the profile page, personal data update, password update, and geographic lookup endpoints required by the address cascade.
- [x] 1.3 Build the Inertia profile page and supporting components under the target project, preserving the legacy `/masterdata/user/{id}/profile` entry path, `Pengajar`-only `Data Diri` visibility, and the full cloned form scope.
- [x] 1.4 Implement backend validation and persistence so personal data updates mirror the source behavior for `Pegawai/Pengajar`, including subject synchronization, optional photo replacement, address persistence, and related user consistency.
- [x] 1.5 Implement the password update flow with minimum-length validation, password hashing, and profile-page success or error feedback.
- [x] 1.6 Add verification coverage for page access, role-based tab visibility, valid and invalid personal data submissions, valid and invalid password updates, and geographic lookup filtering.
- [x] 1.7 Validate the clone with the relevant backend and frontend checks, including `php artisan test` and `npm run build` in `platform/`.
