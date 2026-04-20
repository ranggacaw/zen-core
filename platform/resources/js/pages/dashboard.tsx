import { PageHeader } from '@/components/platform/page-header';
import { StatCard } from '@/components/platform/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface DashboardProps {
    query: string;
    metrics: {
        pendingApplicants: number;
        activeStudents: number;
        staffMembers: number;
        pendingBilling: number;
        publishedAnnouncements: number;
    };
    recentAttendance: Array<{ student: string; student_number: string; class: string; status: string; time: string }>;
    classReadiness: Array<{ name: string; academic_year: string; incomplete_indicators: number }>;
    announcements: Array<{ title: string; status: string; published_at: string | null; audiences: string[] }>;
    searchResults: Record<string, Array<Record<string, string>>>;
}

export default function Dashboard({ query, metrics, recentAttendance, classReadiness, announcements, searchResults }: DashboardProps) {
    const searchForm = useForm({ q: query });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Operational dashboard"
                    description="Track admissions, staffing, billing, attendance, and class readiness from one shared workspace."
                    actions={
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
                    <StatCard label="Pending applicants" value={metrics.pendingApplicants} helper="Admissions needing review" />
                    <StatCard label="Active students" value={metrics.activeStudents} helper="Current student records" />
                    <StatCard label="Staff accounts" value={metrics.staffMembers} helper="Provisioned workforce users" />
                    <StatCard label="Pending billing" value={metrics.pendingBilling} helper="Awaiting reconciliation" />
                    <StatCard label="Published announcements" value={metrics.publishedAnnouncements} helper="Active communication items" />
                </div>

                {query ? (
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

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent attendance activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentAttendance.map((activity, index) => (
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
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
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
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Published announcements</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {announcements.map((announcement) => (
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
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
