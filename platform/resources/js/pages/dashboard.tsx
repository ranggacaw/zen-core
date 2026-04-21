import { PageHeader } from '@/components/platform/page-header';
import { StatCard } from '@/components/platform/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface DashboardProps {
    query: string;
    roleSummary: {
        title: string;
        description: string;
    };
    metrics: {
        pendingApplicants: number;
        activeStudents: number;
        staffMembers: number;
        activeRoomBookings: number;
        publishedAnnouncements: number;
        assignedClasses: number;
        incompleteIndicators: number;
        checkedInToday: number;
    };
    recentAttendance: Array<{ student: string; student_number: string; class: string; status: string; time: string }>;
    classReadiness: Array<{ name: string; academic_year: string; incomplete_indicators: number }>;
    announcements: Array<{ title: string; status: string; published_at: string | null; audiences: string[] }>;
    guardianWorkspace: {
        name: string;
        relationship: string;
        phone: string | null;
        email: string | null;
        students: Array<{ name: string; student_number: string; class: string | null; status: string }>;
        applicants: Array<{ name: string; student_number: string | null; class: string | null; status: string; decision_notes: string | null }>;
    } | null;
    searchResults: Record<string, Array<Record<string, string>>>;
}

export default function Dashboard({ query, roleSummary, metrics, recentAttendance, classReadiness, announcements, guardianWorkspace, searchResults }: DashboardProps) {
    const searchForm = useForm({ q: query });
    const role = usePage<SharedData>().props.auth.user?.role;

    const quickActions = role === 'teacher'
        ? [
              { label: 'Open classes', href: '/classes' },
              { label: 'Record attendance', href: '/attendance' },
              { label: 'Open reports', href: '/reports' },
          ]
        : role === 'registered_user'
          ? [{ label: 'Manage profile', href: '/settings/profile' }]
          : [
                { label: 'Review admissions', href: '/peserta-ppdb' },
                { label: 'Manage students', href: '/peserta-murid' },
                { label: 'Draft announcements', href: '/communications' },
            ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={roleSummary.title}
                    description={roleSummary.description}
                    actions={role === 'registered_user' ? undefined :
                        <form
                            className="flex w-full items-center gap-2 md:w-auto"
                            onSubmit={(event) => {
                                event.preventDefault();
                                searchForm.get(route('dashboard'));
                            }}
                        >
                            <Input
                                value={searchForm.data.q}
                                onChange={(event) => searchForm.setData('q', event.target.value)}
                                placeholder="Search students, staff, classes..."
                                className="min-w-64"
                            />
                            <Button type="submit">Search</Button>
                        </form>
                    }
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {role === 'teacher' ? (
                        <>
                            <StatCard label="Assigned classes" value={metrics.assignedClasses} helper="Class workspaces linked to you" />
                            <StatCard label="Incomplete indicators" value={metrics.incompleteIndicators} helper="Indicators still needing completion" />
                            <StatCard label="Active students" value={metrics.activeStudents} helper="Current student records" />
                            <StatCard label="Published announcements" value={metrics.publishedAnnouncements} helper="Visible communication items" />
                            <StatCard label="Active room bookings" value={metrics.activeRoomBookings} helper="Scheduled room usage" />
                        </>
                    ) : role === 'registered_user' ? (
                        <>
                            <StatCard label="Linked students" value={metrics.activeStudents} helper="Active student records in your family" />
                            <StatCard label="Pending applicants" value={metrics.pendingApplicants} helper="Admissions still under review" />
                            <StatCard label="Checked in today" value={metrics.checkedInToday} helper="Students scanned in today" />
                            <StatCard label="Assigned classes" value={metrics.assignedClasses} helper="Classes linked to your students" />
                            <StatCard label="Announcements" value={metrics.publishedAnnouncements} helper="Published updates for linked classes" />
                        </>
                    ) : (
                        <>
                            <StatCard label="Pending applicants" value={metrics.pendingApplicants} helper="Admissions needing review" />
                            <StatCard label="Active students" value={metrics.activeStudents} helper="Current student records" />
                            <StatCard label="Staff accounts" value={metrics.staffMembers} helper="Provisioned workforce users" />
                            <StatCard label="Active room bookings" value={metrics.activeRoomBookings} helper="Scheduled room usage" />
                            <StatCard label="Published announcements" value={metrics.publishedAnnouncements} helper="Active communication items" />
                        </>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{role === 'registered_user' ? 'Quick access' : 'Next actions'}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {quickActions.map((action) => (
                            <Button key={action.href} asChild variant="secondary">
                                <Link href={action.href}>{action.label}</Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                {query && role !== 'registered_user' ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Search results for &quot;{query}&quot;</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                            {Object.entries(searchResults).map(([section, rows]) => (
                                <div key={section} className="rounded-xl border border-border/70 p-4">
                                    <h3 className="text-sm font-semibold capitalize">{section}</h3>
                                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        {rows.length ? (
                                            rows.map((row, index) => (
                                                <div key={`${section}-${index}`} className="rounded-md bg-muted/50 p-2">
                                                    {Object.values(row).filter(Boolean).join(' • ')}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No matches</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ) : null}

                {role === 'registered_user' && guardianWorkspace ? (
                    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Family profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">{guardianWorkspace.name}</p>
                                    <p className="text-muted-foreground">{guardianWorkspace.relationship}</p>
                                </div>
                                <p className="text-muted-foreground">Email: {guardianWorkspace.email ?? 'Not provided'}</p>
                                <p className="text-muted-foreground">Phone: {guardianWorkspace.phone ?? 'Not provided'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Linked students</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {guardianWorkspace.students.length ? guardianWorkspace.students.map((student) => (
                                    <div key={student.student_number} className="rounded-xl border border-border/60 p-3">
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.student_number} • {student.class ?? 'Class not assigned'}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Status: {student.status}</p>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No linked students yet.</p>}
                            </CardContent>
                        </Card>
                    </div>
                ) : null}

                {role === 'registered_user' && guardianWorkspace ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Admissions updates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {guardianWorkspace.applicants.length ? guardianWorkspace.applicants.map((applicant) => (
                                <div key={`${applicant.name}-${applicant.student_number ?? 'pending'}`} className="rounded-xl border border-border/60 p-3">
                                    <p className="font-medium">{applicant.name}</p>
                                    <p className="text-sm text-muted-foreground">{applicant.student_number ?? 'Identifier pending'} • {applicant.class ?? 'Placement pending'} • {applicant.status}</p>
                                    {applicant.decision_notes ? <p className="mt-2 text-sm text-muted-foreground">{applicant.decision_notes}</p> : null}
                                </div>
                            )) : <p className="text-sm text-muted-foreground">No admissions records are linked to this guardian yet.</p>}
                        </CardContent>
                    </Card>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>{role === 'registered_user' ? 'Today\'s attendance' : 'Recent attendance activity'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentAttendance.length ? recentAttendance.map((activity, index) => (
                                <div key={`${activity.student}-${index}`} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                                    <div>
                                        <p className="font-medium">{activity.student}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.student_number} • {activity.class}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-medium">{activity.status}</p>
                                        <p className="text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-muted-foreground">No attendance activity is available yet.</p>}
                        </CardContent>
                    </Card>

                    {role !== 'registered_user' ? <Card>
                        <CardHeader>
                            <CardTitle>Class readiness</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {classReadiness.map((item) => (
                                <div key={item.name} className="rounded-xl border border-border/60 p-3">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.academic_year}</p>
                                    <p className="mt-2 text-sm">Incomplete indicators: {item.incomplete_indicators}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card> : null}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{role === 'registered_user' ? 'Class announcements' : 'Published announcements'}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {announcements.length ? announcements.map((announcement) => (
                            <div key={announcement.title} className="rounded-xl border border-border/60 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">{announcement.title}</p>
                                        <p className="text-sm text-muted-foreground">{announcement.published_at ?? 'Draft timing unavailable'}</p>
                                    </div>
                                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{announcement.status}</span>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">{announcement.audiences.join(', ') || 'All authorized users'}</p>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">No published announcements are visible for this workspace yet.</p>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
