import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Guardians', href: '/peserta-wali' },
];

export interface GuardianRecord {
    id: number;
    name: string;
    relationship: string;
    phone: string | null;
    email: string | null;
    address_line: string | null;
    province_code: string | null;
    regency_code: string | null;
    district_code: string | null;
    village_code: string | null;
    birth_place: string | null;
    birth_date: string | null;
    occupation: string | null;
    children_count: number | null;
    religion: string | null;
    postal_code: string | null;
    student_ids: number[];
    students?: string[];
    applicants?: string[];
    updated_at?: string;
}

interface GuardianIndexProps {
    guardians: GuardianRecord[];
}

export default function GuardianIndex({ guardians }: GuardianIndexProps) {
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(route('guardians.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guardians" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader 
                    title="Guardian records" 
                    description="Maintain guardian contact records and the student or applicant relationships linked to each family account." 
                    actions={
                        <Button onClick={() => router.get(route('guardians.create'))}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add guardian
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
                                                        <Button variant="ghost" size="icon" onClick={() => router.get(route('guardians.edit', guardian.id))}>
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
        </AppLayout>
    );
}
