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
    [key: string]: unknown;
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

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
