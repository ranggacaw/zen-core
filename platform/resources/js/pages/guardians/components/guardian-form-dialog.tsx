import { useEffect } from 'react';

import { useForm } from '@inertiajs/react';

import { AddressFields } from '@/components/platform/address-fields';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';

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
}

export interface AddressOptions {
    provinces: { code: string; name: string }[];
    regencies: { code: string; name: string }[];
    districts: { code: string; name: string }[];
    villages: { code: string; name: string }[];
}

interface GuardianFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    guardian?: GuardianRecord | null;
    students: { id: number; name: string }[];
    addressOptions: AddressOptions;
    onSubmitSuccess?: () => void;
}

function defaultValues(guardian?: GuardianRecord | null) {
    return {
        name: guardian?.name ?? '',
        relationship: guardian?.relationship ?? 'Parent',
        phone: guardian?.phone ?? '',
        email: guardian?.email ?? '',
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

export default function GuardianFormDialog({ isOpen, onClose, guardian, students, addressOptions, onSubmitSuccess }: GuardianFormDialogProps) {
    const isEditing = Boolean(guardian);
    const form = useForm(defaultValues(guardian));

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        form.clearErrors();
        form.setData(defaultValues(guardian));
    }, [guardian, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit guardian' : 'Add guardian'}</DialogTitle>
                </DialogHeader>

                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();

                        const options = {
                            preserveScroll: true,
                            onSuccess: () => {
                                onSubmitSuccess?.();
                                onClose();
                            },
                        };

                        if (isEditing && guardian) {
                            form.put(route('guardians.update', guardian.id), options);
                            return;
                        }

                        form.post(route('guardians.store'), options);
                    }}
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={form.processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : isEditing ? 'Save changes' : 'Create guardian'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
