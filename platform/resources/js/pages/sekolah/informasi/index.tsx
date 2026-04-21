import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sekolah', href: '/sekolah/informasi' },
    { title: 'Informasi', href: '/sekolah/informasi' },
];

interface SchoolInformationIndexProps {
    items: Array<{
        id: number;
        tanggal: string | null;
        jenis_informasi: string;
        judul: string;
        isi_ringkas: string;
        classes: string[];
        approval_status: 'approved' | 'pending';
        approved_by: string | null;
        created_at: string | null;
        has_cover: boolean;
        document_download_url: string | null;
    }>;
    canApprove: boolean;
}

export default function SchoolInformationIndex({ items, canApprove }: SchoolInformationIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Informasi Sekolah"
                    description="Kelola informasi sekolah dengan alur Inertia yang mempertahankan tanggal publikasi, jenis informasi, target kelas, lampiran, dan persetujuan admin."
                    actions={
                        <Button asChild>
                            <Link href={route('sekolah.informasi.create')}>Tambah informasi</Link>
                        </Button>
                    }
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar informasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.length ? (
                            items.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span className="rounded-full bg-muted px-2 py-1 font-medium uppercase tracking-wide">{item.approval_status}</span>
                                                <span>{item.jenis_informasi}</span>
                                                <span>{item.tanggal ?? 'Tanggal belum diisi'}</span>
                                                <span>Dibuat {item.created_at ?? '-'}</span>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold">{item.judul}</h2>
                                                <p className="mt-1 text-sm text-muted-foreground">{item.isi_ringkas}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Target kelas: {item.classes.join(', ') || 'Belum ditentukan'}</p>
                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                {item.has_cover ? <span className="rounded-full bg-muted px-2 py-1">Gambar sampul</span> : null}
                                                {item.document_download_url ? <span className="rounded-full bg-muted px-2 py-1">Dokumen pendukung</span> : null}
                                                <span className="rounded-full bg-muted px-2 py-1">Penyetuju: {item.approved_by ?? 'Menunggu persetujuan'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 lg:justify-end">
                                            {item.document_download_url ? (
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={item.document_download_url}>Dokumen</Link>
                                                </Button>
                                            ) : null}
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={route('sekolah.informasi.edit', item.id)}>Edit</Link>
                                            </Button>
                                            {canApprove ? (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    disabled={item.approval_status === 'approved'}
                                                    onClick={() => router.post(route('sekolah.informasi.approve', item.id))}
                                                >
                                                    Setujui
                                                </Button>
                                            ) : null}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    if (window.confirm('Hapus informasi ini beserta relasi kelas dan berkasnya?')) {
                                                        router.delete(route('sekolah.informasi.destroy', item.id));
                                                    }
                                                }}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                Belum ada informasi sekolah yang disimpan.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
