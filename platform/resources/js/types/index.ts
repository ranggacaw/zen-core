import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface FlashMessages {
    success?: string | null;
    error?: string | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: FlashMessages;
    platform: {
        upload_disk: string;
        search_driver: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'registered_user';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    permissions?: Permission[];
    staff?: StaffData | null;
    [key: string]: unknown;
}

export interface StaffData {
    id: number;
    name: string;
    email: string;
    role: string;
    role_display: string;
    staff_type: string | null;
    position: string | null;
    employee_number: string | null;
    employment_status: string | null;
    avatar: string | null;
    avatar_url?: string | null;
    nik: string | null;
    education: string | null;
    specialization_subjects: number[] | null;
    phone: string | null;
    gender: string | null;
    birth_place: string | null;
    birth_date: string | null;
    nip: string | null;
    religion: string | null;
    bank_name: string | null;
    bank_account: string | null;
    join_date: string | null;
    end_date: string | null;
    decree_permanent: string | null;
    decree_contract: string | null;
    address_line: string | null;
    province_code: string | null;
    province_name: string | null;
    regency_code: string | null;
    regency_name: string | null;
    district_code: string | null;
    district_name: string | null;
    village_code: string | null;
    village_name: string | null;
    postal_code: string | null;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    users_count?: number;
}

export interface Permission {
    id: number;
    name: string;
    group_name?: string;
    description?: string;
}

export interface AddressOption {
    code: string;
    name: string;
}

export interface AddressOptions {
    provinces: AddressOption[];
    regencies: AddressOption[];
    districts: AddressOption[];
    villages: AddressOption[];
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
