import InputError from '@/components/input-error';
import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface SchoolInformationFormProps {
    mode: 'create' | 'edit';
    information: {
        id: number;
        tanggal: string;
        jenis_informasi: string;
        judul: string;
        isi: string;
        class_ids: string[];
        has_cover: boolean;
        document_name: string | null;
    } | null;
    classes: Array<{ id: number; name: string; academic_year: string }>;
}

export default function SchoolInformationForm({ mode, information, classes }: SchoolInformationFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sekolah', href: '/sekolah/informasi' },
        { title: 'Informasi', href: '/sekolah/informasi' },
        { title: mode === 'create' ? 'Tambah' : 'Edit', href: mode === 'create' ? '/sekolah/informasi/create' : `/sekolah/informasi/${information?.id}/edit` },
    ];

    const form = useForm({
        _method: mode === 'edit' ? 'put' : '',
        tanggal: information?.tanggal ?? '',
        jenis_informasi: information?.jenis_informasi ?? '',
        judul: information?.judul ?? '',
        isi: information?.isi ?? '',
        class_ids: information?.class_ids ?? [],
        cover_image: null as File | null,
        document: null as File | null,
    });

    const submitUrl = mode === 'create' ? route('sekolah.informasi.store') : route('sekolah.informasi.update', information?.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={mode === 'create' ? 'Tambah Informasi Sekolah' : 'Edit Informasi Sekolah'} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={mode === 'create' ? 'Tambah Informasi Sekolah' : 'Edit Informasi Sekolah'}
                    description="Isi tanggal, jenis informasi, target kelas, isi, gambar sampul, dan lampiran dokumen tanpa ketergantungan Blade-era seperti Select2 atau Summernote."
                />

                <Card className="max-w-4xl">
                    <CardHeader>
                        <CardTitle>{mode === 'create' ? 'Form informasi' : `Perbarui ${information?.judul}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-6"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.post(submitUrl, {
                                    forceFormData: true,
                                    preserveScroll: true,
                                });
                            }}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Tanggal</label>
                                    <Input type="date" value={form.data.tanggal} onChange={(event) => form.setData('tanggal', event.target.value)} />
                                    <InputError className="mt-1" message={form.errors.tanggal} />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Jenis informasi</label>
                                    <Input value={form.data.jenis_informasi} onChange={(event) => form.setData('jenis_informasi', event.target.value)} placeholder="Contoh: Pengumuman" />
                                    <InputError className="mt-1" message={form.errors.jenis_informasi} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-xs text-muted-foreground">Judul</label>
                                    <Input value={form.data.judul} onChange={(event) => form.setData('judul', event.target.value)} placeholder="Judul informasi sekolah" />
                                    <InputError className="mt-1" message={form.errors.judul} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-xs text-muted-foreground">Isi</label>
                                    <Textarea value={form.data.isi} onChange={(event) => form.setData('isi', event.target.value)} placeholder="Isi informasi sekolah" className="min-h-40" />
                                    <InputError className="mt-1" message={form.errors.isi} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-xs text-muted-foreground">Target kelas</label>
                                    <NativeSelect
                                        multiple
                                        value={form.data.class_ids}
                                        onChange={(event) =>
                                            form.setData(
                                                'class_ids',
                                                Array.from(event.currentTarget.selectedOptions).map((option) => option.value),
                                            )
                                        }
                                        className="min-h-40"
                                    >
                                        {classes.map((schoolClass) => (
                                            <option key={schoolClass.id} value={schoolClass.id}>
                                                {schoolClass.name} ({schoolClass.academic_year})
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <InputError className="mt-1" message={form.errors.class_ids} />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Gambar sampul</label>
                                    <Input type="file" accept="image/*" onChange={(event) => form.setData('cover_image', event.target.files?.[0] ?? null)} />
                                    {information?.has_cover ? <p className="mt-1 text-xs text-muted-foreground">Gambar sampul sudah tersimpan untuk record ini.</p> : null}
                                    <InputError className="mt-1" message={form.errors.cover_image} />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Dokumen pendukung</label>
                                    <Input type="file" onChange={(event) => form.setData('document', event.target.files?.[0] ?? null)} />
                                    {information?.document_name ? <p className="mt-1 text-xs text-muted-foreground">Dokumen saat ini: {information.document_name}</p> : null}
                                    <InputError className="mt-1" message={form.errors.document} />
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('sekolah.informasi.index')}>Batal</Link>
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    {mode === 'create' ? 'Simpan informasi' : 'Simpan perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
