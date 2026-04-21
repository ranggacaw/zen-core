import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Staff and teachers', href: '/staff' },
];

interface StaffProps {
    staff: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        position: string;
        employee_number: string;
        employment_status: string;
        has_user_account: boolean;
    }>;
    roles: Array<{ value: string; label: string }>;
}

export default function StaffIndex({ staff, roles }: StaffProps) {
    const form = useForm({
        name: '',
        email: '',
        role: roles[0]?.value ?? 'teacher',
        position: '',
        employee_number: '',
        bank_account: '',
        create_user_account: true,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff and teachers" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Staff and teacher onboarding" description="Create teacher and staff records, then optionally provision linked user accounts with role-based access." />

                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add staff member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    form.post(route('staff.store'), { onSuccess: () => form.reset('name', 'email', 'position', 'employee_number', 'bank_account') });
                                }}
                            >
                                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Full name" />
                                <Input type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} placeholder="Email" />
                                <NativeSelect value={form.data.role} onChange={(event) => form.setData('role', event.target.value)}>
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <Input value={form.data.position} onChange={(event) => form.setData('position', event.target.value)} placeholder="Position" />
                                <Input
                                    value={form.data.employee_number}
                                    onChange={(event) => form.setData('employee_number', event.target.value)}
                                    placeholder="Employee number"
                                />
                                <Input
                                    value={form.data.bank_account}
                                    onChange={(event) => form.setData('bank_account', event.target.value)}
                                    placeholder="Bank account (optional)"
                                />
                                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        checked={form.data.create_user_account}
                                        onChange={(event) => form.setData('create_user_account', event.target.checked)}
                                    />
                                    Create linked login account with default password `password`
                                </label>
                                <Button type="submit" className="w-full">Create staff record</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Staff directory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {staff.map((member) => (
                                <div key={member.id} className="rounded-xl border border-border/70 p-4">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-semibold">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {member.email} • {member.position}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {member.role} • {member.employee_number} • {member.employment_status}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {member.has_user_account ? 'Linked login account ready' : 'No login account linked yet'}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
