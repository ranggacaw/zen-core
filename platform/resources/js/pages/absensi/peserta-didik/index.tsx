import InputError from '@/components/input-error';
import { StatCard } from '@/components/platform/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AbsensiModuleShell from '@/pages/absensi/components/module-shell';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

interface AbsensiPesertaDidikProps {
    todayLabel: string;
    scopeLabel: string;
    summary: { checked_in: number; checked_out: number; open_records: number };
}

export default function AbsensiPesertaDidikIndex({ todayLabel, scopeLabel, summary }: AbsensiPesertaDidikProps) {
    const form = useForm({ identifier: '' });
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <AbsensiModuleShell
            title="Absensi Peserta Didik"
            description={`Use the scan-first student attendance flow for same-day check-in and check-out. ${scopeLabel}`}
            activePage="peserta-didik"
        >
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Scan control point</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">Today: {todayLabel}</p>
                            <p className="mt-1">Scan once to create check-in. Scan the same student again later to fill check-out.</p>
                        </div>

                        <form
                            className="flex flex-col gap-3 md:flex-row"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.post(route('absensi.peserta-didik.store'), {
                                    preserveScroll: true,
                                    onSuccess: () => form.reset(),
                                    onFinish: () => inputRef.current?.focus(),
                                });
                            }}
                        >
                            <Input
                                ref={inputRef}
                                value={form.data.identifier}
                                onChange={(event) => form.setData('identifier', event.target.value)}
                                placeholder="Scan student number"
                                autoFocus
                                autoComplete="off"
                            />
                            <Button type="submit" disabled={form.processing}>
                                Record scan
                            </Button>
                        </form>

                        <InputError message={form.errors.identifier} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance guidance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Use the active student number as the scan value for this clone.</p>
                        <p>Open records mean the student has checked in but has not checked out yet.</p>
                        <p>Teachers only see and scan attendance for their assigned classes.</p>
                        <p>Submission feedback stays in the current scan flow so the next student can be processed immediately.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Checked in" value={summary.checked_in} />
                <StatCard label="Checked out" value={summary.checked_out} />
                <StatCard label="Open records" value={summary.open_records} />
            </div>
        </AbsensiModuleShell>
    );
}
