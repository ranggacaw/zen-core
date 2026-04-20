import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Resources', href: '/resources' },
];

interface ResourcesProps {
    billing: Array<{ id: number; student: string | null; student_number: string | null; title: string; amount: string; status: string; payment_reference: string | null; due_on: string | null }>;
    inventory: Array<{ id: number; name: string; stock_quantity: number; status: string }>;
    facilities: Array<{ id: number; name: string; location: string | null; status: string }>;
    events: Array<{ id: number; title: string; scheduled_for: string; notes: string | null; allocations: Array<{ resource: string; status: string; quantity: number }> }>;
    students: Array<{ id: number; name: string; student_number: string }>;
}

export default function ResourcesIndex({ billing, inventory, facilities, events, students }: ResourcesProps) {
    const billingForm = useForm({ student_id: '', title: '', amount: '', due_on: '' });
    const inventoryForm = useForm({ name: '', stock_quantity: '1' });
    const facilityForm = useForm({ name: '', location: '' });
    const eventForm = useForm({ title: '', scheduled_for: '', notes: '' });
    const allocationForm = useForm({ resource_type: 'facility', resource_id: '', quantity: '1' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Business resources" description="Reconcile billing, manage inventory and facilities, and allocate resources to school events from one authenticated surface." />

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing and reconciliation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form
                                className="grid gap-3 md:grid-cols-2"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    billingForm.post(route('resources.billing.store'), { onSuccess: () => billingForm.reset() });
                                }}
                            >
                                <NativeSelect value={billingForm.data.student_id} onChange={(event) => billingForm.setData('student_id', event.target.value)}>
                                    <option value="">Select student</option>
                                    {students.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} • {student.student_number}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <Input value={billingForm.data.title} onChange={(event) => billingForm.setData('title', event.target.value)} placeholder="Billing title" />
                                <Input value={billingForm.data.amount} onChange={(event) => billingForm.setData('amount', event.target.value)} placeholder="Amount" />
                                <div className="flex gap-2">
                                    <Input type="date" value={billingForm.data.due_on} onChange={(event) => billingForm.setData('due_on', event.target.value)} />
                                    <Button type="submit">Create</Button>
                                </div>
                            </form>
                            <div className="space-y-3">
                                {billing.map((item) => (
                                    <div key={item.id} className="rounded-xl border border-border/70 p-4">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="font-semibold">{item.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.student} • {item.student_number} • Due {item.due_on ?? 'TBD'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Reference: {item.payment_reference ?? 'Awaiting payment provider'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{item.status}</span>
                                                <Button size="sm" onClick={() => router.post(route('resources.billing.reconcile', item.id))}>
                                                    Reconcile
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory and facilities</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <form
                                className="space-y-3 rounded-xl border border-border/70 p-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    inventoryForm.post(route('resources.inventory.store'), { onSuccess: () => inventoryForm.reset() });
                                }}
                            >
                                <h3 className="font-medium">Inventory item</h3>
                                <Input value={inventoryForm.data.name} onChange={(event) => inventoryForm.setData('name', event.target.value)} placeholder="Item name" />
                                <Input
                                    value={inventoryForm.data.stock_quantity}
                                    onChange={(event) => inventoryForm.setData('stock_quantity', event.target.value)}
                                    placeholder="Stock quantity"
                                />
                                <Button type="submit" className="w-full">Add inventory</Button>
                            </form>
                            <form
                                className="space-y-3 rounded-xl border border-border/70 p-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    facilityForm.post(route('resources.facilities.store'), { onSuccess: () => facilityForm.reset() });
                                }}
                            >
                                <h3 className="font-medium">Facility</h3>
                                <Input value={facilityForm.data.name} onChange={(event) => facilityForm.setData('name', event.target.value)} placeholder="Facility name" />
                                <Input value={facilityForm.data.location} onChange={(event) => facilityForm.setData('location', event.target.value)} placeholder="Location" />
                                <Button type="submit" className="w-full">Add facility</Button>
                            </form>
                            <div className="rounded-xl border border-border/70 p-4">
                                <h3 className="mb-3 font-medium">Inventory list</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {inventory.map((item) => (
                                        <div key={item.id}>
                                            {item.name} • Stock {item.stock_quantity} • {item.status}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl border border-border/70 p-4">
                                <h3 className="mb-3 font-medium">Facility list</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {facilities.map((item) => (
                                        <div key={item.id}>
                                            {item.name} • {item.location} • {item.status}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Events and allocations</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-4">
                            <form
                                className="space-y-3 rounded-xl border border-border/70 p-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    eventForm.post(route('resources.events.store'), { onSuccess: () => eventForm.reset() });
                                }}
                            >
                                <h3 className="font-medium">Create event</h3>
                                <Input value={eventForm.data.title} onChange={(event) => eventForm.setData('title', event.target.value)} placeholder="Event title" />
                                <Input
                                    type="datetime-local"
                                    value={eventForm.data.scheduled_for}
                                    onChange={(event) => eventForm.setData('scheduled_for', event.target.value)}
                                />
                                <Textarea value={eventForm.data.notes} onChange={(event) => eventForm.setData('notes', event.target.value)} placeholder="Operational notes" />
                                <Button type="submit" className="w-full">Create event</Button>
                            </form>

                            {events[0] ? (
                                <form
                                    className="space-y-3 rounded-xl border border-border/70 p-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        router.post(route('resources.events.allocate', events[0].id), allocationForm.data);
                                    }}
                                >
                                    <h3 className="font-medium">Allocate first listed event</h3>
                                    <NativeSelect
                                        value={allocationForm.data.resource_type}
                                        onChange={(event) => {
                                            allocationForm.setData('resource_type', event.target.value);
                                            allocationForm.setData('resource_id', '');
                                        }}
                                    >
                                        <option value="facility">Facility</option>
                                        <option value="inventory">Inventory</option>
                                    </NativeSelect>
                                    <NativeSelect value={allocationForm.data.resource_id} onChange={(event) => allocationForm.setData('resource_id', event.target.value)}>
                                        <option value="">Select resource</option>
                                        {(allocationForm.data.resource_type === 'facility' ? facilities : inventory).map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <Input value={allocationForm.data.quantity} onChange={(event) => allocationForm.setData('quantity', event.target.value)} placeholder="Quantity" />
                                    <Button type="submit" className="w-full">Allocate</Button>
                                </form>
                            ) : null}
                        </div>

                        <div className="space-y-3">
                            {events.map((event) => (
                                <div key={event.id} className="rounded-xl border border-border/70 p-4">
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{event.scheduled_for}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">{event.notes}</p>
                                    <div className="mt-3 space-y-2 text-sm">
                                        {event.allocations.length ? (
                                            event.allocations.map((allocation, index) => (
                                                <div key={`${event.id}-${index}`} className="rounded-md bg-muted/50 p-2">
                                                    {allocation.resource} • Qty {allocation.quantity} • {allocation.status}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">No resources allocated yet.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
