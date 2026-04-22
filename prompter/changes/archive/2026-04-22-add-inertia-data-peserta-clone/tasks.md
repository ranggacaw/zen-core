## 1. Foundation
- [x] 1.1 Inventory the target app equivalents for auth, sidebar navigation, flash messaging, route helpers, file uploads, dialog patterns, lookup selects, and permission guards so the cloned `Data Peserta` pages fit the existing Inertia shell.
- [x] 1.2 Add or map the backend resources required by all `Data Peserta` flows: `students`, `guardians`, `applicants`, `users`, role assignments, address reference data, school classes, and the current student-to-class relationships.
- [x] 1.3 Replace the source module's DataTables, Select2, AJAX search, and Bootstrap modal dependencies with target-app Inertia pages, dialogs, and JSON endpoints.

## 2. Data Peserta Module Shell
- [x] 2.1 Add the `Data Peserta` navigation group and wire `Peserta Didik`, `Wali Murid`, and `PPDB` routes in the target Laravel + Inertia application.
- [x] 2.2 Add shared Inertia resources for the clone, including student lookup by name or NIS, address lookup data, class placement options, and source-aligned flash or toast feedback.

## 3. Peserta Didik
- [x] 3.1 Implement the `Peserta Didik` list page with newest-first ordering, visible PPDB status badges, and an entry to open participant detail.
- [x] 3.2 Implement the read-oriented `Peserta Didik` detail page so administrators can review profile, family, and address data while updating only the student's profile picture.
- [x] 3.3 Preserve source-aligned storage behavior for participant profile pictures, including success feedback and return to the same participant context after upload.

## 4. Wali Murid
- [x] 4.1 Implement the `Wali Murid` list page with guardian summary rows, create entry, edit entry, and delete action.
- [x] 4.2 Implement `Wali Murid` create and edit flows with source-aligned validation, optional photo upload, address lookups, religion selection, and multi-student assignment.
- [x] 4.3 Implement linked user account creation or update for guardians, including source-aligned guardian role assignment and guardian-to-student relationship sync inside the current `guardians` and `students` structure.
- [x] 4.4 Implement guardian deletion with appropriate cleanup for linked user, guardian-student relationships, and uploaded assets where present.

## 5. PPDB
- [x] 5.1 Implement the `PPDB` list page with parent and student summary data, pending or rejected status visibility, approve action, reject action, and detail navigation.
- [x] 5.2 Implement the readonly `PPDB` detail page for reviewing admission account, student, guardian, and address data without introducing new edit behavior.
- [x] 5.3 Implement the `PPDB` approve flow so administrators must choose a class, the related student record moves to active student status, the school year remains aligned to the selected class, and the student is attached to that class.
- [x] 5.4 Implement the `PPDB` reject flow so administrators must provide a note, the related applicant or student lifecycle status moves to rejected, and later list views expose the saved rejection note.

## 6. Validation
- [x] 6.1 Add focused backend tests for student lookup, guardian create or update validation, guardian linked-user role assignment, guardian-student sync, and `PPDB` approve or reject transitions.
- [x] 6.2 Add focused frontend or browser-level verification for the `Data Peserta` navigation group plus the `Peserta Didik`, `Wali Murid`, and `PPDB` Inertia pages.
- [x] 6.3 Manually verify the cloned flows work without Blade-era dependencies such as DataTables, Select2, jQuery confirmation dialogs, or Bootstrap modal-only approve or reject screens.

## Post-Implementation
- [x] Confirmed no follow-up updates are required for menu seeding, role seeding, address lookup sources, file-storage configuration, or class-placement dependencies for this change.
