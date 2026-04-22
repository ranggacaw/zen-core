import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface GuardianRecord {
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
    avatar?: string | null;
}

interface GuardianEditProps {
    guardian: GuardianRecord;
    students: { id: number; name: string; student_number: string }[];
    addressOptions: AddressOptions;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Guardians', href: '/peserta-wali' },
    { title: 'Edit', href: '/peserta-wali/{guardian}/edit' },
];

function defaultValues(guardian: GuardianRecord) {
    return {
        name: guardian?.name ?? '',
        relationship: guardian?.relationship ?? 'Parent',
        phone: guardian?.phone ?? '',
        email: guardian?.email ?? '',
        avatar: null as File | null,
        birth_place: guardian?.birth_place ?? '',
        birth_date: guardian?.birth_date ?? '',
        occupation: guardian?.occupation ?? '',
        children_count: guardian?.children_count ?? 0,
        religion: guardian?.religion ?? '',
        students: guardian?.student_ids.map(String) ?? [],
        province_code: guardian?.province_code ?? '',
        regency_code: guardian?.regency_code ?? '',
        district_code: guardian?.district_code ?? '',
        village_code: guardian?.village_code ?? '',
        postal_code: guardian?.postal_code ?? '',
        address_line: guardian?.address_line ?? '',
    };
}

export default function GuardianEdit({ guardian, students, addressOptions }: GuardianEditProps) {
    const form = useForm(defaultValues(guardian));
    const [studentSearch, setStudentSearch] = useState('');

    const filteredStudents = students.filter((student) =>
        `${student.name} ${student.student_number}`.toLowerCase().includes(studentSearch.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-semibold">Edit Guardian</h1>
                    <p className="text-muted-foreground">Update guardian record for {guardian.name}</p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.put(route('guardians.update', guardian.id), {
                            preserveScroll: true,
                            forceFormData: true,
                        });
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

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="avatar">Photo</Label>
                            <Input id="avatar" type="file" accept="image/*" onChange={(event) => form.setData('avatar', event.target.files?.[0] ?? null)} />
                            {guardian.avatar ? <p className="text-xs text-muted-foreground">Foto wali saat ini sudah tersimpan.</p> : null}
                            {form.errors.avatar ? <p className="text-sm text-destructive">{form.errors.avatar}</p> : null}
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
                            <Input
                                id="student-search"
                                value={studentSearch}
                                onChange={(event) => setStudentSearch(event.target.value)}
                                placeholder="Search by student name or number"
                            />
                            <NativeSelect
                                id="students"
                                multiple
                                value={form.data.students}
                                onChange={(event) => form.setData('students', Array.from(event.currentTarget.selectedOptions).map((option) => option.value))}
                                className="min-h-28"
                            >
                                {filteredStudents.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.student_number})
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
                            Save changes
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
