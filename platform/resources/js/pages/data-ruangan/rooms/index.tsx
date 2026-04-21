import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModuleConfig {
    type: 'ruangan_belajar' | 'fasilitas_sekolah';
    title: string;
    description: string;
}

interface FacilityItem {
    id: number;
    name: string;
    location: string | null;
    status: string;
}

interface RoomsPageProps {
    module: ModuleConfig;
    items: FacilityItem[];
}

export default function DataRuanganRoomsIndex({ module, items }: RoomsPageProps) {
    const [editingItem, setEditingItem] = useState<FacilityItem | null>(null);
    const form = useForm({
        name: '',
        location: '',
        status: 'available',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Ruangan', href: '/data-ruangan/rombongan-belajar' },
        { title: module.title, href: module.type === 'ruangan_belajar' ? '/data-ruangan/ruangan-belajar' : '/data-ruangan/fasilitas-sekolah' },
    ];

    const routePrefix = module.type === 'ruangan_belajar' ? 'data-ruangan.ruangan-belajar' : 'data-ruangan.fasilitas-sekolah';

    const editKey = editingItem?.id?.toString() ?? 'none';

    useEffect(() => {
        if (editingItem) {
            form.setData({
                name: editingItem.name,
                location: editingItem.location ?? '',
                status: editingItem.status,
            });

            return;
        }

        form.reset();
        form.setData('status', 'available');
    }, [editKey]);

    const submit = () => {
        if (editingItem) {
            form.put(route(`${routePrefix}.update`, editingItem.id), {
                preserveScroll: true,
                onSuccess: () => setEditingItem(null),
            });

            return;
        }

        form.post(route(`${routePrefix}.store`), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module.title} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title={module.title}
                    description={module.description}
                    actions={
                        editingItem ? (
                            <Button variant="outline" onClick={() => setEditingItem(null)} className="gap-2">
                                <X className="h-4 w-4" /> Cancel edit
                            </Button>
                        ) : null
                    }
                />

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="space-y-4 p-6">
                        <div>
                            <h2 className="text-lg font-semibold">{editingItem ? `Edit ${module.title}` : `Create ${module.title}`}</h2>
                            <p className="text-sm text-muted-foreground">Preserve the filtered room semantics used by the cloned legacy workflow.</p>
                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                submit();
                            }}
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder={`Nama ${module.title.toLowerCase()}`} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input value={form.data.location} onChange={(event) => form.setData('location', event.target.value)} placeholder="Lokasi" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <NativeSelect value={form.data.status} onChange={(event) => form.setData('status', event.target.value)}>
                                    <option value="available">Available</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="inactive">Inactive</option>
                                </NativeSelect>
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                {editingItem ? 'Save changes' : `Create ${module.title}`}
                            </Button>
                        </form>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <h2 className="font-semibold">{module.title} list</h2>
                                <p className="text-sm text-muted-foreground">{items.length} records in the current filtered set.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                                No records yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr key={item.id} className="border-b last:border-b-0">
                                                <td className="px-6 py-4 font-medium">{item.name}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{item.location ?? 'Location not set'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{item.status}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm(`Delete ${item.name}?`)) {
                                                                    router.delete(route(`${routePrefix}.destroy`, item.id), { preserveScroll: true });
                                                                }
                                                            }}
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
            </div>
        </AppLayout>
    );
}
