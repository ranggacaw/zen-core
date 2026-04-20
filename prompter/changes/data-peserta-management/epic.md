## 🧠 Epic: Data Peserta Management Module

### 🎯 Epic Goal
We need to develop a unified Data Peserta (Student Data) Management module in order for school administrators and staff to seamlessly manage student records (Peserta Didik), guardian information (Wali Murid), and new admissions (PPDB) securely and efficiently in the new project.

### 🚀 Definition of Done
- Database schemas for Students (Peserta Didik), Guardians (Wali Murid), and Admissions (PPDB) are designed and implemented.
- CRUD operations for Peserta Didik are fully functional.
- CRUD operations for Wali Murid are implemented, with proper many-to-many or one-to-many linkage to Peserta Didik.
- The PPDB (Penerimaan Peserta Didik Baru) flow is successfully implemented for prospective students.
- Role-based access control (RBAC) is applied to restrict access to these modules based on user roles.
- Automation for promoting accepted PPDB candidates to active Peserta Didik is verified.
- Unit and integration tests for the module are passing.

### 📌 High-Level Scope (Included)
- **Peserta Didik (`/peserta-murid`)**: Management interface for current active students, including personal details, academic tracking, and status.
- **Wali Murid (`/peserta-wali`)**: Management interface for parents/guardians, including contact information and linking to one or more associated students.
- **PPDB (`/peserta-ppdb`)**: Administration portal for managing new student admissions, tracking application statuses, document verification, and acceptance workflows.
- API endpoints supporting these three sub-modules.
- Frontend views and UI components for list, create, edit, and delete operations.

### ❌ Out of Scope
- Financial management or tuition fee tracking (handled in a separate Keuangan module).
- Academic grading, report cards (Raport), or attendance tracking (Absensi).
- Alumni management (unless strictly tied to the core Peserta Didik exit status).

### 📁 Deliverables
- Database migrations and seeders for Peserta, Wali, and PPDB entities.
- Backend API Controllers, Models, and Services for the module.
- Frontend User Interfaces (Lists, Forms, Modals) for the three sub-modules.
- Documentation for the new module APIs and usage.

### 🧩 Dependencies
- Core Authentication and Authorization (RBAC) system must be in place.
- Shared UI layout and component library.
- (TBD) External notification services (Email/SMS) for PPDB status updates.

### ⚠️ Risks / Assumptions
- **Assumption:** The new project uses a similar architecture/framework setup as the reference project.
- **Assumption:** A student must have at least one valid guardian linked to their profile.
- **Risk:** Complex family relationships (e.g., siblings sharing the same guardian profile, divorced parents) may complicate the data model and UI logic.

### 🎯 Success Metrics
- 100% test coverage for critical business logic (e.g., PPDB acceptance workflow).
- Ability to successfully link a single Wali Murid profile to multiple Peserta Didik without data duplication.
- Smooth transition of application data from PPDB to Peserta Didik upon acceptance.