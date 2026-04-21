## RENAMED Requirements
- FROM: `### Requirement: Shared Search, Storage, and Async Services`
- TO: `### Requirement: Core Storage and Reference Services`

## MODIFIED Requirements
### Requirement: Authenticated Role-Aware Platform Access
The system SHALL provide standard login, role-based access control, and role-aware internal navigation for admins, teachers, and registered users participating in the clone MVP, with access tied to linked staff, student, or guardian records where applicable.

#### Scenario: Sign in and enter a role-aware workspace
- **WHEN** a valid clone-MVP user signs in to the platform
- **THEN** the system authenticates the user and loads only the internal navigation and features that user is authorized to access within the clone MVP scope

#### Scenario: Hide deferred modules from clone users
- **WHEN** a signed-in user does not have access to a supported clone-MVP workflow or the feature belongs to a deferred domain
- **THEN** the system does not expose the related navigation item or action in the internal workspace

### Requirement: Core Storage and Reference Services
The system SHALL provide only the shared services required by the clone MVP, including file storage for supported document attachments and Indonesian administrative reference data for staff, student, and guardian address capture.

#### Scenario: Store a supported document attachment
- **WHEN** a clone-MVP workflow uploads a document for a supported record such as a school announcement
- **THEN** the system stores the file through the configured upload service and links it to the originating record

#### Scenario: Select an Indonesian administrative address
- **WHEN** an authorized user captures or updates an address for a staff, student, or guardian record
- **THEN** the system provides province, regency, district, and village reference data for the address workflow
