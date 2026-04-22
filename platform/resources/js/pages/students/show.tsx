import InputError from '@/components/input-error';
import { PageHeader } from '@/components/platform/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Peserta Didik', href: '/peserta-murid' },
    { title: 'Detail', href: '#' },
];

interface StudentShowProps {
    student: {
        id: number;
        name: string;
        nickname: string | null;
        student_number: string;
        religion: string | null;
        phone: string | null;
        email: string | null;
        avatar: string | null;
        birth_place: string | null;
        birth_date: string | null;
        gender: string | null;
        child_number: string | null;
        child_of_total: string | null;
        citizenship: string | null;
        join_date: string | null;
        end_date: string | null;
        postal_code: string | null;
        domicile_address: string | null;
        status: string;
        address_line: string | null;
        province_name: string | null;
        regency_name: string | null;
        district_name: string | null;
        village_name: string | null;
        guardian: {
            name: string;
            relationship: string;
            phone: string | null;
            email: string | null;
            address_line: string | null;
            province_name: string | null;
            regency_name: string | null;
            district_name: string | null;
            village_name: string | null;
        } | null;
        school_class: {
            name: string;
            grade_level: string;
            academic_year: string;
            room_name: string | null;
        } | null;
        ppdb: {
            status: string;
            decision_notes: string | null;
        } | null;
    };
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-sm">{value || '-'}</p>
        </div>
    );
}

export default function StudentShow({ student }: StudentShowProps) {
    const photoForm = useForm({
        avatar: null as File | null,
    });
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(student.avatar);

    useEffect(() => {
        setAvatarPreviewUrl(student.avatar);
    }, [student.avatar]);

    useEffect(() => {
        if (!photoForm.data.avatar) {
            return;
        }

        const objectUrl = URL.createObjectURL(photoForm.data.avatar);
        setAvatarPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [photoForm.data.avatar]);

    const hasPendingAvatar = photoForm.data.avatar !== null;
    const avatarSrc = avatarPreviewUrl ?? 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Peserta Didik - ${student.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title={student.name}
                    description="Halaman detail hanya-baca untuk data peserta didik, keluarga, alamat, dan status PPDB."
                />

                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil peserta</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <DetailRow label="Nama lengkap" value={student.name} />
                                <DetailRow label="Nama panggilan" value={student.nickname} />
                                <DetailRow label="NIS" value={student.student_number} />
                                <DetailRow label="Status siswa" value={student.status} />
                                <DetailRow label="Tempat lahir" value={student.birth_place} />
                                <DetailRow label="Tanggal lahir" value={student.birth_date} />
                                <DetailRow label="Gender" value={student.gender} />
                                <DetailRow label="Agama" value={student.religion} />
                                <DetailRow label="Telepon" value={student.phone} />
                                <DetailRow label="Email" value={student.email} />
                                <DetailRow label="Anak ke" value={student.child_number} />
                                <DetailRow label="Dari bersaudara" value={student.child_of_total} />
                                <DetailRow label="Kewarganegaraan" value={student.citizenship} />
                                <DetailRow label="Tanggal masuk" value={student.join_date} />
                                <DetailRow label="Tanggal keluar" value={student.end_date} />
                                <DetailRow label="Kode pos" value={student.postal_code} />
                                <DetailRow label="Alamat domisili" value={student.domicile_address} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data keluarga dan kelas</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <DetailRow label="Wali murid" value={student.guardian?.name} />
                                <DetailRow label="Hubungan" value={student.guardian?.relationship} />
                                <DetailRow label="Telepon wali" value={student.guardian?.phone} />
                                <DetailRow label="Email wali" value={student.guardian?.email} />
                                <DetailRow label="Kelas" value={student.school_class?.name} />
                                <DetailRow label="Jenjang" value={student.school_class?.grade_level} />
                                <DetailRow label="Tahun ajaran" value={student.school_class?.academic_year} />
                                <DetailRow label="Ruang" value={student.school_class?.room_name} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Alamat</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <DetailRow label="Alamat peserta" value={student.address_line} />
                                <DetailRow label="Provinsi" value={student.province_name} />
                                <DetailRow label="Kabupaten/Kota" value={student.regency_name} />
                                <DetailRow label="Kecamatan" value={student.district_name} />
                                <DetailRow label="Kelurahan" value={student.village_name} />
                                <DetailRow label="Alamat wali" value={student.guardian?.address_line} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status PPDB</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Badge variant={student.ppdb?.status === 'rejected' ? 'destructive' : student.ppdb ? 'default' : 'outline'}>
                                    {student.ppdb?.status ?? 'non-ppdb'}
                                </Badge>
                                <p className="text-sm text-muted-foreground">{student.ppdb?.decision_notes ?? 'Belum ada catatan PPDB untuk peserta ini.'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Foto profil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center py-2">
                                    <img
                                        src={avatarSrc}
                                        alt={`Foto profil ${student.name}`}
                                        className="h-32 w-32 rounded-full object-cover border"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {hasPendingAvatar
                                        ? 'Preview foto baru sudah ditampilkan. Klik simpan untuk memperbarui foto profil.'
                                        : student.avatar
                                          ? 'Foto profil sudah tersimpan. Upload file baru untuk menggantinya.'
                                          : 'Belum ada foto profil. Upload file untuk menyimpannya.'}
                                </p>

                                <form
                                    className="space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        photoForm.post(route('students.photo.update', student.id), {
                                            forceFormData: true,
                                            onSuccess: () => photoForm.reset(),
                                        });
                                    }}
                                >
                                    <div>
                                        <Input type="file" accept="image/*" onChange={(event) => photoForm.setData('avatar', event.target.files?.[0] ?? null)} />
                                        <InputError className="mt-2" message={photoForm.errors.avatar} />
                                    </div>

                                    <Button type="submit" disabled={photoForm.processing}>
                                        {photoForm.processing ? 'Menyimpan...' : 'Perbarui foto profil'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
