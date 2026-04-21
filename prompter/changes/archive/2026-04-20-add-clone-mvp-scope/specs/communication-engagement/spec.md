## MODIFIED Requirements
### Requirement: Governed School Announcements
The system SHALL require approval before targeted school announcements, including optional document attachments, are published to users or classes.

#### Scenario: Publish an approved announcement
- **WHEN** an admin submits an announcement and an authorized approver accepts it
- **THEN** the system marks the announcement as approved and allows it to be published to the selected audience

#### Scenario: Attach a supporting document to an announcement
- **WHEN** an authorized user uploads a document to a school announcement
- **THEN** the system stores the document and links it to the announcement record

### Requirement: Announcement Audience Targeting
The system SHALL support announcement targeting by class or other authorized recipient groups.

#### Scenario: Target an announcement to selected classes
- **WHEN** an authorized user chooses one or more classes as the audience for an approved announcement
- **THEN** the system delivers or exposes the announcement only to the selected audience scope
