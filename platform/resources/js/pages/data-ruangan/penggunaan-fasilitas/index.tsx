import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FacilityOption {
    id: number;
    name: string;
    location: string | null;
    status: string;
}

interface PersonOption {
    id: number;
    name: string;
    student_number?: string;
}

interface BookingItem {
    id: number;
    facility_id: number;
    facility: string | null;
    location: string | null;
    requester_type: 'guru' | 'murid';
    teacher_id: number | null;
    student_id: number | null;
    requester: string | null;
    purpose: string;
    notes: string | null;
    starts_at: string | null;
    ends_at: string | null;
    status: string;
    usage_status: string;
}

interface PenggunaanFasilitasProps {
    facilities: FacilityOption[];
    bookings: BookingItem[];
    teachers: PersonOption[];
    students: PersonOption[];
}

export default function PenggunaanFasilitasIndex({ facilities, bookings, teachers, students }: PenggunaanFasilitasProps) {
    const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
    const form = useForm({
        facility_id: '',
        requester_type: 'guru' as 'guru' | 'murid',
        teacher_id: '',
        student_id: '',
        purpose: '',
        notes: '',
        starts_at: '',
        ends_at: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Ruangan', href: '/data-ruangan/rombongan-belajar' },
        { title: 'Penggunaan Fasilitas', href: '/data-ruangan/penggunaan-fasilitas' },
    ];

    const editKey = editingBooking?.id?.toString() ?? 'none';

    useEffect(() => {
        if (editingBooking) {
            form.setData({
                facility_id: String(editingBooking.facility_id),
                requester_type: editingBooking.requester_type,
                teacher_id: editingBooking.teacher_id ? String(editingBooking.teacher_id) : '',
                student_id: editingBooking.student_id ? String(editingBooking.student_id) : '',
                purpose: editingBooking.purpose,
                notes: editingBooking.notes ?? '',
                starts_at: editingBooking.starts_at ?? '',
                ends_at: editingBooking.ends_at ?? '',
            });

            return;
        }

        form.reset();
        form.setData('requester_type', 'guru');
    }, [editKey]);

    const submit = () => {
        if (editingBooking) {
            form.put(route('data-ruangan.penggunaan-fasilitas.update', editingBooking.id), {
                preserveScroll: true,
                onSuccess: () => setEditingBooking(null),
            });

            return;
        }

        form.post(route('data-ruangan.penggunaan-fasilitas.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const requesterOptions = form.data.requester_type === 'guru' ? teachers : students;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penggunaan Fasilitas" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title="Penggunaan Fasilitas"
                    description="Book school facilities for guru or murid requesters with overlap protection and status visibility."
                    actions={
                        editingBooking ? (
                            <Button variant="outline" onClick={() => setEditingBooking(null)} className="gap-2">
                                <X className="h-4 w-4" /> Cancel edit
                            </Button>
                        ) : null
                    }
                />

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="space-y-4 p-6">
                        <div>
                            <h2 className="text-lg font-semibold">{editingBooking ? 'Edit booking' : 'Create booking'}</h2>
                            <p className="text-sm text-muted-foreground">Requester coverage follows the source guru or murid branching flow.</p>
                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                submit();
                            }}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Fasilitas</label>
                                    <NativeSelect value={form.data.facility_id} onChange={(event) => form.setData('facility_id', event.target.value)}>
                                        <option value="">Select facility</option>
                                        {facilities.map((facility) => (
                                            <option key={facility.id} value={facility.id}>
                                                {facility.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Requester type</label>
                                    <NativeSelect
                                        value={form.data.requester_type}
                                        onChange={(event) => {
                                            const requesterType = event.target.value as 'guru' | 'murid';
                                            form.setData('requester_type', requesterType);
                                            form.setData('teacher_id', '');
                                            form.setData('student_id', '');
                                        }}
                                    >
                                        <option value="guru">Guru</option>
                                        <option value="murid">Murid</option>
                                    </NativeSelect>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Requester</label>
                                <NativeSelect
                                    value={form.data.requester_type === 'guru' ? form.data.teacher_id : form.data.student_id}
                                    onChange={(event) => {
                                        if (form.data.requester_type === 'guru') {
                                            form.setData('teacher_id', event.target.value);

                                            return;
                                        }

                                        form.setData('student_id', event.target.value);
                                    }}
                                >
                                    <option value="">Select requester</option>
                                    {requesterOptions.map((person) => (
                                        <option key={person.id} value={person.id}>
                                            {'student_number' in person && person.student_number ? `${person.name} • ${person.student_number}` : person.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Purpose</label>
                                <Input value={form.data.purpose} onChange={(event) => form.setData('purpose', event.target.value)} placeholder="Keperluan" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start</label>
                                    <Input type="datetime-local" value={form.data.starts_at} onChange={(event) => form.setData('starts_at', event.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End</label>
                                    <Input type="datetime-local" value={form.data.ends_at} onChange={(event) => form.setData('ends_at', event.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} placeholder="Keterangan tambahan" />
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Plus className="h-4 w-4" /> {editingBooking ? 'Save changes' : 'Create booking'}
                            </Button>
                        </form>
                    </Card>

                    <Card className="space-y-4 p-6">
                        <div>
                            <h2 className="text-lg font-semibold">Scheduled usage</h2>
                            <p className="text-sm text-muted-foreground">Completion status is derived from whether the booking end time has already passed.</p>
                        </div>

                        <div className="space-y-3">
                            {bookings.length === 0 ? (
                                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No bookings yet.</div>
                            ) : (
                                bookings.map((booking) => (
                                    <div key={booking.id} className="rounded-xl border p-4">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-1">
                                                <p className="font-semibold">{booking.facility}</p>
                                                <p className="text-sm text-muted-foreground">{booking.location ?? 'Location not set'}</p>
                                                <p className="text-sm">
                                                    {booking.requester_type}: {booking.requester ?? 'Unknown requester'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.starts_at?.replace('T', ' ')} to {booking.ends_at?.replace('T', ' ')}
                                                </p>
                                                <p className="text-sm">{booking.purpose}</p>
                                                <p className="text-sm text-muted-foreground">{booking.notes ?? 'No extra notes'}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{booking.usage_status}</span>
                                                <Button variant="ghost" size="icon" onClick={() => setEditingBooking(booking)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (window.confirm(`Delete booking for ${booking.facility}?`)) {
                                                            router.delete(route('data-ruangan.penggunaan-fasilitas.destroy', booking.id), { preserveScroll: true });
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
