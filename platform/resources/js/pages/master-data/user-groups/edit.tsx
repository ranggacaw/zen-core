import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Role, Permission } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface Props {
    role: Role & {
        permissions: Permission[];
    };
    permissions: Permission[];
}

export default function RoleEdit() {
    const { role, permissions } = usePage<Props>().props;

    const { data, setData, put, errors } = useForm({
        name: role.name,
        description: role.description || '',
    });

    const { data: permData, setData: setPermData, put: putPerm } = useForm({
        permissions: role.permissions?.map((p: Permission) => p.id) || [],
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/user-groups' },
        { title: 'Edit Role' },
    ], []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/master-data/user-groups/${role.id}`);
    };

    const handlePermissionsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPerm(`/master-data/user-groups/${role.id}/permissions`);
    };

    const togglePermission = (permId: number) => {
        const current = permData.permissions;
        if (current.includes(permId)) {
            setPermData('permissions', current.filter((id: number) => id !== permId));
        } else {
            setPermData('permissions', [...current, permId]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Edit Role</h1>
                    <p className="text-muted-foreground">
                        Update role details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
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
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/master-data/user-groups">Cancel</Link>
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Permissions</h2>
                    <form onSubmit={handlePermissionsSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            {permissions.map((perm) => (
                                <div key={perm.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`perm-${perm.id}`}
                                        checked={permData.permissions.includes(perm.id)}
                                        onCheckedChange={() => togglePermission(perm.id)}
                                    />
                                    <Label htmlFor={`perm-${perm.id}`}>
                                        {perm.name}
                                    </Label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="submit">Save Permissions</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}