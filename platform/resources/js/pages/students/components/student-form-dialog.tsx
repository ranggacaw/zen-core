import InputError from '@/components/input-error';
import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import React from 'react';

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

export function StudentFormDialog({ 
    isOpen, 
    onClose, 
    student, 
    guardians, 
    classes, 
    addressOptions 
}: StudentFormDialogProps) {
    const isEdit = !!student;

    const form = useForm({
        guardian_id: isEdit ? (student.guardian_id ? String(student.guardian_id) : '') : (guardians[0] ? String(guardians[0].id) : ''),
        school_class_id: isEdit ? (student.school_class_id ? String(student.school_class_id) : '') : '',
        name: isEdit ? student.name : '',
        nickname: isEdit ? (student.nickname ?? '') : '',
        student_number: isEdit ? student.student_number : '',
        religion: isEdit ? (student.religion ?? '') : '',
        phone: isEdit ? (student.phone ?? '') : '',
        email: isEdit ? (student.email ?? '') : '',
        avatar: null as File | null,
        birth_place: isEdit ? (student.birth_place ?? '') : '',
        birth_date: isEdit ? (student.birth_date ?? '') : '',
        gender: isEdit ? (student.gender ?? '') : '',
        child_number: isEdit ? (student.child_number ?? '') : '',
        child_of_total: isEdit ? (student.child_of_total ?? '') : '',
        citizenship: isEdit ? (student.citizenship ?? '') : '',
        join_date: isEdit ? (student.join_date ?? '') : '',
        end_date: isEdit ? (student.end_date ?? '') : '',
        status: isEdit ? student.status : 'active',
        address_line: isEdit ? (student.address_line ?? '') : '',
        province_code: isEdit ? (student.province_code ?? '') : (addressOptions.provinces[0]?.code ?? ''),
        regency_code: isEdit ? (student.regency_code ?? '') : (addressOptions.regencies[0]?.code ?? ''),
        district_code: isEdit ? (student.district_code ?? '') : (addressOptions.districts[0]?.code ?? ''),
        village_code: isEdit ? (student.village_code ?? '') : (addressOptions.villages[0]?.code ?? ''),
        postal_code: isEdit ? (student.postal_code ?? '') : '',
        domicile_address: isEdit ? (student.domicile_address ?? '') : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            // Inertia needs POST with spoofed _method to upload files
            form.transform((data) => ({
                ...data,
                _method: 'put'
            }));
            
            form.post(route('students.update', student.id), {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        } else {
            form.post(route('students.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit Student Data - ${student.name}` : 'New Student Data'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6 py-4">
                    {!isEdit && !guardians.length && (
                        <p className="text-sm text-rose-500 font-medium bg-rose-50 p-3 rounded-md">
                            Create a guardian record first so each student has a linked primary contact.
                        </p>
                    )}
                    
                    <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground border-b pb-1">Personal Info</h4>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Nama Lengkap</label>
                                <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.name} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Nama Panggilan</label>
                                <Input value={form.data.nickname} onChange={(e) => form.setData('nickname', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.nickname} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">NIS</label>
                                <Input value={form.data.student_number} onChange={(e) => form.setData('student_number', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.student_number} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Agama</label>
                                <NativeSelect value={form.data.religion} onChange={(e) => form.setData('religion', e.target.value)}>
                                    <option value="">-</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.religion} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Nomor telfon</label>
                                <Input type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.phone} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Email</label>
                                <Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.email} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Profile Picture</label>
                                <Input type="file" onChange={(e) => form.setData('avatar', e.target.files?.[0] || null)} />
                                <InputError className="mt-1" message={form.errors.avatar as string} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground border-b pb-1">Data Keluarga</h4>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Tempat Lahir</label>
                                <Input value={form.data.birth_place} onChange={(e) => form.setData('birth_place', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.birth_place} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Tanggal Lahir</label>
                                <Input type="date" value={form.data.birth_date} onChange={(e) => form.setData('birth_date', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.birth_date} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Jenis Kelamin</label>
                                <NativeSelect value={form.data.gender} onChange={(e) => form.setData('gender', e.target.value)}>
                                    <option value="">-</option>
                                    <option value="L">L</option>
                                    <option value="P">P</option>
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.gender} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground block mb-1">Anak Ke</label>
                                    <Input value={form.data.child_number} onChange={(e) => form.setData('child_number', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground block mb-1">Dari</label>
                                    <Input value={form.data.child_of_total} onChange={(e) => form.setData('child_of_total', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Kewarganegaraan</label>
                                <Input value={form.data.citizenship} onChange={(e) => form.setData('citizenship', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.citizenship} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Wali</label>
                                <NativeSelect value={form.data.guardian_id} onChange={(event) => form.setData('guardian_id', event.target.value)}>
                                    <option value="">Pilih Wali</option>
                                    {guardians.map((g) => (
                                        <option key={g.id} value={g.id}>{g.name} ({g.relationship})</option>
                                    ))}
                                </NativeSelect>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground border-b pb-1">General</h4>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Tanggal Bergabung</label>
                                <Input type="date" value={form.data.join_date} onChange={(e) => form.setData('join_date', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.join_date} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Tanggal Berakhir</label>
                                <Input type="date" value={form.data.end_date} onChange={(e) => form.setData('end_date', e.target.value)} />
                                <InputError className="mt-1" message={form.errors.end_date} />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Kelas/Jenjang</label>
                                <NativeSelect value={form.data.school_class_id} onChange={(event) => form.setData('school_class_id', event.target.value)}>
                                    <option value="">Pilih Kelas</option>
                                    {classes.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.school_class_id} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 pt-2">
                            <div className="col-span-2">
                                <AddressFields data={form.data} options={addressOptions} setData={(field, value) => form.setData(field, value)} />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-muted-foreground block mb-1">Kode Pos</label>
                                    <Input value={form.data.postal_code} onChange={(e) => form.setData('postal_code', e.target.value)} placeholder="Masukan kode pos" />
                                </div>
                                <div className="h-[calc(100%-120px)] mt-2">
                                   <div>
                                        <label className="text-xs text-muted-foreground block mb-1">Alamat (sesuai text box)</label>
                                        <Input value={form.data.address_line} onChange={(e) => form.setData('address_line', e.target.value)} />
                                   </div>
                                    <div className="mt-4">
                                        <label className="text-xs text-muted-foreground block mb-1">Alamat Domisili</label>
                                        <Input value={form.data.domicile_address} onChange={(e) => form.setData('domicile_address', e.target.value)} />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-xs text-muted-foreground block mb-1">Status</label>
                                        <NativeSelect value={form.data.status} onChange={(event) => form.setData('status', event.target.value)}>
                                            <option value="active">Active</option>
                                            <option value="graduated">Graduated</option>
                                            <option value="dropped">Dropped</option>
                                        </NativeSelect>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={form.processing || (!isEdit && !guardians.length)} className="bg-indigo-500 hover:bg-indigo-600 text-white">
                            {isEdit ? 'Save Changes' : 'Save Data'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}