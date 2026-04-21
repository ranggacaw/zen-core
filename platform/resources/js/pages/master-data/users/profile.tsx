import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Role, User } from '@/types';
import { Link, useForm, usePage, useFlash } from '@inertiajs/react';
import { useMemo } from 'react';

interface Props {
    user: User & {
        roles: Role[];
        permissions: { id: number; name: string }[];
    };
    roles: Role[];
}

export default function UserProfile() {
    const { user, roles } = usePage<Props>().props;
    const { data, setData, put, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const { data: pwData, setData: setPwData, put: putPw, errors: pwErrors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/users' },
        { title: 'Profile' },
    ], []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/master-data/users/${user.id}`);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPw(`/master-data/users/${user.id}/password`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">User Profile</h1>
                    <p className="text-muted-foreground">
                        View and update user details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={pwData.password}
                                onChange={(e) =>
                                    setPwData('password', e.target.value)
                                }
                            />
                            {pwErrors.password && (
                                <p className="text-sm text-red-500">
                                    {pwErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={pwData.password_confirmation}
                                onChange={(e) =>
                                    setPwData('password_confirmation', e.target.value)
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="submit">Update Password</Button>
                        </div>
                    </form>
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
                    <div className="space-y-2">
                        <p><strong>Roles:</strong> {user.roles?.map(r => r.name).join(', ') || '-'}</p>
                        <p><strong>Direct Permissions:</strong> {user.permissions?.map(p => p.name).join(', ') || '-'}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}