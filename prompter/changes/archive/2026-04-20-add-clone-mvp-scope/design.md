## Context
The current specification set is intentionally broad and spans platform, academic, operational, communication, finance, inventory, and reporting concerns. The ERD is narrower and includes an explicit "Clone Recommendation" section that identifies the minimum safe baseline for reproducing the implemented school system without taking on partially implemented or drift-heavy domains.

The ERD also calls out important ambiguities:
- Several academic tables are code-driven and not fully defined in the SQL dump.
- Inventory, Akademi, Chat, Event, Keuangan, and Transaksi are only partially implemented.
- Geographic master tables are external dependencies.

## Goals / Non-Goals
- Goals:
- Define a Phase 1 clone scope that is grounded in the ERD instead of the full long-term platform vision.
- Preserve the entity and workflow dependencies needed to make the clone usable end-to-end.
- Make exclusions explicit so implementation does not accidentally expand into partial modules.

- Non-Goals:
- Redesign the underlying domain model.
- Specify every screen or API in implementation detail.
- Commit the project to Phase 2 features such as billing, inventory, events, blogs, ebooks, extracurriculars, or broad analytics.

## Decisions
- Decision: Treat the ERD "Clone Recommendation" as the authoritative Phase 1 boundary.
  - Why: It already groups the minimum domain entities needed for a functioning school clone and is more reliable than the drifted SQL dump alone.

- Decision: Represent MVP scope as a dedicated capability and narrow only the affected domain specs that would otherwise overstate Phase 1 scope.
  - Why: The project still gets a single implementation gate for what is and is not included in the clone baseline, while removing billing, inventory, and broad-analytics expectations from the affected specs.

- Decision: Keep supporting dependencies inside scope only when they unblock core workflows.
  - Why: Examples include user authentication, RBAC, menus, document storage, and Indonesian administrative references. Shared services such as analytics, realtime, and broad search are not MVP requirements unless a scoped workflow directly depends on them.

## Risks / Trade-offs
- Existing broad specs may still imply post-MVP breadth.
  - Mitigation: This proposal establishes the release gate for Phase 1 and postpones spec narrowing until implementation or archive time.

- Some academic entities are marked ambiguous in the ERD.
  - Mitigation: Keep the MVP requirement focused on the proven class, indicator, schedule, and report-card workflows already evidenced by code references in the ERD.

- External geographic references can block admissions and profile forms.
  - Mitigation: Treat geographic reference data as a required dependency for student, guardian, and staff address capture, not as a separate product domain.

## Migration Plan
1. Approve this scope proposal.
2. Use the sequence in `tasks.md` to implement the clone baseline in slices.
3. After implementation, reconcile the broad existing specs with actual shipped MVP behavior.

## Open Questions
- None for proposal drafting. The ERD provides enough detail to define a safe clone baseline and explicit exclusions.
