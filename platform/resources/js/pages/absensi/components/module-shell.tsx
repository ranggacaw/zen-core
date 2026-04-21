import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type AbsensiPage = 'peserta-didik' | 'peserta-didik-list';

interface AbsensiModuleShellProps {
    title: string;
    description: string;
    activePage: AbsensiPage;
    children: ReactNode;
}

const pageLinks: Array<{ key: AbsensiPage; label: string; href: string }> = [
    { key: 'peserta-didik', label: 'Absensi Peserta Didik', href: '/absensi/peserta-didik' },
    { key: 'peserta-didik-list', label: 'Absensi Peserta Didik List', href: '/absensi/peserta-didik-list' },
];

export default function AbsensiModuleShell({ title, description, activePage, children }: AbsensiModuleShellProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Absensi', href: '/absensi/peserta-didik' },
        { title, href: pageLinks.find((page) => page.key === activePage)?.href ?? '/absensi/peserta-didik' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader title={title} description={description} />

                <div className="flex flex-wrap gap-2">
                    {pageLinks.map((page) => (
                        <Button key={page.key} variant={page.key === activePage ? 'default' : 'outline'} asChild>
                            <Link href={page.href} prefetch>
                                {page.label}
                            </Link>
                        </Button>
                    ))}
                </div>

                {children}
            </div>
        </AppLayout>
    );
}
