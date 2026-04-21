import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/resources' },
];

interface ResourcesProps {
    facilities: Array<{ id: number; name: string; location: string | null; status: string }>;
    bookings: Array<{
        id: number;
        room: string | null;
        location: string | null;
        requester: string | null;
        requester_type: string;
        purpose: string;
        notes: string | null;
        status: string;
        starts_at: string | null;
        ends_at: string | null;
    }>;
    staff: Array<{ id: number; name: string }>;
    students: Array<{ id: number; name: string; student_number: string }>;
}

export default function ResourcesIndex({ facilities, bookings, staff, students }: ResourcesProps) {
    const facilityForm = useForm({ name: '', location: '' });
    const bookingForm = useForm({
        facility_id: '',
        requester_type: 'staff',
        requester_id: '',
        purpose: '',
        notes: '',
        starts_at: '',
        ends_at: '',
    });

    const requesters = bookingForm.data.requester_type === 'staff' ? staff : students;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Room booking"
                    description="Manage rooms and schedule facility usage for clone-MVP school operations from one authenticated surface."
                />

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create booking request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="grid gap-3 md:grid-cols-2"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    bookingForm.post(route('resources.bookings.store'), {
                                        onSuccess: () => bookingForm.reset('requester_id', 'purpose', 'notes', 'starts_at', 'ends_at'),
                                    });
                                }}
                            >
                                <NativeSelect value={bookingForm.data.facility_id} onChange={(event) => bookingForm.setData('facility_id', event.target.value)}>
                                    <option value="">Select room</option>
                                    {facilities.map((facility) => (
                                        <option key={facility.id} value={facility.id}>
                                            {facility.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <NativeSelect
                                    value={bookingForm.data.requester_type}
                                    onChange={(event) => {
                                        bookingForm.setData('requester_type', event.target.value);
                                        bookingForm.setData('requester_id', '');
                                    }}
                                >
                                    <option value="staff">Staff requester</option>
                                    <option value="student">Student requester</option>
                                </NativeSelect>
                                <NativeSelect value={bookingForm.data.requester_id} onChange={(event) => bookingForm.setData('requester_id', event.target.value)}>
                                    <option value="">Select requester</option>
                                    {requesters.map((person) => (
                                        <option key={person.id} value={person.id}>
                                            {'student_number' in person ? `${person.name} • ${person.student_number}` : person.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <Input value={bookingForm.data.purpose} onChange={(event) => bookingForm.setData('purpose', event.target.value)} placeholder="Purpose" />
                                <Input type="datetime-local" value={bookingForm.data.starts_at} onChange={(event) => bookingForm.setData('starts_at', event.target.value)} />
                                <Input type="datetime-local" value={bookingForm.data.ends_at} onChange={(event) => bookingForm.setData('ends_at', event.target.value)} />
                                <div className="md:col-span-2">
                                    <Textarea value={bookingForm.data.notes} onChange={(event) => bookingForm.setData('notes', event.target.value)} placeholder="Optional notes" />
                                </div>
                                <Button type="submit" className="md:col-span-2">
                                    Create booking
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rooms and availability</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <form
                                className="space-y-3 rounded-xl border border-border/70 p-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    facilityForm.post(route('resources.facilities.store'), { onSuccess: () => facilityForm.reset() });
                                }}
                            >
                                <h3 className="font-medium">Add room</h3>
                                <Input value={facilityForm.data.name} onChange={(event) => facilityForm.setData('name', event.target.value)} placeholder="Room name" />
                                <Input value={facilityForm.data.location} onChange={(event) => facilityForm.setData('location', event.target.value)} placeholder="Location" />
                                <Button type="submit" className="w-full">
                                    Add room
                                </Button>
                            </form>
                            <div className="rounded-xl border border-border/70 p-4">
                                <h3 className="mb-3 font-medium">Room list</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {facilities.map((item) => (
                                        <div key={item.id}>
                                            {item.name} • {item.location ?? 'Location not set'} • {item.status}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled bookings</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="rounded-xl border border-border/70 p-4">
                                <p className="font-semibold">{booking.room}</p>
                                <p className="text-sm text-muted-foreground">{booking.location ?? 'Location not set'}</p>
                                <p className="mt-2 text-sm">{booking.purpose}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {booking.requester_type}: {booking.requester ?? 'Unknown requester'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {booking.starts_at} to {booking.ends_at}
                                </p>
                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{booking.status}</span>
                                    <span className="text-xs text-muted-foreground">{booking.notes ?? 'No notes'}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
