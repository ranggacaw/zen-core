import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginatedData, Permission } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
    permissions: Record<string, Permission[]>;
    groups: string[];
    filters: {
        search?: string;
        group?: string;
    };
}

export default function PermissionIndex() {
    const { permissions, groups, filters } = usePage<Props>().props;

    const { data, setData, get } = useForm({
        search: filters.search || '',
        group: filters.group || '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/permissions' },
        { title: 'Permissions' },
    ], []);

    const handleFilter = () => {
        get('/master-data/permissions', { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Permissions</h1>
                    <Button asChild>
                        <Link href="/master-data/permissions/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Permission
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-4 rounded-lg border bg-card p-4">
                    <div className="space-y-2">
                        <Label>Search</Label>
                        <Input
                            placeholder="Search permissions..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-[200px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Group</Label>
                        <Select
                            value={data.group}
                            onValueChange={(value) => setData('group', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Groups" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Groups</SelectItem>
                                {groups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {group}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleFilter}>Filter</Button>
                    </div>
                </div>

                {Object.keys(permissions).length === 0 ? (
                    <div className="rounded-lg border p-8 text-center">
                        <p className="text-muted-foreground">
                            No permissions found.
                        </p>
                    </div>
                ) : (
                    Object.entries(permissions).map(([groupName, perms]) => (
                        <div key={groupName} className="space-y-2">
                            <h2 className="text-lg font-semibold">{groupName || 'Ungrouped'}</h2>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {perms.map((perm) => (
                                            <TableRow key={perm.id}>
                                                <TableCell className="font-medium">
                                                    {perm.name}
                                                </TableCell>
                                                <TableCell>
                                                    {perm.description || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/master-data/permissions/${perm.id}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/master-data/permissions/${perm.id}/edit`}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}