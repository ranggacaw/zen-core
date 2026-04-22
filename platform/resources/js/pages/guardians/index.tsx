import { Head, router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/platform/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Wali Murid', href: '/peserta-wali' },
];

export interface GuardianRecord {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    occupation: string | null;
    children_count: number | null;
    linked_children_count: number;
    avatar?: string | null;
}

interface GuardianIndexProps {
    guardians: GuardianRecord[];
}

export default function GuardianIndex({ guardians }: GuardianIndexProps) {
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Hapus wali murid ${name}?`)) {
            router.delete(route('guardians.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wali Murid" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Wali Murid"
                    description="Kelola data wali, akun login yang terhubung, relasi peserta didik, dan data alamat standar."
                    actions={
                        <Button onClick={() => router.get(route('guardians.create'))}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah wali murid
                        </Button>
                    }
                />

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">Nama</th>
                                        <th className="px-6 py-3">Avatar</th>
                                        <th className="px-6 py-3">Jumlah anak</th>
                                        <th className="px-6 py-3">Pekerjaan</th>
                                        <th className="px-6 py-3">Kontak</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guardians.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                                Belum ada data wali murid.
                                            </td>
                                        </tr>
                                    ) : (
                                        guardians.map((guardian) => (
                                            <tr key={guardian.id} className="border-b last:border-b-0">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="font-medium">{guardian.name}</div>
                                                    {guardian.email ? <div className="text-xs text-muted-foreground">{guardian.email}</div> : null}
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <Badge variant={guardian.avatar ? 'default' : 'outline'}>{guardian.avatar ? 'Tersimpan' : 'Belum ada'}</Badge>
                                                </td>
                                                <td className="px-6 py-4 align-top">{guardian.linked_children_count || guardian.children_count || 0}</td>
                                                <td className="px-6 py-4 align-top">{guardian.occupation ?? '-'}</td>
                                                <td className="px-6 py-4 align-top">{guardian.phone ?? '-'}</td>
                                                <td className="px-6 py-4 align-top text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="icon" onClick={() => router.get(route('guardians.edit', guardian.id))}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(guardian.id, guardian.name)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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
