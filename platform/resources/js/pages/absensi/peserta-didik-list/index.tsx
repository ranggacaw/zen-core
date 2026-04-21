import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AbsensiModuleShell from '@/pages/absensi/components/module-shell';

interface AttendanceListRecord {
    id: number;
    student: string | null;
    student_number: string | null;
    class: string | null;
    class_context: string;
    attendance_date: string | null;
    status: string;
    check_in_at: string | null;
    check_out_at: string | null;
    scan_count: number;
    needs_checkout: boolean;
}

interface AbsensiPesertaDidikListProps {
    scopeLabel: string;
    records: AttendanceListRecord[];
}

export default function AbsensiPesertaDidikListIndex({ scopeLabel, records }: AbsensiPesertaDidikListProps) {
    return (
        <AbsensiModuleShell
            title="Absensi Peserta Didik List"
            description={`Review recent student attendance entries with student identity, class context, and timing details. ${scopeLabel}`}
            activePage="peserta-didik-list"
        >
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
                                            {record.student_number} • {record.class_context || record.class || '-'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Attendance date: {record.attendance_date ?? '--'}</p>
                                    </div>

                                    <div className="flex flex-col items-start gap-1 text-sm md:items-end">
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">
                                            {record.status}
                                        </span>
                                        <span className="text-muted-foreground">Check in {record.check_in_at ?? '--'}</span>
                                        <span className="text-muted-foreground">Check out {record.check_out_at ?? '--'}</span>
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
        </AbsensiModuleShell>
    );
}
