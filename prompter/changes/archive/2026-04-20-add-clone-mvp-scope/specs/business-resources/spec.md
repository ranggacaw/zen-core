## RENAMED Requirements
- FROM: `### Requirement: Billing and Payment Reconciliation`
- TO: `### Requirement: Room Booking Requests and Allocation`
- FROM: `### Requirement: Inventory, Facilities, and Events Management`
- TO: `### Requirement: Facility Availability Visibility`

## MODIFIED Requirements
### Requirement: Room Booking Requests and Allocation
The system SHALL manage room booking requests for supported school operations by linking a requester, room, purpose, and scheduled usage window.

#### Scenario: Record a successful room booking request
- **WHEN** an authorized staff member or student books a room for a supported operational need
- **THEN** the system stores the booking details, requester identity, and room reference for that time window

### Requirement: Facility Availability Visibility
The system SHALL show room usage history and scheduled allocations so authorized users can review facility availability within the clone MVP.

#### Scenario: Review room usage for a facility
- **WHEN** an authorized user opens a room or facility record
- **THEN** the system shows the related booking history and scheduled usage associated with that room
