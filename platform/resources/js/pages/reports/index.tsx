import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/reports' },
];

interface ReportsProps {
    classes: Array<{
        id: number;
        name: string;
        academic_year: string;
        students_count: number;
        indicators_count: number;
        slot_total: number;
        slot_filled: number;
        completion_percentage: number;
        homeroom_teacher: string | null;
    }>;
    exports: { students: string; attendance: string };
}

export default function ReportsIndex({ classes, exports }: ReportsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Operational reporting" description="Export operational tables and generate report-card outputs from the clone academic foundation." />

                <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Exports</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button asChild className="w-full justify-start">
                                <Link href={exports.students}>Download students CSV</Link>
                            </Button>
                            <Button asChild variant="secondary" className="w-full justify-start">
                                <Link href={exports.attendance}>Download attendance CSV</Link>
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Use student exports for roster checks and attendance exports for daily scan reconciliation.
                            </p>
                        </CardContent>
                    </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Class report cards</CardTitle>
                            </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2">
                            {classes.map((schoolClass) => (
                                <div key={schoolClass.id} className="rounded-xl border border-border/70 p-4">
                                    <p className="font-semibold">{schoolClass.name}</p>
                                    <p className="text-sm text-muted-foreground">{schoolClass.academic_year}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {schoolClass.students_count} students • {schoolClass.indicators_count} indicators
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Homeroom: {schoolClass.homeroom_teacher ?? 'Not assigned'}
                                    </p>
                                    <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">
                                        <p className="font-medium">Score coverage</p>
                                        <p className="text-muted-foreground">
                                            {schoolClass.slot_filled} / {schoolClass.slot_total} slots filled • {schoolClass.completion_percentage}% complete
                                        </p>
                                    </div>
                                    <Button asChild className="mt-3 w-full">
                                        <Link href={route('reports.classes.print', schoolClass.id)} target="_blank">
                                            Open report card
                                        </Link>
                                    </Button>
                                    <Button asChild variant="secondary" className="mt-2 w-full">
                                        <Link href={route('reports.classes.csv', schoolClass.id)}>
                                            Download score CSV
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
