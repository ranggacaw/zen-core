## RENAMED Requirements
- FROM: `### Requirement: Consolidated Operational Dashboards`
- TO: `### Requirement: Scoped Operational Summaries`

## MODIFIED Requirements
### Requirement: Scoped Operational Summaries
The system SHALL provide workflow-level summaries for the supported clone-MVP domains rather than broad cross-domain dashboards.

#### Scenario: Review a scoped operational summary
- **WHEN** an authorized user opens a supported admissions, class, attendance, announcement, or room-booking workflow
- **THEN** the system shows the current summary information needed to operate that workflow without requiring a cross-domain executive dashboard

### Requirement: Exportable Tables and Printable Documents
The system SHALL support exportable tables and printable documents only for supported clone-MVP operational and academic workflows.

#### Scenario: Export or print workflow outputs
- **WHEN** an authorized user requests an export or print action from a supported admissions, class, attendance, announcement, or academic reporting workflow
- **THEN** the system generates the requested file or print-ready view for that supported data set or academic document
