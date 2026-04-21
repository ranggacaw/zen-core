## 1. Foundation
- [x] 1.1 Inventory the target app equivalents for auth, sidebar navigation, flash messaging, route helpers, and Inertia form handling so the cloned `Absensi` pages fit the existing application shell.
- [x] 1.2 Add or map backend resources that preserve the current student-attendance semantics, including an attendance model equivalent to `t_absensi_murid` plus student and class relations needed by the source pages.

## 2. Absensi Module Shell
- [x] 2.1 Add the `Absensi` navigation group and wire child routes for `Absensi Peserta Didik` and `Absensi Peserta Didik List` in the target Laravel app.
- [x] 2.2 Add a shared Inertia page structure for the module that matches target-project patterns while preserving the source module labels and workflow grouping.

## 3. Absensi Peserta Didik
- [x] 3.1 Implement the `Absensi Peserta Didik` page as a scan-first workflow with autofocus and fast resubmission behavior appropriate for repeated RFID or barcode input.
- [x] 3.2 Implement the store action so a submitted scan value resolves the student identity, shows an error when no matching student is found, creates `jam_masuk` for the first attendance on a date, and fills `jam_keluar` for the first open record on that same date.
- [x] 3.3 Preserve source-aligned success and error feedback in the target app's flash or toast mechanism and redirect the user back into the attendance flow after submission.

## 4. Absensi Peserta Didik List
- [x] 4.1 Implement the `Absensi Peserta Didik List` page as a recent-attendance view backed by descending attendance records with the related student and class data loaded.
- [x] 4.2 Render the student attendance fields that the source flow relies on, including student name, student number, class context, and check-in or check-out timestamps.
- [x] 4.3 Keep the list-page scope aligned to the source module's effective behavior and do not introduce new edit, delete, or persistent filter behavior unless the target project already requires it.

## 5. Validation
- [x] 5.1 Add focused backend tests for student lookup failure, first scan check-in creation, second scan check-out update, and attendance list ordering.
- [x] 5.2 Add focused frontend or browser-level verification for the two navigation entries, the scan-first `Absensi Peserta Didik` flow, and the `Absensi Peserta Didik List` page render.
- [x] 5.3 Manually verify the target app can complete repeated scans without depending on Blade-only assets, route names, or SweetAlert-specific helpers from the source project.

## Post-Implementation
- [x] Confirm whether target-project documentation, permission mapping, or menu-configuration follow-up is needed and update it only if required.
