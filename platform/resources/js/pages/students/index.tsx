import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Students', href: '/peserta-murid' },
];

interface StudentRecord {
    id: number;
    name: string;
    nickname?: string;
    student_number: string;
    religion?: string;
    phone?: string;
    email?: string;
    birth_place?: string;
    birth_date?: string;
    gender?: string;
    child_number?: string;
    child_of_total?: string;
    citizenship?: string;
    join_date?: string;
    end_date?: string;
    postal_code?: string;
    domicile_address?: string;
    status: string;
    guardian_id: number | null;
    school_class_id: number | null;
    guardian: string | null;
    relationship: string | null;
    class: string | null;
    address_line: string | null;
    province_code: string | null;
    regency_code: string | null;
    district_code: string | null;
    village_code: string | null;
    updated_at: string;
}

interface StudentIndexProps {
    students: StudentRecord[];
}

export default function StudentIndex({ students }: StudentIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and pagination logic
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.guardian && student.guardian.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    const handleExport = () => {
        // Create CSV header
        const headers = ['NO.', 'STUDENT_NUMBER', 'NAME', 'CLASS', 'GUARDIAN', 'STATUS'];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map((s, i) => 
                [i + 1, s.student_number, `"${s.name}"`, s.class ?? '-', `"${s.guardian ?? '-'}"`, s.status].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `peserta-didik-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title="Student records"
                    description="Maintain active student profiles, guardian links, class placement, and core contact details for the clone workflow."
                    actions={
                        <Button onClick={() => router.get(route('students.create'))} className="h-10 gap-2 bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm">
                            <Plus className="h-4 w-4" /> Add student
                        </Button>
                    }
                />

                <Card className="flex flex-col border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 gap-4 bg-background">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Show</span>
                            <NativeSelect 
                                className="h-9 w-20 bg-background/50" 
                                value={String(entriesPerPage)}
                                onChange={(e) => {
                                    setEntriesPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </NativeSelect>
                            <span>entries</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <label className="text-sm text-muted-foreground hidden sm:block">Search:</label>
                                <Input 
                                    className="h-9 w-full sm:w-64 bg-background/50" 
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search by name, number, guardian..."
                                />
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={handleExport}
                                className="h-9 gap-2 text-indigo-500 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:text-indigo-600 shadow-none"
                            >
                                <Download className="h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-muted/30 border-y border-border/50 text-xs text-muted-foreground/80 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">NO.</th>
                                    <th className="px-5 py-3 font-semibold">STUDENT NUMBER</th>
                                    <th className="px-5 py-3 font-semibold">NAME</th>
                                    <th className="px-5 py-3 font-semibold">CLASS</th>
                                    <th className="px-5 py-3 font-semibold">GUARDIAN</th>
                                    <th className="px-5 py-3 font-semibold">STATUS</th>
                                    <th className="px-5 py-3 font-semibold text-center">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {paginatedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                                            No student records found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStudents.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-5 py-4 text-muted-foreground">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                                            <td className="px-5 py-4 font-medium">{student.student_number}</td>
                                            <td className="px-5 py-4">{student.name}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{student.class ?? '-'}</td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {student.guardian ? (
                                                    <span className="flex flex-col">
                                                        <span>{student.guardian}</span>
                                                        <span className="text-[10px] uppercase text-muted-foreground/70">{student.relationship}</span>
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                                                    student.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                                                    student.status === 'graduated' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                        onClick={() => router.get(route('students.edit', student.id))}
                                                        title="Edit Data"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                        onClick={() => {
                                                            if (window.confirm(`Delete ${student.name}?`)) {
                                                                router.delete(route('students.destroy', student.id));
                                                            }
                                                        }}
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {totalPages > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-5 gap-4 bg-background">
                            <p className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                                Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredStudents.length)} of {filteredStudents.length} entries
                            </p>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 border-border/50 text-muted-foreground"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </Button>
                                {Array.from({ length: totalPages }).map((_, idx) => {
                                    const pageNumber = idx + 1;
                                    // simple pagination UI logic to not overflow nicely for this example
                                    if (
                                        pageNumber === 1 || 
                                        pageNumber === totalPages || 
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <Button 
                                                key={pageNumber}
                                                variant="outline" 
                                                size="sm" 
                                                className={`h-8 w-8 p-0 border-none ${
                                                    currentPage === pageNumber 
                                                        ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                }`}
                                                onClick={() => setCurrentPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 || 
                                        pageNumber === currentPage + 2
                                    ) {
                                        return <span key={pageNumber} className="px-2 text-muted-foreground">...</span>;
                                    }
                                    return null;
                                })}
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 w-8 p-0 border-border/50 text-muted-foreground"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    &raquo;
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
