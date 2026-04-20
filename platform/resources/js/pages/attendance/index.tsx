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
    summary: { checked_in: number; checked_out: number; open_records: number };
    records: Array<{
        id: number;
        student: string | null;
        student_number: string | null;
        class: string | null;
        status: string;
        check_in_at: string | null;
        check_out_at: string | null;
    }>;
}

export default function AttendanceIndex({ summary, records }: AttendanceProps) {
    const form = useForm({ identifier: '' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Attendance operations" description="Use first scan for check-in and second scan for check-out while operators monitor recent activity." />

                <Card>
                    <CardHeader>
                        <CardTitle>Scan control point</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                            />
                            <Button type="submit">Record scan</Button>
                        </form>
                    </CardContent>
                </Card>

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
                        {records.map((record) => (
                            <div key={record.id} className="rounded-xl border border-border/70 p-4">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold">{record.student}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {record.student_number} • {record.class}
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {record.status} • {record.check_in_at ?? '--'} / {record.check_out_at ?? '--'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
