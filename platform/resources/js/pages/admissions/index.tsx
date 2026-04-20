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
    { title: 'Admissions', href: '/admissions' },
];

interface Option {
    code: string;
    name: string;
}

interface AdmissionsProps {
    applicants: Array<{
        id: number;
        name: string;
        student_number: string | null;
        status: string;
        decision_notes: string | null;
        guardian: string | null;
        class: string | null;
        updated_at: string;
    }>;
    classes: Array<{ id: number; name: string }>;
    addressOptions: {
        provinces: Option[];
        regencies: Option[];
        districts: Option[];
        villages: Option[];
    };
}

export default function AdmissionsIndex({ applicants, classes, addressOptions }: AdmissionsProps) {
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
            <Head title="Admissions" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Admissions and enrollment"
                    description="Capture applicants with guardian relationships, class placement, and standardized address selections before approval."
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
                                    form.post(route('admissions.store'), { onSuccess: () => form.reset() });
                                }}
                            >
                                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Student name" />
                                <Input
                                    value={form.data.student_number}
                                    onChange={(event) => form.setData('student_number', event.target.value)}
                                    placeholder="Student identifier (optional)"
                                />
                                <NativeSelect
                                    value={form.data.school_class_id}
                                    onChange={(event) => form.setData('school_class_id', event.target.value)}
                                >
                                    <option value="">Select placement class</option>
                                    {classes.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                        value={form.data.guardian_name}
                                        onChange={(event) => form.setData('guardian_name', event.target.value)}
                                        placeholder="Guardian name"
                                    />
                                    <Input
                                        value={form.data.relationship}
                                        onChange={(event) => form.setData('relationship', event.target.value)}
                                        placeholder="Relationship"
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                        type="email"
                                        value={form.data.guardian_email}
                                        onChange={(event) => form.setData('guardian_email', event.target.value)}
                                        placeholder="Guardian email"
                                    />
                                    <Input
                                        value={form.data.guardian_phone}
                                        onChange={(event) => form.setData('guardian_phone', event.target.value)}
                                        placeholder="Guardian phone"
                                    />
                                </div>
                                <Textarea
                                    value={form.data.address_line}
                                    onChange={(event) => form.setData('address_line', event.target.value)}
                                    placeholder="Address line"
                                />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <NativeSelect value={form.data.province_code} onChange={(event) => form.setData('province_code', event.target.value)}>
                                        {addressOptions.provinces.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <NativeSelect value={form.data.regency_code} onChange={(event) => form.setData('regency_code', event.target.value)}>
                                        {addressOptions.regencies.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <NativeSelect value={form.data.district_code} onChange={(event) => form.setData('district_code', event.target.value)}>
                                        {addressOptions.districts.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <NativeSelect value={form.data.village_code} onChange={(event) => form.setData('village_code', event.target.value)}>
                                        {addressOptions.villages.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <Button type="submit" className="w-full">Create applicant</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Admissions queue</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {applicants.map((applicant) => (
                                <div key={applicant.id} className="rounded-xl border border-border/70 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="font-semibold">{applicant.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {applicant.student_number ?? 'Identifier pending'} • Guardian: {applicant.guardian ?? 'Not set'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">Placement: {applicant.class ?? 'Not assigned yet'}</p>
                                            {applicant.decision_notes ? <p className="mt-2 text-sm">{applicant.decision_notes}</p> : null}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{applicant.status}</span>
                                            <Button size="sm" onClick={() => router.post(route('admissions.approve', applicant.id))}>
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => {
                                                    const notes = window.prompt('Reason for rejection', applicant.decision_notes ?? '');
                                                    if (notes !== null) {
                                                        router.post(route('admissions.reject', applicant.id), { decision_notes: notes });
                                                    }
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
