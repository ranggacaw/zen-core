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
import { PaginatedData, Role, User } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
    users: PaginatedData<User>;
    filters: {
        user_type?: string;
        date_from?: string;
        date_to?: string;
    };
    roles: Role[];
}

export default function UserIndex() {
    const { users, filters, roles } = usePage<Props>().props;

    const { data, setData, get } = useForm({
        user_type: filters.user_type || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '/master-data/users' },
        { title: 'Users' },
    ], []);

    const handleFilter = () => {
        get('/master-data/users', { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button asChild>
                        <Link href="/master-data/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create User
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-4 rounded-lg border bg-card p-4">
                    <div className="space-y-2">
                        <Label>User Type</Label>
                        <Select
                            value={data.user_type}
                            onValueChange={(value) => setData('user_type', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Date From</Label>
                        <Input
                            type="date"
                            value={data.date_from}
                            onChange={(e) => setData('date_from', e.target.value)}
                            className="w-[180px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Date To</Label>
                        <Input
                            type="date"
                            value={data.date_to}
                            onChange={(e) => setData('date_to', e.target.value)}
                            className="w-[180px]"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleFilter}>Filter</Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-8"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 capitalize">
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.created_at
                                                ? new Date(
                                                      user.created_at
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link
                                                        href={route('master-data.users.profile', user.id)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link
                                                        href={`/master-data/users/${user.id}/edit`}
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
                                                        href={`/master-data/users/${user.id}/edit`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {users.links && (
                    <div className="flex justify-center gap-2">
                        {users.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url}>{link.label}</Link>
                                ) : (
                                    <span>{link.label}</span>
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
