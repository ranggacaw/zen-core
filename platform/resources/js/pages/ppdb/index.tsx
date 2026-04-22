import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/platform/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'PPDB', href: '/peserta-ppdb' },
];

interface ApplicantRecord {
    id: number;
    name: string;
    student_number: string | null;
    status: string;
    decision_notes: string | null;
    guardian: string | null;
    guardian_phone: string | null;
    class: string | null;
    updated_at: string;
}

interface PpdbProps {
    applicants: ApplicantRecord[];
}

function statusVariant(status: string) {
    if (status === 'approved') return 'default';
    if (status === 'rejected') return 'destructive';

    return 'secondary';
}

export default function PpdbIndex({ applicants }: PpdbProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PPDB" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="PPDB"
                    description="Review admissions records, inspect guardian and address details, then approve or reject each submission from the detail page."
                />

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">Peserta</th>
                                        <th className="px-6 py-3">Wali</th>
                                        <th className="px-6 py-3">Kontak</th>
                                        <th className="px-6 py-3">Kelas</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Catatan</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                                Belum ada data PPDB.
                                            </td>
                                        </tr>
                                    ) : (
                                        applicants.map((applicant) => (
                                            <tr key={applicant.id} className="border-b last:border-b-0">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="font-medium">{applicant.name}</div>
                                                    <div className="text-xs text-muted-foreground">{applicant.student_number ?? 'Nomor peserta belum diisi'}</div>
                                                </td>
                                                <td className="px-6 py-4 align-top">{applicant.guardian ?? '-'}</td>
                                                <td className="px-6 py-4 align-top">{applicant.guardian_phone ?? '-'}</td>
                                                <td className="px-6 py-4 align-top">{applicant.class ?? '-'}</td>
                                                <td className="px-6 py-4 align-top">
                                                    <Badge variant={statusVariant(applicant.status)}>{applicant.status}</Badge>
                                                </td>
                                                <td className="px-6 py-4 align-top text-muted-foreground">{applicant.decision_notes ?? '-'}</td>
                                                <td className="px-6 py-4 align-top text-right">
                                                    <Button variant="outline" size="sm" onClick={() => router.get(route('ppdb.show', applicant.id))}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Review
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
