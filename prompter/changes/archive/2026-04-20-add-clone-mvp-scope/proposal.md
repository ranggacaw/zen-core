# Change: Add clone MVP scope from ERD

## Why
The current Prompter specs describe broad platform capabilities, but the ERD identifies a smaller and safer clone baseline. The project needs an explicit MVP scope proposal so implementation can prioritize the proven core school workflows and defer partially implemented or ambiguous domains.

## What Changes
- Add a new `clone-mvp-scope` capability that defines the Phase 1 clone boundary from the ERD.
- Narrow the existing broad domain specs so they describe the ERD-backed clone target instead of the larger long-term platform vision.
- Define which domain capabilities are required for the clone MVP, which integrations are supporting dependencies, and which modules are explicitly deferred.
- Define an implementation sequence that follows the ERD clone recommendation so the platform can be delivered in stable increments.

## Impact
- Affected specs: `clone-mvp-scope` (new), `platform-services`, `workforce-access`, `student-lifecycle`, `academic-operations`, `daily-operations`, `communication-engagement`, `business-resources`, `operational-reporting`
- Informs future implementation across the clone baseline: authentication, RBAC, people records, classes, schedules, report cards, attendance, announcements, documents, room booking, and print/export workflows
- Deferred from MVP: finance, broad `operational-reporting`, partial inventory and asset management, event, chat, academy, blog, ebook, extracurricular, discipline-tracking, and staff-attendance expansion beyond the student-attendance baseline; retain only the minimal room-booking and facility-availability workflows needed for the clone
