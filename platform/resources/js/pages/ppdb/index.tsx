import InputError from '@/components/input-error';
import { AddressFields, type AddressOptions } from '@/components/platform/address-fields';
import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'PPDB', href: '/peserta-ppdb' },
];

interface ApplicantRecord {
    id: number;
    name: string;
    student_number: string | null;
    status: string;
    decision_notes: string | null;
    guardian_id: number | null;
    guardian: string | null;
    guardian_name: string | null;
    guardian_email: string | null;
    guardian_phone: string | null;
    relationship: string | null;
    school_class_id: number | null;
    class: string | null;
    address_line: string | null;
    province_code: string | null;
    regency_code: string | null;
    district_code: string | null;
    village_code: string | null;
    updated_at: string;
}

interface PpdbProps {
    applicants: ApplicantRecord[];
    classes: Array<{ id: number; name: string }>;
    addressOptions: AddressOptions;
}

function ApplicantCard({ applicant, classes, addressOptions }: { applicant: ApplicantRecord; classes: PpdbProps['classes']; addressOptions: AddressOptions }) {
    const form = useForm({
        name: applicant.name,
        student_number: applicant.student_number ?? '',
        school_class_id: applicant.school_class_id ? String(applicant.school_class_id) : '',
        guardian_name: applicant.guardian_name ?? '',
        guardian_email: applicant.guardian_email ?? '',
        guardian_phone: applicant.guardian_phone ?? '',
        relationship: applicant.relationship ?? 'Parent',
        address_line: applicant.address_line ?? '',
        province_code: applicant.province_code ?? '',
        regency_code: applicant.regency_code ?? '',
        district_code: applicant.district_code ?? '',
        village_code: applicant.village_code ?? '',
    });

    return (
        <div className="rounded-xl border border-border/70 p-4">
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.put(route('ppdb.update', applicant.id), { preserveScroll: true });
                }}
            >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="font-semibold">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {applicant.student_number ?? 'Identifier pending'} • Guardian: {applicant.guardian ?? 'Not set'}
                        </p>
                        <p className="text-sm text-muted-foreground">Placement: {applicant.class ?? 'Not assigned yet'} • Updated {applicant.updated_at}</p>
                        {applicant.decision_notes ? <p className="mt-2 text-sm">{applicant.decision_notes}</p> : null}
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{applicant.status}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Applicant name" />
                        <InputError className="mt-2" message={form.errors.name} />
                    </div>
                    <div>
                        <Input
                            value={form.data.student_number}
                            onChange={(event) => form.setData('student_number', event.target.value)}
                            placeholder="Student identifier (optional)"
                        />
                        <InputError className="mt-2" message={form.errors.student_number} />
                    </div>
                </div>

                <NativeSelect value={form.data.school_class_id} onChange={(event) => form.setData('school_class_id', event.target.value)}>
                    <option value="">Select placement class</option>
                    {classes.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </NativeSelect>

                <div className="grid gap-4 md:grid-cols-2">
                    <Input value={form.data.guardian_name} onChange={(event) => form.setData('guardian_name', event.target.value)} placeholder="Guardian name" />
                    <Input value={form.data.relationship} onChange={(event) => form.setData('relationship', event.target.value)} placeholder="Relationship" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input type="email" value={form.data.guardian_email} onChange={(event) => form.setData('guardian_email', event.target.value)} placeholder="Guardian email" />
                    <Input value={form.data.guardian_phone} onChange={(event) => form.setData('guardian_phone', event.target.value)} placeholder="Guardian phone" />
                </div>

                <AddressFields data={form.data} options={addressOptions} setData={(field, value) => form.setData(field, value)} />

                <div className="flex flex-wrap gap-2">
                    <Button type="submit" size="sm" disabled={form.processing}>
                        Save changes
                    </Button>
                    {applicant.status !== 'approved' && (
                        <Button type="button" size="sm" onClick={() => router.post(route('ppdb.approve', applicant.id), {}, { preserveScroll: true })}>
                            Approve
                        </Button>
                    )}
                    {applicant.status !== 'approved' && (
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                const notes = window.prompt('Reason for rejection', applicant.decision_notes ?? '');
                                if (notes !== null) {
                                    router.post(route('ppdb.reject', applicant.id), { decision_notes: notes }, { preserveScroll: true });
                                }
                            }}
                        >
                            Reject
                        </Button>
                    )}
                    {applicant.status !== 'approved' && (
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                if (window.confirm(`Delete ${applicant.name}?`)) {
                                    router.delete(route('ppdb.destroy', applicant.id), { preserveScroll: true });
                                }
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function PpdbIndex({ applicants, classes, addressOptions }: PpdbProps) {
    const form = useForm({
        name: '',
        student_number: '',
        school_class_id: '',
        guardian_name: '',
        guardian_email: '',
        guardian_phone: '',
        relationship: 'Parent',
        address_line: '',
        province_code: addressOptions.provinces[0]?.code ?? '',
        regency_code: addressOptions.regencies[0]?.code ?? '',
        district_code: addressOptions.districts[0]?.code ?? '',
        village_code: addressOptions.villages[0]?.code ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PPDB" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="PPDB management"
                    description="Capture applicants, review guardian details, assign placement classes, and promote accepted candidates into active student records."
                />

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>New applicant</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    form.post(route('ppdb.store'), {
                                        onSuccess: () =>
                                            form.reset(
                                                'name',
                                                'student_number',
                                                'school_class_id',
                                                'guardian_name',
                                                'guardian_email',
                                                'guardian_phone',
                                                'relationship',
                                                'address_line',
                                                'province_code',
                                                'regency_code',
                                                'district_code',
                                                'village_code',
                                            ),
                                    });
                                }}
                            >
                                <div>
                                    <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Applicant name" />
                                    <InputError className="mt-2" message={form.errors.name} />
                                </div>
                                <div>
                                    <Input
                                        value={form.data.student_number}
                                        onChange={(event) => form.setData('student_number', event.target.value)}
                                        placeholder="Student identifier (optional)"
                                    />
                                    <InputError className="mt-2" message={form.errors.student_number} />
                                </div>
                                <NativeSelect value={form.data.school_class_id} onChange={(event) => form.setData('school_class_id', event.target.value)}>
                                    <option value="">Select placement class</option>
                                    {classes.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input value={form.data.guardian_name} onChange={(event) => form.setData('guardian_name', event.target.value)} placeholder="Guardian name" />
                                    <Input value={form.data.relationship} onChange={(event) => form.setData('relationship', event.target.value)} placeholder="Relationship" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input type="email" value={form.data.guardian_email} onChange={(event) => form.setData('guardian_email', event.target.value)} placeholder="Guardian email" />
                                    <Input value={form.data.guardian_phone} onChange={(event) => form.setData('guardian_phone', event.target.value)} placeholder="Guardian phone" />
                                </div>
                                <AddressFields data={form.data} options={addressOptions} setData={(field, value) => form.setData(field, value)} />
                                <Button type="submit" className="w-full" disabled={form.processing}>
                                    Create applicant
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Admissions queue</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {applicants.length ? (
                                applicants.map((applicant) => <ApplicantCard key={applicant.id} applicant={applicant} classes={classes} addressOptions={addressOptions} />)
                            ) : (
                                <p className="text-sm text-muted-foreground">No PPDB records have been created yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
