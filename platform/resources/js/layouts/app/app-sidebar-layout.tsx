import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { flash } = usePage<SharedData>().props;

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {(flash.success || flash.error) && (
                    <div className="px-4 pt-4 md:px-6">
                        <Alert variant={flash.error ? 'destructive' : 'default'}>
                            <AlertTitle>{flash.error ? 'Action failed' : 'Action completed'}</AlertTitle>
                            <AlertDescription>{flash.error ?? flash.success}</AlertDescription>
                        </Alert>
                    </div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
