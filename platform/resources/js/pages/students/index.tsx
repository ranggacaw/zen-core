import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import { PageHeader } from '@/components/platform/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Peserta Didik', href: '/peserta-murid' },
];

interface StudentRecord {
    id: number;
    name: string;
    nickname?: string;
    student_number: string;
    gender?: string;
    guardian: string | null;
    class: string | null;
    status: string;
    ppdb_status: string | null;
}

interface StudentIndexProps {
    students: StudentRecord[];
}

function statusVariant(status: string | null) {
    switch (status) {
        case 'approved':
        case 'active':
            return 'default';
        case 'pending':
            return 'secondary';
        case 'rejected':
        case 'dropped':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function StudentIndex({ students }: StudentIndexProps) {
    const [search, setSearch] = useState('');

    const filteredStudents = students.filter((student) => {
        const term = search.toLowerCase();

        return [student.name, student.nickname ?? '', student.student_number, student.guardian ?? '', student.class ?? '']
            .join(' ')
            .toLowerCase()
            .includes(term);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peserta Didik" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title="Peserta Didik"
                    description="Review student records in newest-first order, inspect family and address details, and update profile pictures from the detail page."
                />

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium">Daftar peserta</p>
                                <p className="text-sm text-muted-foreground">Cari berdasarkan nama, nama panggilan, NIS, wali, atau kelas.</p>
                            </div>

                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari peserta didik"
                                className="w-full md:max-w-sm"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="py-3 pr-4">Nama</th>
                                        <th className="py-3 pr-4">NIS</th>
                                        <th className="py-3 pr-4">Gender</th>
                                        <th className="py-3 pr-4">Wali</th>
                                        <th className="py-3 pr-4">Kelas</th>
                                        <th className="py-3 pr-4">Status PPDB</th>
                                        <th className="py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                Tidak ada peserta didik yang cocok dengan pencarian.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} className="border-b last:border-b-0">
                                                <td className="py-4 pr-4 align-top">
                                                    <div className="font-medium">{student.name}</div>
                                                    {student.nickname ? <div className="text-xs text-muted-foreground">Panggilan: {student.nickname}</div> : null}
                                                </td>
                                                <td className="py-4 pr-4 align-top">{student.student_number}</td>
                                                <td className="py-4 pr-4 align-top">{student.gender ?? '-'}</td>
                                                <td className="py-4 pr-4 align-top">{student.guardian ?? '-'}</td>
                                                <td className="py-4 pr-4 align-top">{student.class ?? '-'}</td>
                                                <td className="py-4 pr-4 align-top">
                                                    <Badge variant={statusVariant(student.ppdb_status)}>{student.ppdb_status ?? 'non-ppdb'}</Badge>
                                                </td>
                                                <td className="py-4 text-right align-top">
                                                    <Button variant="outline" size="sm" onClick={() => router.get(route('students.show', student.id))}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Detail
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
