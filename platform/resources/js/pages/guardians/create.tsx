import { useForm } from '@inertiajs/react';

import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface GuardianCreateProps {
    students: { id: number; name: string }[];
    addressOptions: AddressOptions;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Guardians', href: '/peserta-wali' },
    { title: 'Create', href: '/peserta-wali/create' },
];

function defaultValues() {
    return {
        name: '',
        relationship: 'Parent',
        phone: '',
        email: '',
        birth_place: '',
        birth_date: '',
        occupation: '',
        children_count: 0,
        religion: '',
        students: [] as string[],
        province_code: '',
        regency_code: '',
        district_code: '',
        village_code: '',
        postal_code: '',
        address_line: '',
    };
}

export default function GuardianCreate({ students, addressOptions }: GuardianCreateProps) {
    const form = useForm(defaultValues());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-semibold">Add Guardian</h1>
                    <p className="text-muted-foreground">Create a new guardian record</p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('guardians.store'));
                    }}
                    className="max-w-4xl space-y-6 rounded-lg border bg-card p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
                            {form.errors.name ? <p className="text-sm text-destructive">{form.errors.name}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <NativeSelect id="relationship" value={form.data.relationship} onChange={(event) => form.setData('relationship', event.target.value)}>
                                <option value="Parent">Parent</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Guardian">Guardian</option>
                            </NativeSelect>
                            {form.errors.relationship ? <p className="text-sm text-destructive">{form.errors.relationship}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                            {form.errors.email ? <p className="text-sm text-destructive">{form.errors.email}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} />
                            {form.errors.phone ? <p className="text-sm text-destructive">{form.errors.phone}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birth_place">Birth place</Label>
                            <Input id="birth_place" value={form.data.birth_place} onChange={(event) => form.setData('birth_place', event.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Birth date</Label>
                            <Input id="birth_date" type="date" value={form.data.birth_date} onChange={(event) => form.setData('birth_date', event.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input id="occupation" value={form.data.occupation} onChange={(event) => form.setData('occupation', event.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="children_count">Children count</Label>
                            <Input
                                id="children_count"
                                type="number"
                                min="0"
                                value={form.data.children_count}
                                onChange={(event) => form.setData('children_count', Number.parseInt(event.target.value, 10) || 0)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="religion">Religion</Label>
                            <NativeSelect id="religion" value={form.data.religion} onChange={(event) => form.setData('religion', event.target.value)}>
                                <option value="">Select religion</option>
                                <option value="Islam">Islam</option>
                                <option value="Kristen">Kristen</option>
                                <option value="Katolik">Katolik</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddha">Buddha</option>
                                <option value="Konghucu">Konghucu</option>
                            </NativeSelect>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postal_code">Postal code</Label>
                            <Input id="postal_code" value={form.data.postal_code} onChange={(event) => form.setData('postal_code', event.target.value)} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="students">Linked students</Label>
                            <NativeSelect
                                id="students"
                                multiple
                                value={form.data.students}
                                onChange={(event) => form.setData('students', Array.from(event.currentTarget.selectedOptions).map((option) => option.value))}
                                className="min-h-28"
                            >
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </NativeSelect>
                            {form.errors.students ? <p className="text-sm text-destructive">{form.errors.students}</p> : null}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="mb-4 font-medium">Address information</h4>
                        <AddressFields data={form.data} options={addressOptions} setData={(field, value) => form.setData(field, value)} />
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Create guardian
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
