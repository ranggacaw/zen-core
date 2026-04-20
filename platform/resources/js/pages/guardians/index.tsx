import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { type AddressOptions } from '@/components/platform/address-fields';
import { Edit, Plus, Trash2 } from 'lucide-react';
import GuardianFormDialog, { type GuardianRecord as DialogGuardianRecord } from './components/guardian-form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Wali Murid', href: '/peserta-wali' },
];

export interface GuardianRecord extends DialogGuardianRecord {
    relationship?: string;
    students?: string[];
    applicants?: string[];
    updated_at?: string;
    [key: string]: any;
}

interface GuardianIndexProps {
    guardians: GuardianRecord[];
    addressOptions: AddressOptions;
    students: { id: number; name: string }[];
}

export default function GuardianIndex({ guardians, addressOptions, students }: GuardianIndexProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingGuardian, setEditingGuardian] = useState<GuardianRecord | null>(null);

    const handleCreate = () => {
        setEditingGuardian(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (guardian: GuardianRecord) => {
        setEditingGuardian(guardian);
        setIsCreateModalOpen(true);
    };

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(route('guardians.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wali Murid" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader 
                    title="Wali murid management" 
                    description="Maintain guardian contact records and the relationships they hold across applicants and active students." 
                    actions={
                        <Button onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Wali Murid
                        </Button>
                    } 
                />

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-muted/30 border-b border-border/50 text-xs text-muted-foreground/80 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">ID</th>
                                        <th className="px-5 py-3 font-semibold">Name</th>
                                        <th className="px-5 py-3 font-semibold">Phone</th>
                                        <th className="px-5 py-3 font-semibold">Email</th>
                                        <th className="px-5 py-3 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {guardians?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                                                No guardian records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        guardians?.map((guardian) => (
                                            <tr key={guardian.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-5 py-4 text-muted-foreground">{guardian.id}</td>
                                                <td className="px-5 py-4 font-medium">{guardian.name}</td>
                                                <td className="px-5 py-4 text-muted-foreground">{guardian.phone || '-'}</td>
                                                <td className="px-5 py-4 text-muted-foreground">{guardian.email || '-'}</td>
                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(guardian)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(guardian.id, guardian.name)}>
                                                            <Trash2 className="w-4 h-4" />
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

            <GuardianFormDialog
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                guardian={editingGuardian as any}
                students={students}
                addressOptions={addressOptions}
                onSubmitSuccess={() => setIsCreateModalOpen(false)}
            />
        </AppLayout>
    );
}
