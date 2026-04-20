# Zendekia-Core
## Executive Summary

**A modular school operations platform that unifies admissions, classrooms, attendance, communications, and report cards in one role-driven system.**

---

## At a Glance

|                   |                                                                                  |
| ----------------- | -------------------------------------------------------------------------------- |
| **Product Type**  | Modular school operations platform / SIS-lite with ERP expansion paths           |
| **Target Market** | [ASSUMPTION] Indonesian K-12 schools, especially private schools and operators   |
| **Platform**      | Web application with responsive navigation and authenticated API endpoints        |
| **Technology**    | Laravel 12, Inertia.js, React, Tailwind CSS, PostgreSQL, Redis, Meilisearch, S3-compatible storage, Reverb, PostHog, Midtrans |
| **Status**        | MVP capability set defined in `prompter/specs`; delivery aligned to the approved Laravel 12 platform baseline |

**Commercial Model:** [ASSUMPTION] Institution-level deployment, configuration, and support rather than self-serve pricing.

## Product Overview

### What is Zendekia-Core?
Zendekia-Core is a modular school management application built to centralize the daily operating system of a school. It combines student and guardian records, staff management, class operations, attendance, school communications, and academic reporting into a single platform.

The current MVP direction centers on student lifecycle, workforce access, academic operations, daily operations, communication and engagement, business and resource operations, operational reporting, and shared platform services. Finance, inventory, events, content, and related ERP-style workflows remain part of the product scope, but are now represented as capability areas in the Prompter specs rather than legacy module names.

### The Problem We Solve

| Challenge | Impact |
| --------- | ------ |
| Student, guardian, and staff records live across disconnected files and forms | Duplicate data, inconsistent updates, and weak operational visibility |
| Admissions and class placement require manual coordination | Delays in onboarding new students and avoidable placement errors |
| Classroom operations are fragmented across schedules, tasks, and teacher assignments | Teachers and operators lose time coordinating routine academic work |
| Attendance is captured manually or in isolated tools | Slow check-in, limited traceability, and weak daily oversight |
| Report cards and assessment workflows are spreadsheet-heavy | High administrative effort, inconsistent scoring flow, and printing friction |
| Access control is informal or broad-based | Sensitive data is exposed too widely and responsibilities are unclear |

### Our Solution

```text
Applicants / Students / Staff
            |
            v
+-------------------------+
| Master Records Layer    |
| students, guardians,    |
| staff, users, roles     |
+-------------------------+
            |
            v
+-------------------------+      +-------------------------+
| Class Operations Layer  | ---> | Academic Outcomes Layer |
| classes, teachers,      |      | indicators, KI scores,  |
| schedules, tasks, RKH   |      | PTS/PAS/raport prints   |
+-------------------------+      +-------------------------+
            |
            v
+-------------------------+      +-------------------------+
| Daily Operations Layer  | ---> | Communication Layer     |
| attendance, room usage  |      | school info, approvals, |
| and operational views   |      | class targeting         |
+-------------------------+      +-------------------------+
            |
            v
+-----------------------------------------------------------+
| Admin Platform Layer: menus, permissions, API auth, files |
+-----------------------------------------------------------+
```

## Core Capabilities

### 1️⃣ Student Lifecycle and Admissions
- Maintain student master records including biodata, status, identifiers, address, and enrollment lifecycle.
- Link guardians to students and preserve parent-level contact and household context.
- Manage PPDB admissions review with approval and rejection actions.
- Promote approved applicants into active students and attach them directly to a class.
- Standardize address capture through province, regency, district, and village reference APIs.

### 2️⃣ Workforce, Identity, and Access Governance
- Manage teaching and non-teaching staff in separate operational flows.
- Capture staff biodata, education, position, contact, banking, and employment information.
- Auto-create linked user accounts for staff and assign roles during onboarding.
- Apply role- and permission-based access using a centralized RBAC layer.
- Drive navigation from database-managed menus rather than hard-coded sidebars alone.

### 3️⃣ Class and Academic Operations
- Create classes by grade level, room, homeroom teacher, and academic year.
- Open a class workspace with detail, students, teachers, schedule, RKH, tasks, indicators, and report-card tabs.
- Assign subject teachers to classes and map them to learning indicators.
- Manage schedules by day, time, teacher, and subject per semester.
- Track rooms, learning spaces, school facilities, and facility usage as part of the broader data model.

### 4️⃣ Attendance and Daily School Execution
- Record student attendance through RFID/NIS-style scan input.
- Use a simple daily toggle model for check-in on first scan and check-out on second scan.
- Surface recent attendance activity in card-based operational views.
- Support a daily attendance control point that can be used by school operators at entry points.
- Provide a foundation for realtime broadcasting, although current live use appears limited.

### 5️⃣ Assessment, Report Cards, and Academic Outputs
- Manage indicator-based assessment flows across KI-1, KI-2, KI-3, and KI-4 structures.
- Differentiate homeroom teacher responsibilities from subject teacher score entry.
- Route users into score-entry screens based on class, semester, indicator, and role context.
- Support printable outputs for PTS, PAS, report cards, and Kurikulum Merdeka variants.
- Flag incomplete indicator setup before downstream report workflows proceed.

### 6️⃣ Communication, Administration, and Expansion Paths
- Publish school information with title, date, type, content, cover image, document, and target classes.
- Require approval for announcements by principal-level or superadmin roles.
- Offer API authentication endpoints for register, login, logout, refresh, and profile lookup.
- Maintain admin views for roles, permissions, user filtering, exports, and profile management.
- Preserve clear expansion paths into finance, inventory, events, transactions, academy content, articles, chat, and extracurricular operations.

## Key Benefits

| Benefit | Description |
| ------- | ----------- |
| ⏱️ Faster Operations | Reduces the number of disconnected tools school staff need for onboarding, class setup, attendance, and reporting. |
| ✅ Role Clarity | Separates what superadmins, operators, principals, homeroom teachers, and subject teachers can do. |
| 📊 Better Visibility | Makes attendance activity, user-role distribution, operational tables, and academic outputs easier to review and export. |
| 🔐 Stronger Governance | Uses formal authentication, RBAC, and approval steps for sensitive operational workflows. |
| 📁 Centralized Records | Keeps students, guardians, staff, classes, schedules, and academic indicators in one system of record. |
| 🔄 Expansion Ready | The modular architecture supports future rollout of finance, inventory, events, and other school ERP domains. |

## User Roles Supported

| Role | Primary Functions |
| ---- | ----------------- |
| Superadmin | Full platform configuration, user and role administration, cross-module oversight |
| School Operator / Admin | Daily data entry, admissions handling, class setup, attendance administration, and operational support |
| Principal / Kepala Sekolah | Approval of school announcements and executive academic oversight |
| Homeroom Teacher / Wali Kelas | Owns class detail, teacher coordination, schedule oversight, indicator completeness, and broad report-card responsibility |
| Subject Teacher / Guru Bidang Studi | Enters subject-linked assessment data and supports class-level academic execution |
| Non-Teaching Staff | Maintains employee records and participates in non-academic operations with controlled access |
| Guardian / Wali Murid | [ASSUMPTION] Receives an account-linked profile and child relationship; current self-service surface appears limited |
| Student / Murid | [ASSUMPTION] Exists as a user-linked academic and attendance entity; direct self-service UI appears limited |

## System Architecture / Modules

```text
+----------------------------------------------------------------------------------+
|                                Zendekia-Core                                     |
+----------------------------------------------------------------------------------+
| Student Lifecycle    | Workforce Access    | Academic Ops   | Daily Operations   |
| applicants, students,| staff, teachers,    | classes,       | scan attendance,   |
| guardians, admissions| users, roles        | schedules,     | monitoring, alerts |
|                      |                     | assessments     |                    |
+----------------------------------------------------------------------------------+
| Communication &      | Business & Resource | Operational     | Platform Services  |
| Engagement           | Operations          | Reporting       | search, uploads,   |
| announcements,       | billing, inventory, | dashboards,     | queues, analytics, |
| events, content      | facilities          | exports, prints | realtime           |
+----------------------------------------------------------------------------------+
| Cross-cutting MVP Baseline                                                       |
| PostgreSQL, Redis, Meilisearch, S3-compatible storage, Reverb, PostHog,         |
| Midtrans, responsive role-aware internal UX                                      |
+----------------------------------------------------------------------------------+
```

**Capability Summary:** The current MVP scope is organized into eight capability specs: `student-lifecycle`, `workforce-access`, `academic-operations`, `daily-operations`, `communication-engagement`, `business-resources`, `operational-reporting`, and `platform-services`.

**Operational Reality:** The current source of truth is the Prompter spec set and repository guidance for the Laravel 12 MVP platform. Student lifecycle, workforce access, and academic operations remain the center of gravity, with reporting and platform services spanning all domains.

## Infrastructure Highlights

- **Modular Monolith:** The approved MVP platform direction uses Laravel 12 in a modular monolith structure so school domains stay separate without introducing service sprawl.
- **Role-Aware Internal UX:** Inertia.js with React and Tailwind CSS provides responsive operator and teacher-facing screens while keeping Laravel as the application backbone.
- **Data and Search Baseline:** PostgreSQL is the primary relational store, Redis supports caching and background work, and Meilisearch powers full-text operational search.
- **Storage and Delivery Services:** S3-compatible object storage handles managed uploads and document media across supported workflows.
- **Realtime and Async Operations:** Reverb and queued processing provide the foundation for live attendance refreshes, approvals, and other operational notifications.
- **Analytics and Payments:** PostHog captures workflow analytics and Midtrans supports billing and payment reconciliation flows.
- **Governance:** Role-based access, approval boundaries, and audit-friendly operational flows remain core platform expectations across modules.

## Domain-Specific Features

### ✅ Admissions and Enrollment Workflow
- Purpose: Move applicants from intake to class placement without losing the relationship between guardian, student, and class.
- Workflow: `Guardian record -> student/applicant record -> PPDB review -> approve/reject -> class assignment`
- Outcome: Admissions becomes a managed operational workflow rather than a one-time spreadsheet handoff.

### ✅ Classroom Operations Workflow
- Purpose: Give each class a dedicated operating space for staffing, schedules, tasks, and daily academic execution.
- Workflow: `Create class -> assign homeroom teacher -> map subject teachers -> configure schedule -> manage RKH -> publish tasks`
- Outcome: Homeroom and subject teachers work from the same class context instead of disconnected files.

### ✅ Assessment and Reporting Workflow
- Purpose: Structure score entry around indicators and teacher responsibility, then convert that work into printable outputs.
- Workflow: `Set indicators -> assign teacher ownership -> enter KI scores -> validate completeness -> print PTS/PAS/Raport`
- Outcome: Academic reporting becomes traceable, role-specific, and easier to standardize across semesters.

### ✅ Attendance and Communication Workflow
- Purpose: Combine fast daily attendance capture with school-wide communication controls.
- Workflow: `RFID/NIS scan -> check-in/check-out record -> recent attendance feed -> announcement draft -> principal approval -> publish by class`
- Outcome: Daily operations become more responsive while communication remains governed.

## Dashboard / Analytics

| Widget | Purpose |
| ------ | ------- |
| Daily Attendance Summary | Shows daily attendance totals, late students, and missing attendance counts on the attendance screen |
| Recent Attendance Feed | Displays the latest scanned students with class and check-in/check-out status |
| Role and User Distribution | Shows user counts by role and visible user membership per role card |
| Exportable Operational Tables | Supports Excel, PDF, and copy exports across selected admin views |
| Class Readiness Signals | Warns homeroom teachers when required indicators are incomplete before report workflows |
| Printable Academic Outputs | Provides report-card and exam-period print views for formal school documentation |

**Executive Note:** The current MVP direction explicitly calls for consolidated dashboards across enrollment, attendance, staffing, billing, and academic readiness instead of leaving reporting isolated inside module-specific screens.

## Competitive Advantages

| Feature | Zendekia-Core | Traditional Methods |
| ------- | ------------- | ------------------- |
| Student, guardian, and staff master data | ✅ Unified record structure across school entities | ❌ Usually split across paper files, spreadsheets, or separate tools |
| Role-based operations | ✅ Structured permissions and role ownership | ❌ Access often depends on shared accounts or informal process control |
| Class-centric workspace | ✅ One class view for students, teachers, schedules, tasks, indicators, and reports | ❌ Teachers coordinate from separate sheets, chats, and printed lists |
| Attendance capture | ✅ Fast scan-based workflow with recent activity visibility | ❌ Manual roll calls or isolated attendance logs |
| Academic reporting | ✅ Indicator-driven KI workflows with print-ready outputs | ❌ Repetitive spreadsheet assembly and high formatting effort |
| Modular expansion | ✅ Core platform already includes hooks for future ERP domains | ❌ New school functions often require separate standalone systems |

## Roadmap Considerations

### Current State
- The MVP is currently defined as a spec-driven capability set rather than as a legacy module inventory.
- Student lifecycle, workforce access, and academic operations remain the product center of gravity for day-to-day school execution.
- The daily operations scope includes scan-based attendance capture and realtime visibility as baseline behavior.
- Communication, business resources, reporting, and platform services are part of the approved MVP scope rather than peripheral expansion ideas.
- The platform baseline now assumes modern shared services for search, analytics, payments, uploads, and realtime updates.

### Potential Enhancements

| Priority | Enhancement |
| -------- | ----------- |
| High | Extend consolidated dashboards with trend analysis, drill-downs, and benchmark views for school leaders |
| High | Strengthen parent and student self-service surfaces so existing user types become active product personas |
| High | Expand billing and payment tracking into broader finance operations beyond the MVP reconciliation baseline |
| Medium | Finish inventory and facility operations for assets, stock, requests, and usage history |
| Medium | Deepen events, extracurricular activities, and content publishing into richer engagement workflows |
| Medium | Extend realtime notifications beyond attendance and approvals into broader operational alerting |
| Medium | Add more external integrations for finance, messaging, and school ecosystem interoperability |
| Low | Introduce richer analytics, trend lines, and benchmarks for principals and school owners |

## Technical Foundation

| Component | Choice | Why |
| --------- | ------ | --- |
| Backend Framework | Laravel 12 | Approved MVP backend foundation for the modular school operations platform |
| Language Runtime | PHP 8.4 [ASSUMPTION] | Expected modern runtime baseline for a Laravel 12 delivery |
| UI Layer | Inertia.js + React + Tailwind CSS | Supports responsive, role-aware internal workflows with a modern frontend architecture |
| Asset Pipeline | Vite | Modern front-end build and refresh workflow |
| Application Architecture | Modular monolith organized around MVP capability boundaries | Keeps product domains separated while preserving operational simplicity |
| Authentication | Laravel session-based auth with role-aware internal access flows | Matches the primary operator and teacher use cases for the MVP |
| Authorization | Centralized RBAC and approval policies | Enables formal roles, permissions, and sensitive workflow control |
| Data Storage | PostgreSQL | Fits the highly relational operational data model across students, staff, classes, billing, and reports |
| Cache / Queue | Redis | Supports caching, queued jobs, and responsive background processing |
| Search | Meilisearch | Enables fast full-text search across operational records |
| File Storage | S3-compatible object storage | Provides a consistent storage layer for uploads and generated documents |
| Realtime Layer | Reverb | Supports live attendance refreshes and other internal operational updates |
| Analytics | PostHog | Captures workflow usage data for product and operational insight |
| Payments | Midtrans | Supports the approved billing and payment reconciliation baseline |

## Getting Started

### For New Implementations
1. Define the school structure, academic year, class levels, and room setup.
2. Configure master users, roles, permissions, and menu visibility rules.
3. Import or create teaching staff, non-teaching staff, and their system accounts.
4. Load guardian and student records, including admissions-stage applicants.
5. Create classes, assign homeroom teachers, and attach students.
6. Configure subject-teacher mappings, schedules, RKH, tasks, and indicators.
7. Launch attendance capture at school entry points.
8. Start school announcements, academic scoring, and print-ready reporting cycles.

### For Existing Users
- Review role assignments and user access at the start of every term.
- Keep class ownership, subject assignments, and indicator setup current before report entry begins.
- Use attendance views as the daily control tower for check-in and check-out monitoring.
- Route formal communications through the announcement approval workflow.
- Export and print operational data for school meetings, compliance, and parent communication.
- Prioritize the next capability increment based on the school's biggest operational bottleneck.

## Summary

Zendekia-Core transforms school operations by:

1. Turning fragmented records into a single, role-aware operating system for the school.
2. Connecting admissions, staffing, classes, attendance, communications, and reporting in one workflow chain.
3. Giving homeroom teachers, subject teachers, operators, and principals clearer accountability.
4. Reducing dependence on spreadsheets, paper routing, and disconnected point solutions.
5. Providing a modular foundation that can expand into a broader school ERP over time.

## Document Information

| Item | Detail |
| ---- | ------ |
| **Version** | 1.1 |
| **Date** | 2026-04-15 |
| **Classification** | Internal / Executive Review |
| **Full Specification Reference** | Prompter capability specs under `prompter/specs/`, including `student-lifecycle`, `workforce-access`, `academic-operations`, `daily-operations`, `communication-engagement`, `business-resources`, `operational-reporting`, and `platform-services` |

**Assumption Notes:** Target market and commercial model remain inferred. Platform direction is based on repository guidance and the formal Prompter spec set rather than the older Laravel 10 repository summary this brief previously reflected.
