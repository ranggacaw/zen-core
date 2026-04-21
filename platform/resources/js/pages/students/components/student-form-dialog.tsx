import { useEffect } from 'react';

import { useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';

export interface StudentRecord {
    id: number;
    name: string;
    nickname?: string;
    student_number: string;
    religion?: string;
    phone?: string;
    email?: string;
    birth_place?: string;
    birth_date?: string;
    gender?: string;
    child_number?: string;
    child_of_total?: string;
    citizenship?: string;
    join_date?: string;
    end_date?: string;
    postal_code?: string;
    domicile_address?: string;
    status: string;
    guardian_id: number | null;
    school_class_id: number | null;
    guardian: string | null;
    relationship: string | null;
    class: string | null;
    address_line: string | null;
    province_code: string | null;
    regency_code: string | null;
    district_code: string | null;
    village_code: string | null;
    updated_at: string;
}

interface StudentFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    student?: StudentRecord | null;
    guardians: Array<{ id: number; name: string; relationship: string }>;
    classes: Array<{ id: number; name: string }>;
    addressOptions: AddressOptions;
}

function defaultValues(student: StudentRecord | null | undefined, guardians: StudentFormDialogProps['guardians'], addressOptions: AddressOptions) {
    return {
        guardian_id: student?.guardian_id ? String(student.guardian_id) : guardians[0] ? String(guardians[0].id) : '',
        school_class_id: student?.school_class_id ? String(student.school_class_id) : '',
        name: student?.name ?? '',
        student_number: student?.student_number ?? '',
        status: student?.status ?? 'active',
        phone: student?.phone ?? '',
        email: student?.email ?? '',
        birth_date: student?.birth_date ?? '',
        join_date: student?.join_date ?? '',
        address_line: student?.address_line ?? '',
        province_code: student?.province_code ?? addressOptions.provinces[0]?.code ?? '',
        regency_code: student?.regency_code ?? addressOptions.regencies[0]?.code ?? '',
        district_code: student?.district_code ?? addressOptions.districts[0]?.code ?? '',
        village_code: student?.village_code ?? addressOptions.villages[0]?.code ?? '',
    };
}

export function StudentFormDialog({ isOpen, onClose, student, guardians, classes, addressOptions }: StudentFormDialogProps) {
    const isEdit = Boolean(student);
    const form = useForm(defaultValues(student, guardians, addressOptions));

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        form.clearErrors();
        form.setData(defaultValues(student, guardians, addressOptions));
    }, [isOpen, student, guardians, addressOptions]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit student - ${student?.name}` : 'Add student'}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (isEdit && student) {
                            form.put(route('students.update', student.id), {
                                preserveScroll: true,
                                onSuccess: () => onClose(),
                            });

                            return;
                        }

                        form.post(route('students.store'), {
                            onSuccess: () => onClose(),
                        });
                    }}
                    className="space-y-6 py-4"
                >
                    {!isEdit && !guardians.length ? (
                        <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-500">
                            Create a guardian record first so each student has a linked primary contact.
                        </p>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Full name</label>
                            <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
                            <InputError className="mt-1" message={form.errors.name} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Student number</label>
                            <Input value={form.data.student_number} onChange={(event) => form.setData('student_number', event.target.value)} />
                            <InputError className="mt-1" message={form.errors.student_number} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Guardian</label>
                            <NativeSelect value={form.data.guardian_id} onChange={(event) => form.setData('guardian_id', event.target.value)}>
                                <option value="">Select guardian</option>
                                {guardians.map((guardian) => (
                                    <option key={guardian.id} value={guardian.id}>
                                        {guardian.name} ({guardian.relationship})
                                    </option>
                                ))}
                            </NativeSelect>
                            <InputError className="mt-1" message={form.errors.guardian_id} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Class</label>
                            <NativeSelect value={form.data.school_class_id} onChange={(event) => form.setData('school_class_id', event.target.value)}>
                                <option value="">Select class</option>
                                {classes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </NativeSelect>
                            <InputError className="mt-1" message={form.errors.school_class_id} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Status</label>
                            <NativeSelect value={form.data.status} onChange={(event) => form.setData('status', event.target.value)}>
                                <option value="active">Active</option>
                                <option value="graduated">Graduated</option>
                                <option value="dropped">Dropped</option>
                            </NativeSelect>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Phone</label>
                            <Input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} />
                            <InputError className="mt-1" message={form.errors.phone} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                            <Input type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                            <InputError className="mt-1" message={form.errors.email} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">Birth date</label>
                            <Input type="date" value={form.data.birth_date} onChange={(event) => form.setData('birth_date', event.target.value)} />
                            <InputError className="mt-1" message={form.errors.birth_date} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs text-muted-foreground">Join date</label>
                            <Input type="date" value={form.data.join_date} onChange={(event) => form.setData('join_date', event.target.value)} />
                            <InputError className="mt-1" message={form.errors.join_date} />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 border-b pb-1 text-sm font-medium text-muted-foreground">Address</h4>
                        <AddressFields data={form.data} options={addressOptions} setData={(field, value) => form.setData(field, value)} />
                    </div>

                    <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing || (!isEdit && !guardians.length)} className="bg-indigo-500 text-white hover:bg-indigo-600">
                            {isEdit ? 'Save changes' : 'Create student'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
