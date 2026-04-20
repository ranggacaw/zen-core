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
    { title: 'Communications', href: '/communications' },
];

interface CommunicationsProps {
    announcements: Array<{ id: number; title: string; status: string; classes: string[]; approver: string | null; published_at: string | null }>;
    classes: Array<{ id: number; name: string }>;
}

export default function CommunicationsIndex({ announcements, classes }: CommunicationsProps) {
    const form = useForm<{ title: string; content: string; class_ids: string[]; cover_image: File | null; document: File | null }>({
        title: '',
        content: '',
        class_ids: classes.length ? [String(classes[0].id)] : [],
        cover_image: null,
        document: null,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Communications" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Communication and engagement" description="Draft governed announcements, route them through approval, and publish them to selected class audiences." />

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Draft announcement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    form.post(route('communications.store'));
                                }}
                            >
                                <Input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} placeholder="Announcement title" />
                                <Textarea value={form.data.content} onChange={(event) => form.setData('content', event.target.value)} placeholder="Announcement content" />
                                <NativeSelect
                                    multiple
                                    value={form.data.class_ids}
                                    onChange={(event) =>
                                        form.setData(
                                            'class_ids',
                                            Array.from(event.currentTarget.selectedOptions).map((option) => option.value),
                                        )
                                    }
                                    className="min-h-28"
                                >
                                    {classes.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                                <Input type="file" onChange={(event) => form.setData('cover_image', event.target.files?.[0] ?? null)} />
                                <Input type="file" onChange={(event) => form.setData('document', event.target.files?.[0] ?? null)} />
                                <Button type="submit" className="w-full">Create draft</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Approval queue</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="rounded-xl border border-border/70 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-semibold">{announcement.title}</p>
                                            <p className="text-sm text-muted-foreground">Audience: {announcement.classes.join(', ') || 'Not targeted yet'}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Approver: {announcement.approver ?? 'Pending'} • Published: {announcement.published_at ?? 'Not yet'}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">{announcement.status}</span>
                                            <Button size="sm" variant="secondary" onClick={() => router.post(route('communications.approve', announcement.id))}>
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    router.post(route('communications.publish', announcement.id), {
                                                        class_ids: classes.slice(0, 1).map((item) => item.id),
                                                    })
                                                }
                                            >
                                                Publish
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
