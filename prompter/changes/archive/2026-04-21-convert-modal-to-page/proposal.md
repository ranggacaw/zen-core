# Change: Convert Create/Edit Modals to Dedicated Pages

## Why
The current implementation uses modal dialogs for create and edit operations. This causes UX issues:
- Maximum update depth exceeded (infinite loop) due to form state management complexity
- Poor mobile experience with cramped dialogs
- Limited screen real estate for complex forms

## What Changes
- Convert student create modal to `/students/create` page
- Convert student edit modal to `/students/:id/edit` page
- Convert guardian create modal to `/guardians/create` page
- Convert guardian edit modal to `/guardians/:id/edit` page
- Remove dialog components from index pages
- Add route entries for new pages
- Preserve existing functionality with better UX

## Impact
- Affected pages: students, guardians
- Affected components: student-form-dialog, guardian-form-dialog
- Routes to update: students, guardians