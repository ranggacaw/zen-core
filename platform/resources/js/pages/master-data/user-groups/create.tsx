import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Permission } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface Props {
    permissions: Permission[];
}

export default function RoleCreate() {
    const { permissions } = usePage<Props>().props;

    const { data, setData, post, errors } = useForm({
        name: '',
        description: '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/user-groups' },
        { title: 'Create Role' },
    ], []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/master-data/user-groups');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Create Role</h1>
                    <p className="text-muted-foreground">
                        Add a new role to the system.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter role name"
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
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/master-data/user-groups">Cancel</Link>
                        </Button>
                        <Button type="submit">Create Role</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}