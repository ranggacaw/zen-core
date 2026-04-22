import InputError from '@/components/input-error';
import { PageHeader } from '@/components/platform/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'PPDB', href: '/peserta-ppdb' },
    { title: 'Detail', href: '#' },
];

interface PpdbShowProps {
    applicant: {
        id: number;
        name: string;
        student_number: string | null;
        status: string;
        decision_notes: string | null;
        address_line: string | null;
        province_name: string | null;
        regency_name: string | null;
        district_name: string | null;
        village_name: string | null;
        guardian: {
            name: string;
            relationship: string;
            email: string | null;
            phone: string | null;
            address_line: string | null;
            province_name: string | null;
            regency_name: string | null;
            district_name: string | null;
            village_name: string | null;
        } | null;
        school_class_id: number | null;
        school_class: {
            name: string;
            grade_level: string;
            academic_year: string;
            room_name: string | null;
        } | null;
    };
    classes: Array<{ id: number; name: string; grade_level: string; academic_year: string; room_name: string | null }>;
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-sm">{value || '-'}</p>
        </div>
    );
}

export default function PpdbShow({ applicant, classes }: PpdbShowProps) {
    const approveForm = useForm({
        school_class_id: applicant.school_class_id ? String(applicant.school_class_id) : '',
    });

    const rejectForm = useForm({
        decision_notes: applicant.decision_notes ?? '',
    });

    const canReview = applicant.status !== 'approved';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PPDB - ${applicant.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title={applicant.name}
                    description="Tinjau detail PPDB secara readonly, lalu setujui dengan penempatan kelas atau tolak dengan catatan wajib."
                />

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data pendaftar</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <DetailRow label="Nama" value={applicant.name} />
                                <DetailRow label="Nomor peserta" value={applicant.student_number} />
                                <DetailRow label="Status" value={applicant.status} />
                                <DetailRow label="Kelas saat ini" value={applicant.school_class?.name} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data wali</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <DetailRow label="Nama wali" value={applicant.guardian?.name} />
                                <DetailRow label="Hubungan" value={applicant.guardian?.relationship} />
                                <DetailRow label="Email" value={applicant.guardian?.email} />
                                <DetailRow label="Telepon" value={applicant.guardian?.phone} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Alamat</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <DetailRow label="Alamat pendaftar" value={applicant.address_line} />
                                <DetailRow label="Provinsi" value={applicant.province_name} />
                                <DetailRow label="Kabupaten/Kota" value={applicant.regency_name} />
                                <DetailRow label="Kecamatan" value={applicant.district_name} />
                                <DetailRow label="Kelurahan" value={applicant.village_name} />
                                <DetailRow label="Alamat wali" value={applicant.guardian?.address_line} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status keputusan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Badge variant={applicant.status === 'rejected' ? 'destructive' : applicant.status === 'approved' ? 'default' : 'secondary'}>
                                    {applicant.status}
                                </Badge>
                                <p className="text-sm text-muted-foreground">{applicant.decision_notes ?? 'Belum ada catatan keputusan.'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Setujui PPDB</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        approveForm.post(route('ppdb.approve', applicant.id));
                                    }}
                                >
                                    <div>
                                        <NativeSelect
                                            value={approveForm.data.school_class_id}
                                            onChange={(event) => approveForm.setData('school_class_id', event.target.value)}
                                            disabled={!canReview}
                                        >
                                            <option value="">Pilih kelas</option>
                                            {classes.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} · {item.academic_year}
                                                </option>
                                            ))}
                                        </NativeSelect>
                                        <InputError className="mt-2" message={approveForm.errors.school_class_id} />
                                    </div>

                                    <Button type="submit" disabled={approveForm.processing || !canReview}>
                                        {approveForm.processing ? 'Memproses...' : 'Setujui PPDB'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tolak PPDB</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        rejectForm.post(route('ppdb.reject', applicant.id));
                                    }}
                                >
                                    <div>
                                        <Textarea
                                            value={rejectForm.data.decision_notes}
                                            onChange={(event) => rejectForm.setData('decision_notes', event.target.value)}
                                            placeholder="Tuliskan alasan penolakan"
                                            disabled={!canReview}
                                        />
                                        <InputError className="mt-2" message={rejectForm.errors.decision_notes} />
                                    </div>

                                    <Button type="submit" variant="destructive" disabled={rejectForm.processing || !canReview}>
                                        {rejectForm.processing ? 'Memproses...' : 'Tolak PPDB'}
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
