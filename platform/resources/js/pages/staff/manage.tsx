import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface StaffItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    position: string;
    employee_number: string;
    employment_status: string;
    address: string;
    has_user_account: boolean;
    edit_url: string;
    delete_url: string;
}

interface StaffManageProps {
    staffTypeLabel: string;
    createUrl: string;
    items: StaffItem[];
}

export default function StaffManage({ staffTypeLabel, createUrl, items }: StaffManageProps) {
    const [search, setSearch] = useState('');
    const indexUrl = createUrl.replace('/create', '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Staff', href: '/staff/pengajar' },
        { title: staffTypeLabel, href: indexUrl },
    ];

    const filteredItems = useMemo(
        () =>
            items.filter((item) =>
                [item.name, item.email, item.phone, item.position, item.employee_number, item.address]
                    .join(' ')
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [items, search],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Staff ${staffTypeLabel}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title={`Staff ${staffTypeLabel}`}
                    description={`Manage ${staffTypeLabel.toLowerCase()} records cloned from the legacy staff module flow.`}
                    actions={
                        <Button onClick={() => router.get(createUrl)} className="h-10 gap-2 bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm">
                            <Plus className="h-4 w-4" /> Add {staffTypeLabel}
                        </Button>
                    }
                />

                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/50">
                    <div className="flex flex-col gap-4 border-b bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium">{filteredItems.length} records</p>
                            <p className="text-sm text-muted-foreground">Linked login accounts stay attached to the same staff record.</p>
                        </div>
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-9 w-full sm:w-72"
                            placeholder="Search by name, email, position..."
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-y border-border/50 bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Name</th>
                            <th className="px-5 py-3 font-semibold">Position</th>
                            <th className="px-5 py-3 font-semibold">Employee No.</th>
                            <th className="px-5 py-3 font-semibold">Contact</th>
                            <th className="px-5 py-3 font-semibold">Status</th>
                            <th className="px-5 py-3 font-semibold">Login</th>
                            <th className="px-5 py-3 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                                            No {staffTypeLabel.toLowerCase()} records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-xs text-muted-foreground">{item.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                <div className="flex flex-col">
                                                    <span>{item.position}</span>
                                                    <span className="text-xs text-muted-foreground">{item.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-medium">{item.employee_number}</td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                <div className="flex flex-col">
                                                    <span>{item.phone || '-'}</span>
                                                    <span className="text-xs text-muted-foreground">{item.address || 'Address not set'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                                    {item.employment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">{item.has_user_account ? 'Linked' : 'Not linked'}</td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                        onClick={() => router.get(item.edit_url)}
                                                        title="Edit staff"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                        onClick={() => {
                                                            if (window.confirm(`Delete ${item.name}?`)) {
                                                                router.delete(item.delete_url);
                                                            }
                                                        }}
                                                        title="Delete staff"
                                                    >
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
                </Card>
            </div>
        </AppLayout>
    );
}
