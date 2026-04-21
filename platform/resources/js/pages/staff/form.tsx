import InputError from '@/components/input-error';
import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

interface StaffFormRecord {
    id: number;
    name: string;
    email: string;
    role: string;
    position: string;
    employee_number: string;
    employment_status: string;
    avatar: string | null;
    nik: string | null;
    education: string | null;
    specialization_subjects: number[];
    phone: string | null;
    gender: string | null;
    birth_place: string | null;
    birth_date: string | null;
    nip: string | null;
    religion: string | null;
    bank_name: string | null;
    bank_account: string | null;
    join_date: string | null;
    end_date: string | null;
    decree_permanent: string | null;
    decree_contract: string | null;
    address_line: string | null;
    province_code: string | null;
    regency_code: string | null;
    district_code: string | null;
    village_code: string | null;
    postal_code: string | null;
    has_user_account: boolean;
}

interface StaffFormProps {
    staffType: string;
    staffTypeLabel: string;
    backUrl: string;
    submitUrl: string;
    roles: Array<{ value: string; label: string }>;
    religions: Array<{ value: string; label: string }>;
    genders: Array<{ value: string; label: string }>;
    addressOptions: AddressOptions;
    indicators: Array<{ value: number; label: string }>;
    staff: StaffFormRecord | null;
}

export default function StaffForm({
    staffType,
    staffTypeLabel,
    backUrl,
    submitUrl,
    roles,
    religions,
    genders,
    addressOptions,
    indicators,
    staff,
}: StaffFormProps) {
    const isPengajar = staffType === 'pengajar';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Staff', href: '/staff/pengajar' },
        { title: staffTypeLabel, href: backUrl },
        { title: staff ? 'Edit' : 'Create', href: backUrl },
    ];

    const form = useForm({
        name: staff?.name ?? '',
        email: staff?.email ?? '',
        role: staff?.role ?? roles[0]?.value ?? '',
        position: staff?.position ?? '',
        employee_number: staff?.employee_number ?? '',
        employment_status: staff?.employment_status ?? 'active',
        avatar: null as File | null,
        nik: staff?.nik ?? '',
        education: staff?.education ?? '',
        specialization_subjects: (staff?.specialization_subjects ?? []).map(String),
        phone: staff?.phone ?? '',
        gender: staff?.gender ?? '',
        birth_place: staff?.birth_place ?? '',
        birth_date: staff?.birth_date ?? '',
        nip: staff?.nip ?? '',
        religion: staff?.religion ?? '',
        bank_name: staff?.bank_name ?? '',
        bank_account: staff?.bank_account ?? '',
        join_date: staff?.join_date ?? '',
        end_date: staff?.end_date ?? '',
        decree_permanent: staff?.decree_permanent ?? '',
        decree_contract: staff?.decree_contract ?? '',
        address_line: staff?.address_line ?? '',
        province_code: staff?.province_code ?? addressOptions.provinces[0]?.code ?? '',
        regency_code: staff?.regency_code ?? addressOptions.regencies[0]?.code ?? '',
        district_code: staff?.district_code ?? addressOptions.districts[0]?.code ?? '',
        village_code: staff?.village_code ?? addressOptions.villages[0]?.code ?? '',
        postal_code: staff?.postal_code ?? '',
        create_user_account: staff?.has_user_account ?? true,
    });

    const toggleSubject = (subjectId: string, checked: boolean) => {
        form.setData(
            'specialization_subjects',
            checked
                ? [...form.data.specialization_subjects, subjectId]
                : form.data.specialization_subjects.filter((value) => value !== subjectId),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${staff ? 'Edit' : 'Create'} ${staffTypeLabel}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-semibold">{staff ? 'Edit' : 'Create'} {staffTypeLabel}</h1>
                    <p className="text-muted-foreground">Legacy `Pegawai` fields have been ported into the current Staff workflow with clearer sectioning.</p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (staff) {
                            form.put(submitUrl, { preserveScroll: true, forceFormData: true });

                            return;
                        }

                        form.post(submitUrl, { forceFormData: true });
                    }}
                    className="max-w-5xl space-y-6 rounded-lg border bg-card p-6 shadow-sm"
                >
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-base font-semibold">Identity</h2>
                            <p className="text-sm text-muted-foreground">Core staff identity, module role, and onboarding details.</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Full name</label>
                                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.name} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                                <Input type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.email} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">NIK</label>
                                <Input value={form.data.nik} onChange={(event) => form.setData('nik', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.nik} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">NIP / NBM</label>
                                <Input value={form.data.nip} onChange={(event) => form.setData('nip', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.nip} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Role</label>
                                <NativeSelect value={form.data.role} onChange={(event) => form.setData('role', event.target.value)}>
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.role} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Position</label>
                                <Input value={form.data.position} onChange={(event) => form.setData('position', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.position} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Employee number</label>
                                <Input value={form.data.employee_number} onChange={(event) => form.setData('employee_number', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.employee_number} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Phone</label>
                                <Input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} placeholder="08xxxxxxxxxx" />
                                <InputError className="mt-1" message={form.errors.phone} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Education</label>
                                <Input value={form.data.education} onChange={(event) => form.setData('education', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.education} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Photo</label>
                                <Input type="file" accept="image/*" onChange={(event) => form.setData('avatar', event.target.files?.[0] ?? null)} />
                                {staff?.avatar ? <p className="mt-1 text-xs text-muted-foreground">A profile photo is already stored for this record.</p> : null}
                                <InputError className="mt-1" message={form.errors.avatar} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 border-t pt-6">
                        <div>
                            <h2 className="text-base font-semibold">General</h2>
                            <p className="text-sm text-muted-foreground">Personal details, employment dates, and legacy administrative metadata.</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Gender</label>
                                <NativeSelect value={form.data.gender} onChange={(event) => form.setData('gender', event.target.value)}>
                                    <option value="">Select gender</option>
                                    {genders.map((gender) => (
                                        <option key={gender.value} value={gender.value}>
                                            {gender.label}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.gender} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Religion</label>
                                <NativeSelect value={form.data.religion} onChange={(event) => form.setData('religion', event.target.value)}>
                                    <option value="">Select religion</option>
                                    {religions.map((religion) => (
                                        <option key={religion.value} value={religion.value}>
                                            {religion.label}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.religion} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Birth place</label>
                                <Input value={form.data.birth_place} onChange={(event) => form.setData('birth_place', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.birth_place} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Birth date</label>
                                <Input type="date" value={form.data.birth_date} onChange={(event) => form.setData('birth_date', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.birth_date} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Join date</label>
                                <Input type="date" value={form.data.join_date} onChange={(event) => form.setData('join_date', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.join_date} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">End date</label>
                                <Input type="date" value={form.data.end_date} onChange={(event) => form.setData('end_date', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.end_date} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Employment status</label>
                                <NativeSelect value={form.data.employment_status} onChange={(event) => form.setData('employment_status', event.target.value)}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </NativeSelect>
                                <InputError className="mt-1" message={form.errors.employment_status} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Bank name</label>
                                <Input value={form.data.bank_name} onChange={(event) => form.setData('bank_name', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.bank_name} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Bank account number</label>
                                <Input value={form.data.bank_account} onChange={(event) => form.setData('bank_account', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.bank_account} />
                            </div>
                            {isPengajar ? (
                                <>
                                    <div>
                                        <label className="mb-1 block text-xs text-muted-foreground">Nomor SK Guru Tetap Yayasan</label>
                                        <Input value={form.data.decree_permanent} onChange={(event) => form.setData('decree_permanent', event.target.value)} />
                                        <InputError className="mt-1" message={form.errors.decree_permanent} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-muted-foreground">Nomor SK Guru Tidak Tetap</label>
                                        <Input value={form.data.decree_contract} onChange={(event) => form.setData('decree_contract', event.target.value)} />
                                        <InputError className="mt-1" message={form.errors.decree_contract} />
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </section>

                    {isPengajar ? (
                        <section className="space-y-4 border-t pt-6">
                            <div>
                                <h2 className="text-base font-semibold">Teaching Focus</h2>
                                <p className="text-sm text-muted-foreground">Pick the closest subject specializations available in the current platform.</p>
                            </div>

                            {indicators.length ? (
                                <div className="grid gap-3 md:grid-cols-2">
                                    {indicators.map((indicator) => (
                                        <label key={indicator.value} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={form.data.specialization_subjects.includes(String(indicator.value))}
                                                onChange={(event) => toggleSubject(String(indicator.value), event.target.checked)}
                                            />
                                            <span>{indicator.label}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                                    No academic indicators are available yet. You can save the staff record now and assign teaching context later.
                                </p>
                            )}
                            <InputError className="mt-1" message={form.errors.specialization_subjects} />
                        </section>
                    ) : null}

                    <section className="space-y-4 border-t pt-6">
                        <div>
                            <h2 className="text-base font-semibold">Address</h2>
                            <p className="text-sm text-muted-foreground">Administrative address fields ported from the legacy module.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">Postal code</label>
                                <Input value={form.data.postal_code} onChange={(event) => form.setData('postal_code', event.target.value)} />
                                <InputError className="mt-1" message={form.errors.postal_code} />
                            </div>

                            <AddressFields
                                data={{
                                    address_line: form.data.address_line,
                                    province_code: form.data.province_code,
                                    regency_code: form.data.regency_code,
                                    district_code: form.data.district_code,
                                    village_code: form.data.village_code,
                                }}
                                options={addressOptions}
                                setData={(field, value) => form.setData(field, value)}
                            />

                            <InputError className="mt-1" message={form.errors.address_line} />
                            <InputError className="mt-1" message={form.errors.province_code} />
                            <InputError className="mt-1" message={form.errors.regency_code} />
                            <InputError className="mt-1" message={form.errors.district_code} />
                            <InputError className="mt-1" message={form.errors.village_code} />
                        </div>
                    </section>

                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        {staff?.has_user_account ? (
                            <p>This record already has a linked login account. Updating the form will keep the account synced.</p>
                        ) : (
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.create_user_account}
                                    onChange={(event) => form.setData('create_user_account', event.target.checked)}
                                />
                                Create linked login account with default password <code>password</code>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => router.get(backUrl)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing} className="bg-indigo-500 text-white hover:bg-indigo-600">
                            {staff ? 'Save changes' : `Create ${staffTypeLabel}`}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
