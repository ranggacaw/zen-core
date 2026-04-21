import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Permission, User } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface Props {
    user: User & {
        permissions: Permission[];
        roles: { id: number; name: string }[];
    };
    allPermissions: Permission[];
}

export default function UserPermissions() {
    const { user, allPermissions } = usePage<Props>().props;

    const { data, setData, put } = useForm({
        permissions: user.permissions?.map((p: Permission) => p.id) || [],
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/user-groups' },
        { title: 'User Permissions' },
    ], []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/master-data/user-groups/${user.id}/permissions`);
    };

    const togglePermission = (permId: number) => {
        const current = data.permissions;
        if (current.includes(permId)) {
            setData('permissions', current.filter((id: number) => id !== permId));
        } else {
            setData('permissions', [...current, permId]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">User Permissions</h1>
                    <p className="text-muted-foreground">
                        Manage direct permissions for {user.name}.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Assigned Roles: {user.roles?.map(r => r.name).join(', ') || '-'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {allPermissions.map((perm) => (
                                <div key={perm.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`perm-${perm.id}`}
                                        checked={data.permissions.includes(perm.id)}
                                        onCheckedChange={() => togglePermission(perm.id)}
                                    />
                                    <Label htmlFor={`perm-${perm.id}`}>
                                        {perm.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/master-data/user-groups">Cancel</Link>
                        </Button>
                        <Button type="submit">Save Permissions</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}