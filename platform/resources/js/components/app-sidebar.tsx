import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpenCheck, BriefcaseBusiness, FileOutput, LayoutGrid, Megaphone, School, Shield, ShieldCheck, Users, WalletCards } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
        icon: ShieldCheck,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: BookOpenCheck,
    },
];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const role = page.props.auth.user?.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        ...(role === 'admin'
            ? [
                  {
                      title: 'Master Data',
                      url: '#',
                      icon: Shield,
                      isActive: page.url.startsWith('/master-data'),
                      items: [
                          { title: 'Users', url: '/master-data/users' },
                          { title: 'User Group', url: '/master-data/user-groups' },
                          { title: 'Permission', url: '/master-data/permissions' },
                      ],
                  },
                  { 
                      title: 'Data Peserta', 
                      url: '#', 
                      icon: Users,
                      isActive: page.url.startsWith('/peserta-'),
                      items: [
                          { title: 'Peserta Didik', url: '/peserta-murid' },
                          { title: 'Wali Murid', url: '/peserta-wali' },
                          { title: 'PPDB', url: '/peserta-ppdb' },
                      ]
                  },
                  {
                      title: 'Staff',
                      url: '#',
                      icon: ShieldCheck,
                      isActive: page.url.startsWith('/staff'),
                      items: [
                          { title: 'Pengajar', url: '/staff/pengajar' },
                          { title: 'Non-Pengajar', url: '/staff/non-pengajar' },
                      ],
                  },
                   {
                       title: 'Sekolah',
                       url: '#',
                       icon: School,
                       isActive: page.url.startsWith('/sekolah'),
                       items: [{ title: 'Informasi', url: '/sekolah/informasi' }],
                   },
                   {
                       title: 'Data Ruangan',
                       url: '#',
                       icon: School,
                      isActive: page.url.startsWith('/data-ruangan'),
                      items: [
                          { title: 'Rombongan Belajar', url: '/data-ruangan/rombongan-belajar' },
                          { title: 'Ruangan Belajar', url: '/data-ruangan/ruangan-belajar' },
                          { title: 'Fasilitas Sekolah', url: '/data-ruangan/fasilitas-sekolah' },
                          { title: 'Penggunaan Fasilitas', url: '/data-ruangan/penggunaan-fasilitas' },
                      ],
                  },
                  {
                      title: 'Absensi',
                      url: '#',
                      icon: LayoutGrid,
                      isActive: page.url.startsWith('/absensi') || page.url.startsWith('/attendance'),
                      items: [
                          { title: 'Absensi Peserta Didik', url: '/absensi/peserta-didik' },
                          { title: 'Absensi Peserta Didik List', url: '/absensi/peserta-didik-list' },
                      ],
                  },
                  { title: 'Communications', url: '/communications', icon: Megaphone },
                  { title: 'Rooms', url: '/resources', icon: WalletCards },
                  { title: 'Reports', url: '/reports', icon: FileOutput },
              ]
            : []),
        ...(role === 'teacher'
            ? [
                  {
                       title: 'Sekolah',
                       url: '#',
                       icon: School,
                       isActive: page.url.startsWith('/sekolah'),
                       items: [{ title: 'Informasi', url: '/sekolah/informasi' }],
                   },
                   {
                       title: 'Data Ruangan',
                       url: '#',
                       icon: School,
                      isActive: page.url.startsWith('/data-ruangan') || page.url.startsWith('/classes'),
                      items: [{ title: 'Rombongan Belajar', url: '/data-ruangan/rombongan-belajar' }],
                  },
                  {
                      title: 'Absensi',
                      url: '#',
                      icon: LayoutGrid,
                      isActive: page.url.startsWith('/absensi') || page.url.startsWith('/attendance'),
                      items: [
                          { title: 'Absensi Peserta Didik', url: '/absensi/peserta-didik' },
                          { title: 'Absensi Peserta Didik List', url: '/absensi/peserta-didik-list' },
                      ],
                  },
                  { title: 'Reports', url: '/reports', icon: FileOutput },
              ]
            : []),
        ...(role === 'registered_user' ? [{ title: 'Family workspace', url: '/dashboard', icon: BriefcaseBusiness }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {page.props.auth.user && <NavUser />}
            </SidebarFooter>
        </Sidebar>
    );
}
