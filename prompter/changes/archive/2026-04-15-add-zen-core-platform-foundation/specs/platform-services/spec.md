## ADDED Requirements
### Requirement: Authenticated Role-Aware Platform Access
The system SHALL provide standard login, role-based access control, and role-aware internal navigation for admins, teachers, and registered users.

#### Scenario: Sign in and enter a role-aware workspace
- **WHEN** a valid user signs in to the platform
- **THEN** the system authenticates the user and loads the internal navigation and features according to that user's authorized role and permissions

### Requirement: Shared Search, Storage, and Async Services
The system SHALL provide shared platform services for caching, queues, realtime updates, full-text search, uploads, analytics, and external integrations across supported modules.

#### Scenario: Use shared services from a supported module workflow
- **WHEN** a module triggers a supported search, upload, analytics, realtime, or background-processing workflow
- **THEN** the system routes the request through the configured shared platform services and records the outcome for the module workflow
