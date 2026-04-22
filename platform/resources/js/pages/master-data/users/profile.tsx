import InputError from '@/components/input-error';
import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type StaffData, type User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type TabId = 'data-diri' | 'password';

interface ProfileProps extends SharedData {
    user: User;
    staff: StaffData | null;
    can_edit_personal_data: boolean;
    default_tab: TabId;
    religions: Array<{ value: string; label: string }>;
    addressOptions: AddressOptions;
    subjects: Array<{ value: number; label: string }>;
}

export default function UserProfile() {
    const { user, staff, can_edit_personal_data, default_tab, religions, addressOptions, subjects } = usePage<ProfileProps>().props;
    const [activeTab, setActiveTab] = useState<TabId>(default_tab);

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/users' },
        { title: 'Profile' },
    ], []);

    const profileForm = useForm({
        name: staff?.name ?? user.name,
        email: staff?.email ?? user.email,
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
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const genderOptions = [
        { value: 'L', label: 'Laki-laki' },
        { value: 'P', label: 'Perempuan' },
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const tabs: Array<{ id: TabId; label: string }> = can_edit_personal_data
        ? [
              { id: 'data-diri', label: 'Data Diri' },
              { id: 'password', label: 'Ubah Password' },
          ]
        : [{ id: 'password', label: 'Ubah Password' }];

    const toggleSubject = (subjectId: string, checked: boolean) => {
        profileForm.setData(
            'specialization_subjects',
            checked
                ? [...profileForm.data.specialization_subjects, subjectId]
                : profileForm.data.specialization_subjects.filter((value) => value !== subjectId),
        );
    };

    const handleProfileSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        profileForm.put(route('master-data.users.profile.update', user.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setActiveTab('data-diri'),
        });
    };

    const handlePasswordSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        passwordForm.put(route('master-data.users.password', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setActiveTab('password');
            },
            onError: () => setActiveTab('password'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold">Profile</h1>
                            <p className="text-sm text-muted-foreground">Kelola `Data Diri` dan `Ubah Password` untuk user terpilih.</p>
                            <div className="text-sm text-muted-foreground">
                                <div>{user.name}</div>
                                <div>{user.email}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {staff?.avatar_url ? (
                                <img
                                    src={staff.avatar_url}
                                    alt={staff.name}
                                    className="h-20 w-20 rounded-full border object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-muted text-xs text-muted-foreground">
                                    No Photo
                                </div>
                            )}
                            <div className="text-sm">
                                <div className="font-medium">{staff?.role_display ?? user.role}</div>
                                <div className="text-muted-foreground">{staff?.staff_type ?? 'No staff profile'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b">
                    <nav className="-mb-px flex gap-6" aria-label="Profile tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'data-diri' && can_edit_personal_data && staff ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold">Identity</h2>
                                <p className="text-sm text-muted-foreground">Informasi identitas utama dan jabatan baca-saja.</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Nama</Label>
                                    <Input id="name" value={profileForm.data.name} onChange={(event) => profileForm.setData('name', event.target.value)} />
                                    <InputError className="mt-2" message={profileForm.errors.name} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={profileForm.data.email} onChange={(event) => profileForm.setData('email', event.target.value)} />
                                    <InputError className="mt-2" message={profileForm.errors.email} />
                                </div>
                                <div>
                                    <Label htmlFor="role_display">Jabatan</Label>
                                    <Input id="role_display" value={staff.role_display} readOnly disabled />
                                </div>
                                <div>
                                    <Label htmlFor="avatar">Foto Profil</Label>
                                    <Input id="avatar" type="file" accept="image/*" onChange={(event) => profileForm.setData('avatar', event.target.files?.[0] ?? null)} />
                                    <InputError className="mt-2" message={profileForm.errors.avatar} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold">Data Diri</h2>
                                <p className="text-sm text-muted-foreground">Kelola data pegawai/pengajar yang terhubung ke akun ini.</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="position">Posisi</Label>
                                    <Input id="position" value={profileForm.data.position} onChange={(event) => profileForm.setData('position', event.target.value)} />
                                    <InputError className="mt-2" message={profileForm.errors.position} />
                                </div>
                                <div>
                                    <Label htmlFor="employee_number">Nomor Pegawai</Label>
                                    <Input id="employee_number" value={profileForm.data.employee_number} onChange={(event) => profileForm.setData('employee_number', event.target.value)} />
                                    <InputError className="mt-2" message={profileForm.errors.employee_number} />
                                </div>
                                <div>
                                    <Label htmlFor="employment_status">Status</Label>
                                    <NativeSelect id="employment_status" value={profileForm.data.employment_status} onChange={(event) => profileForm.setData('employment_status', event.target.value)}>
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <div>
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input id="nik" value={profileForm.data.nik} onChange={(event) => profileForm.setData('nik', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="nip">NIP/NBM</Label>
                                    <Input id="nip" value={profileForm.data.nip} onChange={(event) => profileForm.setData('nip', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Telepon</Label>
                                    <Input id="phone" value={profileForm.data.phone} onChange={(event) => profileForm.setData('phone', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="education">Pendidikan</Label>
                                    <Input id="education" value={profileForm.data.education} onChange={(event) => profileForm.setData('education', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="gender">Jenis Kelamin</Label>
                                    <NativeSelect id="gender" value={profileForm.data.gender} onChange={(event) => profileForm.setData('gender', event.target.value)}>
                                        <option value="">Select gender</option>
                                        {genderOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <div>
                                    <Label htmlFor="birth_place">Tempat Lahir</Label>
                                    <Input id="birth_place" value={profileForm.data.birth_place} onChange={(event) => profileForm.setData('birth_place', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="birth_date">Tanggal Lahir</Label>
                                    <Input id="birth_date" type="date" value={profileForm.data.birth_date} onChange={(event) => profileForm.setData('birth_date', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="religion">Agama</Label>
                                    <NativeSelect id="religion" value={profileForm.data.religion} onChange={(event) => profileForm.setData('religion', event.target.value)}>
                                        <option value="">Select religion</option>
                                        {religions.map((religion) => (
                                            <option key={religion.value} value={religion.value}>
                                                {religion.label}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold">Subject</h2>
                                <p className="text-sm text-muted-foreground">Sinkronkan mata pelajaran untuk pengajar ini.</p>
                            </div>

                            {subjects.length ? (
                                <div className="grid gap-3 md:grid-cols-2">
                                    {subjects.map((subject) => (
                                        <label key={subject.value} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={profileForm.data.specialization_subjects.includes(String(subject.value))}
                                                onChange={(event) => toggleSubject(String(subject.value), event.target.checked)}
                                            />
                                            <span>{subject.label}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No academic indicators available.</p>
                            )}
                            <InputError className="mt-2" message={profileForm.errors.specialization_subjects} />
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold">Employment</h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="join_date">Tanggal Bergabung</Label>
                                    <Input id="join_date" type="date" value={profileForm.data.join_date} onChange={(event) => profileForm.setData('join_date', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="end_date">Tanggal Berakhir</Label>
                                    <Input id="end_date" type="date" value={profileForm.data.end_date} onChange={(event) => profileForm.setData('end_date', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="decree_permanent">SK Guru Tetap</Label>
                                    <Input id="decree_permanent" value={profileForm.data.decree_permanent} onChange={(event) => profileForm.setData('decree_permanent', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="decree_contract">SK Guru Tidak Tetap</Label>
                                    <Input id="decree_contract" value={profileForm.data.decree_contract} onChange={(event) => profileForm.setData('decree_contract', event.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold">Bank</h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="bank_name">Bank</Label>
                                    <Input id="bank_name" value={profileForm.data.bank_name} onChange={(event) => profileForm.setData('bank_name', event.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="bank_account">Nomor Rekening</Label>
                                    <Input id="bank_account" value={profileForm.data.bank_account} onChange={(event) => profileForm.setData('bank_account', event.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold">Address</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="postal_code">Kode Pos</Label>
                                    <Input id="postal_code" value={profileForm.data.postal_code} onChange={(event) => profileForm.setData('postal_code', event.target.value)} />
                                </div>

                                <AddressFields
                                    data={{
                                        address_line: profileForm.data.address_line,
                                        province_code: profileForm.data.province_code,
                                        regency_code: profileForm.data.regency_code,
                                        district_code: profileForm.data.district_code,
                                        village_code: profileForm.data.village_code,
                                    }}
                                    options={addressOptions}
                                    setData={(field, value) => profileForm.setData(field, value)}
                                />

                                <InputError className="mt-2" message={profileForm.errors.address_line} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="submit" disabled={profileForm.processing}>Save Data Diri</Button>
                        </div>
                    </form>
                ) : null}

                {activeTab === 'password' ? (
                    <form onSubmit={handlePasswordSubmit} className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Ubah Password</h2>
                                <p className="text-sm text-muted-foreground">Password baru minimal 8 karakter.</p>
                            </div>

                            <div>
                                <Label htmlFor="password">Password Baru</Label>
                                <Input id="password" type="password" value={passwordForm.data.password} onChange={(event) => passwordForm.setData('password', event.target.value)} />
                                <InputError className="mt-2" message={passwordForm.errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input id="password_confirmation" type="password" value={passwordForm.data.password_confirmation} onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)} />
                                <InputError className="mt-2" message={passwordForm.errors.password_confirmation} />
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="submit" disabled={passwordForm.processing}>Update Password</Button>
                            </div>
                        </div>
                    </form>
                ) : null}
            </div>
        </AppLayout>
    );
}
