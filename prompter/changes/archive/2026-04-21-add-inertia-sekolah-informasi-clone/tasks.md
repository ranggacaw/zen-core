## 1. Foundation
- [x] 1.1 Inventory the target app equivalents for auth, sidebar navigation, flash messaging, route helpers, rich-text inputs, and file upload handling so the cloned `Sekolah > Informasi` pages fit the existing Inertia shell.
- [x] 1.2 Add or map backend resources that preserve the source data semantics for `t_informasi_sekolah`, `t_informasi_has_kelas`, `t_document`, and active class lookup data equivalent to `Kelas::tahunSekarang()`.

## 2. Sekolah Module Shell
- [x] 2.1 Add the `Sekolah` navigation group and wire an `Informasi` route entry in the target Laravel + Inertia application.
- [x] 2.2 Add a shared Inertia page structure for `Informasi` that matches target-project conventions while preserving the source labels and workflow grouping.

## 3. Informasi Management
- [x] 3.1 Implement the `Informasi` list page with newest-first ordering, content excerpt rendering, publish date, approval status, created timestamp, and row actions.
- [x] 3.2 Implement create and edit flows with source-aligned fields for date, type, class targets, title, content, cover image, and supporting document attachment.
- [x] 3.3 Implement create and update persistence so information records store or update their related class targets and optional media or document assets with target-project validation and feedback.
- [x] 3.4 Implement delete behavior so information records clean up related class links and uploaded assets without depending on Blade-only JavaScript helpers.

## 4. Approval
- [x] 4.1 Implement the approval action so authorized users equivalent to `Kepala Sekolah` or `superadmin` can mark an information item as approved from the list flow.
- [x] 4.2 Preserve source-aligned success and error feedback for approval and management actions in the target app's flash or toast mechanism.

## 5. Validation
- [x] 5.1 Add focused backend tests for list ordering, create validation, class-target sync, delete cleanup, and approval status updates.
- [x] 5.2 Add focused frontend or browser-level verification for the `Sekolah > Informasi` navigation entry, the list page, the create or edit form, and the approval action.
- [x] 5.3 Manually verify the cloned flow works without Blade-era dependencies such as Select2, Summernote, SweetAlert, or source-project route names.

## Post-Implementation
- [x] Confirm whether the target project needs follow-up updates for permission mapping, menu seed data, or upload storage configuration and capture them only if required.
