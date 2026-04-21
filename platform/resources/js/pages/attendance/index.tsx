import InputError from '@/components/input-error';
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
    { title: 'Attendance', href: '/attendance' },
];

interface AttendanceProps {
    todayLabel: string;
    scopeLabel: string;
    summary: { checked_in: number; checked_out: number; open_records: number };
    records: Array<{
        id: number;
        student: string | null;
        student_number: string | null;
        class: string | null;
        attendance_date: string | null;
        status: string;
        check_in_at: string | null;
        check_out_at: string | null;
        scan_count: number;
        needs_checkout: boolean;
    }>;
}

export default function AttendanceIndex({ todayLabel, scopeLabel, summary, records }: AttendanceProps) {
    const form = useForm({ identifier: '' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Attendance operations"
                    description={`Use first scan for check-in and second scan for check-out while operators monitor recent activity. ${scopeLabel}`}
                />

                <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Scan control point</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">Today: {todayLabel}</p>
                            <p className="mt-1">Scan once to check in. Scan the same student again later to check out.</p>
                        </div>
                        <form
                            className="flex flex-col gap-3 md:flex-row"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.post(route('attendance.scan'), { onSuccess: () => form.reset() });
                            }}
                        >
                            <Input
                                value={form.data.identifier}
                                onChange={(event) => form.setData('identifier', event.target.value)}
                                placeholder="Scan student number"
                                autoFocus
                            />
                            <Button type="submit">Record scan</Button>
                        </form>
                        <InputError message={form.errors.identifier} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance guidance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Use the student number from the active student record.</p>
                        <p>Open records mean the student has checked in but not checked out yet.</p>
                        <p>Teachers only see attendance activity for their assigned classes.</p>
                    </CardContent>
                </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Checked in" value={summary.checked_in} />
                    <StatCard label="Checked out" value={summary.checked_out} />
                    <StatCard label="Open records" value={summary.open_records} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent attendance feed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {records.length ? (
                            records.map((record) => (
                                <div key={record.id} className="rounded-xl border border-border/70 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-semibold">{record.student}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {record.student_number} • {record.class} • {record.attendance_date}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-1 text-sm md:items-end">
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">
                                                {record.status}
                                            </span>
                                            <span className="text-muted-foreground">
                                                In {record.check_in_at ?? '--'} / Out {record.check_out_at ?? '--'}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {record.scan_count} scan{record.scan_count === 1 ? '' : 's'}
                                            </span>
                                            {record.needs_checkout ? <span className="text-amber-600">Needs checkout</span> : null}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No attendance activity is visible for this workspace yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
