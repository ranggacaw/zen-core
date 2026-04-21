import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type TabKey = 'overview' | 'murid' | 'guru' | 'jadwal' | 'kelas-harian' | 'tugas' | 'indikator' | 'raport';

interface ClassListItem {
    id: number;
    name: string;
    grade_level: string;
    academic_year: string;
    room_name: string | null;
    student_count: number;
    teacher_count: number;
    task_count: number;
    journal_count: number;
    homeroom_teacher: string | null;
}

interface TeacherOption {
    id: number;
    name: string;
    position?: string;
}

interface RoomOption {
    id: number;
    name: string;
}

interface TeacherAssignment {
    id: number;
    staff_id: number;
    staff_name: string | null;
    subject_name: string | null;
    is_homeroom: boolean;
}

interface ScheduleItem {
    id: number;
    class_teacher_assignment_id: number | null;
    semester: string;
    day_of_week: string;
    subject_name: string;
    staff_name: string | null;
    starts_at: string;
    ends_at: string;
}

interface DailyJournalItem {
    id: number;
    entry_date: string | null;
    content: string;
}

interface TaskItem {
    id: number;
    class_teacher_assignment_id: number | null;
    title: string;
    description: string | null;
    due_on: string | null;
    subject_name: string | null;
    staff_name: string | null;
}

interface IndicatorItem {
    id: number;
    subject_name: string;
    semester: string;
    code: string;
    name: string;
    status: string;
}

interface AssessmentItem {
    id: number;
    student: string | null;
    indicator: string | null;
    subject_name: string;
    semester: string;
    score: string;
    teacher: string | null;
}

interface StudentItem {
    id: number;
    name: string;
    student_number: string;
}

interface SelectedClass {
    id: number;
    name: string;
    grade_level: string;
    academic_year: string;
    room_name: string | null;
    homeroom_teacher_id: number | null;
    students: StudentItem[];
    teachers: TeacherAssignment[];
    schedules: ScheduleItem[];
    daily_journals: DailyJournalItem[];
    tasks: TaskItem[];
    indicators: IndicatorItem[];
    assessments: AssessmentItem[];
    report_links: {
        csv: string;
        print: string;
    };
}

interface RombonganBelajarProps {
    classes: ClassListItem[];
    selectedClass: SelectedClass | null;
    lookups: {
        gradeLevels: string[];
        teachers: TeacherOption[];
        rooms: RoomOption[];
    };
    routes: {
        index: string;
        store: string;
    };
}

export default function RombonganBelajarIndex({ classes, selectedClass, lookups, routes }: RombonganBelajarProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [isEditingClass, setIsEditingClass] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<TeacherAssignment | null>(null);
    const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
    const [editingJournal, setEditingJournal] = useState<DailyJournalItem | null>(null);
    const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
    const [editingIndicator, setEditingIndicator] = useState<IndicatorItem | null>(null);

    const classForm = useForm({
        name: '',
        grade_level: 'Grade 1',
        academic_year: '',
        room_id: '',
        homeroom_teacher_id: '',
    });
    const teacherForm = useForm({ staff_id: '', subject_name: '', is_homeroom: false });
    const scheduleForm = useForm({ class_teacher_assignment_id: '', semester: 'Semester 1', day_of_week: 'Monday', starts_at: '07:30', ends_at: '09:00' });
    const journalForm = useForm({ entry_date: '', content: '' });
    const taskForm = useForm({ class_teacher_assignment_id: '', title: '', description: '', due_on: '' });
    const indicatorForm = useForm({ subject_name: '', semester: 'Semester 1', code: '', name: '', status: 'active' });
    const assessmentForm = useForm({ student_id: '', academic_indicator_id: '', score: '' });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Ruangan', href: '/data-ruangan/rombongan-belajar' },
        { title: 'Rombongan Belajar', href: '/data-ruangan/rombongan-belajar' },
    ];

    const classEditKey = `${isEditingClass}-${selectedClass?.id ?? 'none'}-${lookups.rooms.length}-${lookups.gradeLevels[0]}`;

    useEffect(() => {
        if (selectedClass && isEditingClass) {
            const room = lookups.rooms.find((item) => item.name === selectedClass.room_name);

            classForm.setData({
                name: selectedClass.name,
                grade_level: selectedClass.grade_level,
                academic_year: selectedClass.academic_year,
                room_id: room ? String(room.id) : '',
                homeroom_teacher_id: selectedClass.homeroom_teacher_id ? String(selectedClass.homeroom_teacher_id) : '',
            });

            return;
        }

        classForm.reset();
        classForm.setData('grade_level', lookups.gradeLevels[0] ?? 'Grade 1');
    }, [classEditKey]);

    const teacherEditKey = editingTeacher?.id?.toString() ?? 'none';
    useEffect(() => {
        if (!editingTeacher) {
            teacherForm.reset();
            return;
        }

        teacherForm.setData({
            staff_id: String(editingTeacher.staff_id),
            subject_name: editingTeacher.subject_name ?? '',
            is_homeroom: editingTeacher.is_homeroom,
        });
    }, [teacherEditKey]);

    const scheduleEditKey = editingSchedule?.id?.toString() ?? 'none';
    useEffect(() => {
        if (!editingSchedule) {
            scheduleForm.reset();
            scheduleForm.setData({ class_teacher_assignment_id: '', semester: 'Semester 1', day_of_week: 'Monday', starts_at: '07:30', ends_at: '09:00' });
            return;
        }

        scheduleForm.setData({
            class_teacher_assignment_id: editingSchedule.class_teacher_assignment_id ? String(editingSchedule.class_teacher_assignment_id) : '',
            semester: editingSchedule.semester,
            day_of_week: editingSchedule.day_of_week,
            starts_at: editingSchedule.starts_at,
            ends_at: editingSchedule.ends_at,
        });
    }, [scheduleEditKey]);

    const journalEditKey = editingJournal?.id?.toString() ?? 'none';
    useEffect(() => {
        if (!editingJournal) {
            journalForm.reset();
            return;
        }

        journalForm.setData({
            entry_date: editingJournal.entry_date ?? '',
            content: editingJournal.content,
        });
    }, [journalEditKey]);

    const taskEditKey = editingTask?.id?.toString() ?? 'none';
    useEffect(() => {
        if (!editingTask) {
            taskForm.reset();
            return;
        }

        taskForm.setData({
            class_teacher_assignment_id: editingTask.class_teacher_assignment_id ? String(editingTask.class_teacher_assignment_id) : '',
            title: editingTask.title,
            description: editingTask.description ?? '',
            due_on: editingTask.due_on ?? '',
        });
    }, [taskEditKey]);

    const indicatorEditKey = editingIndicator?.id?.toString() ?? 'none';
    useEffect(() => {
        if (!editingIndicator) {
            indicatorForm.reset();
            indicatorForm.setData({ subject_name: '', semester: 'Semester 1', code: '', name: '', status: 'active' });
            return;
        }

        indicatorForm.setData({
            subject_name: editingIndicator.subject_name,
            semester: editingIndicator.semester,
            code: editingIndicator.code,
            name: editingIndicator.name,
            status: editingIndicator.status,
        });
    }, [indicatorEditKey]);

    const resetClassEdit = () => setIsEditingClass(false);

    const tabOptions: Array<{ key: TabKey; label: string }> = [
        { key: 'overview', label: 'Overview' },
        { key: 'murid', label: 'Murid' },
        { key: 'guru', label: 'Guru' },
        { key: 'jadwal', label: 'Jadwal' },
        { key: 'kelas-harian', label: 'Kelas Harian' },
        { key: 'tugas', label: 'Tugas' },
        { key: 'indikator', label: 'Indikator' },
        { key: 'raport', label: 'Raport' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rombongan Belajar" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <PageHeader
                    title="Rombongan Belajar"
                    description="Run the class workspace clone with overview, murid, guru assignments, jadwal, kelas harian, tugas, indikator, and raport context."
                    actions={
                        isEditingClass ? (
                            <Button variant="outline" className="gap-2" onClick={resetClassEdit}>
                                <X className="h-4 w-4" /> Cancel class edit
                            </Button>
                        ) : null
                    }
                />

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card className="space-y-4 p-6">
                        <div>
                            <h2 className="text-lg font-semibold">{isEditingClass ? 'Edit rombongan belajar' : 'Create rombongan belajar'}</h2>
                            <p className="text-sm text-muted-foreground">Use shared teacher and ruangan lookups instead of Blade-era AJAX widgets.</p>
                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();

                                if (isEditingClass && selectedClass) {
                                    classForm.put(route('data-ruangan.rombongan-belajar.update', selectedClass.id), {
                                        preserveScroll: true,
                                        onSuccess: () => setIsEditingClass(false),
                                    });

                                    return;
                                }

                                classForm.post(routes.store, {
                                    preserveScroll: true,
                                    onSuccess: () => classForm.reset(),
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Class name</label>
                                <Input value={classForm.data.name} onChange={(event) => classForm.setData('name', event.target.value)} placeholder="Nama kelas" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Grade level</label>
                                    <NativeSelect value={classForm.data.grade_level} onChange={(event) => classForm.setData('grade_level', event.target.value)}>
                                        {lookups.gradeLevels.map((gradeLevel) => (
                                            <option key={gradeLevel} value={gradeLevel}>
                                                {gradeLevel}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Academic year</label>
                                    <Input value={classForm.data.academic_year} onChange={(event) => classForm.setData('academic_year', event.target.value)} placeholder="2025/2026" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Assigned room</label>
                                    <NativeSelect value={classForm.data.room_id} onChange={(event) => classForm.setData('room_id', event.target.value)}>
                                        <option value="">Select room</option>
                                        {lookups.rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Homeroom teacher</label>
                                    <NativeSelect value={classForm.data.homeroom_teacher_id} onChange={(event) => classForm.setData('homeroom_teacher_id', event.target.value)}>
                                        <option value="">Select homeroom teacher</option>
                                        {lookups.teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Plus className="h-4 w-4" /> {isEditingClass ? 'Save class' : 'Create class'}
                            </Button>
                        </form>
                    </Card>

                    <Card className="space-y-4 p-6">
                        <div>
                            <h2 className="text-lg font-semibold">Class workspace list</h2>
                            <p className="text-sm text-muted-foreground">Select a record to load its nested workspace without leaving the route namespace.</p>
                        </div>

                        <div className="space-y-3">
                            {classes.length === 0 ? (
                                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No rombongan belajar records yet.</div>
                            ) : (
                                classes.map((schoolClass) => (
                                    <div key={schoolClass.id} className={`rounded-xl border p-4 ${selectedClass?.id === schoolClass.id ? 'border-primary' : ''}`}>
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-1">
                                                <p className="font-semibold">{schoolClass.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {schoolClass.grade_level} • {schoolClass.academic_year}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {schoolClass.room_name ?? 'No room'} • {schoolClass.homeroom_teacher ?? 'No homeroom teacher'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {schoolClass.student_count} murid • {schoolClass.teacher_count} guru • {schoolClass.task_count} tugas • {schoolClass.journal_count} jurnal
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" onClick={() => router.get(routes.index, { class: schoolClass.id })}>
                                                    Open
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        router.get(routes.index, { class: schoolClass.id }, {
                                                            onSuccess: () => setIsEditingClass(true),
                                                        });
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (window.confirm(`Delete ${schoolClass.name}?`)) {
                                                            router.delete(route('data-ruangan.rombongan-belajar.destroy', schoolClass.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {selectedClass ? (
                    <>
                        <Card className="space-y-4 p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">{selectedClass.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedClass.grade_level} • {selectedClass.academic_year} • {selectedClass.room_name ?? 'No room assigned'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {tabOptions.map((tab) => (
                                        <Button
                                            key={tab.key}
                                            variant={activeTab === tab.key ? 'default' : 'outline'}
                                            onClick={() => setActiveTab(tab.key)}
                                        >
                                            {tab.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {activeTab === 'overview' ? (
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="rounded-xl border p-4">
                                        <p className="text-sm text-muted-foreground">Murid</p>
                                        <p className="text-2xl font-semibold">{selectedClass.students.length}</p>
                                    </div>
                                    <div className="rounded-xl border p-4">
                                        <p className="text-sm text-muted-foreground">Guru</p>
                                        <p className="text-2xl font-semibold">{selectedClass.teachers.length}</p>
                                    </div>
                                    <div className="rounded-xl border p-4">
                                        <p className="text-sm text-muted-foreground">Jadwal</p>
                                        <p className="text-2xl font-semibold">{selectedClass.schedules.length}</p>
                                    </div>
                                    <div className="rounded-xl border p-4">
                                        <p className="text-sm text-muted-foreground">Indikator aktif</p>
                                        <p className="text-2xl font-semibold">{selectedClass.indicators.filter((indicator) => indicator.status === 'active').length}</p>
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === 'murid' ? (
                                <div className="space-y-3">
                                    {selectedClass.students.map((student) => (
                                        <div key={student.id} className="rounded-xl border p-4">
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.student_number}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {activeTab === 'guru' ? (
                                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-3">
                                        {selectedClass.teachers.map((teacher) => (
                                            <div key={teacher.id} className="rounded-xl border p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium">{teacher.staff_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {teacher.subject_name} {teacher.is_homeroom ? '• Wali Kelas' : ''}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingTeacher(teacher)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm(`Remove assignment for ${teacher.staff_name}?`)) {
                                                                    router.delete(route('data-ruangan.rombongan-belajar.teachers.destroy', [selectedClass.id, teacher.id]), { preserveScroll: true });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Card className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{editingTeacher ? 'Edit assignment' : 'Add assignment'}</h3>
                                            {editingTeacher ? (
                                                <Button variant="ghost" size="sm" onClick={() => setEditingTeacher(null)}>
                                                    Clear
                                                </Button>
                                            ) : null}
                                        </div>
                                        <form
                                            className="space-y-3"
                                            onSubmit={(event) => {
                                                event.preventDefault();

                                                if (editingTeacher) {
                                                    teacherForm.put(route('data-ruangan.rombongan-belajar.teachers.update', [selectedClass.id, editingTeacher.id]), {
                                                        preserveScroll: true,
                                                        onSuccess: () => setEditingTeacher(null),
                                                    });

                                                    return;
                                                }

                                                teacherForm.post(route('data-ruangan.rombongan-belajar.teachers.store', selectedClass.id), {
                                                    preserveScroll: true,
                                                    onSuccess: () => teacherForm.reset(),
                                                });
                                            }}
                                        >
                                            <NativeSelect value={teacherForm.data.staff_id} onChange={(event) => teacherForm.setData('staff_id', event.target.value)}>
                                                <option value="">Select teacher</option>
                                                {lookups.teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <Input value={teacherForm.data.subject_name} onChange={(event) => teacherForm.setData('subject_name', event.target.value)} placeholder="Subject" />
                                            <label className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" checked={teacherForm.data.is_homeroom} onChange={(event) => teacherForm.setData('is_homeroom', event.target.checked)} />
                                                Mark as homeroom teacher
                                            </label>
                                            <Button type="submit" className="w-full">{editingTeacher ? 'Save assignment' : 'Add assignment'}</Button>
                                        </form>
                                    </Card>
                                </div>
                            ) : null}

                            {activeTab === 'jadwal' ? (
                                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-3">
                                        {selectedClass.schedules.map((schedule) => (
                                            <div key={schedule.id} className="rounded-xl border p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium">{schedule.semester} • {schedule.day_of_week}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {schedule.subject_name} • {schedule.staff_name ?? 'Teacher not linked'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {schedule.starts_at} - {schedule.ends_at}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingSchedule(schedule)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm('Delete this schedule slot?')) {
                                                                    router.delete(route('data-ruangan.rombongan-belajar.schedules.destroy', [selectedClass.id, schedule.id]), { preserveScroll: true });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Card className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{editingSchedule ? 'Edit schedule slot' : 'Add schedule slot'}</h3>
                                            {editingSchedule ? <Button variant="ghost" size="sm" onClick={() => setEditingSchedule(null)}>Clear</Button> : null}
                                        </div>
                                        <form
                                            className="space-y-3"
                                            onSubmit={(event) => {
                                                event.preventDefault();

                                                if (editingSchedule) {
                                                    scheduleForm.put(route('data-ruangan.rombongan-belajar.schedules.update', [selectedClass.id, editingSchedule.id]), {
                                                        preserveScroll: true,
                                                        onSuccess: () => setEditingSchedule(null),
                                                    });

                                                    return;
                                                }

                                                scheduleForm.post(route('data-ruangan.rombongan-belajar.schedules.store', selectedClass.id), {
                                                    preserveScroll: true,
                                                    onSuccess: () => scheduleForm.reset(),
                                                });
                                            }}
                                        >
                                            <NativeSelect value={scheduleForm.data.class_teacher_assignment_id} onChange={(event) => scheduleForm.setData('class_teacher_assignment_id', event.target.value)}>
                                                <option value="">Select teacher-subject assignment</option>
                                                {selectedClass.teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.staff_name} • {teacher.subject_name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <Input value={scheduleForm.data.semester} onChange={(event) => scheduleForm.setData('semester', event.target.value)} placeholder="Semester" />
                                            <Input value={scheduleForm.data.day_of_week} onChange={(event) => scheduleForm.setData('day_of_week', event.target.value)} placeholder="Day" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input type="time" value={scheduleForm.data.starts_at} onChange={(event) => scheduleForm.setData('starts_at', event.target.value)} />
                                                <Input type="time" value={scheduleForm.data.ends_at} onChange={(event) => scheduleForm.setData('ends_at', event.target.value)} />
                                            </div>
                                            <Button type="submit" className="w-full">{editingSchedule ? 'Save slot' : 'Add slot'}</Button>
                                        </form>
                                    </Card>
                                </div>
                            ) : null}

                            {activeTab === 'kelas-harian' ? (
                                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-3">
                                        {selectedClass.daily_journals.map((journal) => (
                                            <div key={journal.id} className="rounded-xl border p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium">{journal.entry_date}</p>
                                                        <p className="text-sm text-muted-foreground">{journal.content}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingJournal(journal)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm('Delete this kelas harian entry?')) {
                                                                    router.delete(route('data-ruangan.rombongan-belajar.daily-journals.destroy', [selectedClass.id, journal.id]), { preserveScroll: true });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Card className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{editingJournal ? 'Edit kelas harian' : 'Add kelas harian'}</h3>
                                            {editingJournal ? <Button variant="ghost" size="sm" onClick={() => setEditingJournal(null)}>Clear</Button> : null}
                                        </div>
                                        <form
                                            className="space-y-3"
                                            onSubmit={(event) => {
                                                event.preventDefault();

                                                if (editingJournal) {
                                                    journalForm.put(route('data-ruangan.rombongan-belajar.daily-journals.update', [selectedClass.id, editingJournal.id]), {
                                                        preserveScroll: true,
                                                        onSuccess: () => setEditingJournal(null),
                                                    });

                                                    return;
                                                }

                                                journalForm.post(route('data-ruangan.rombongan-belajar.daily-journals.store', selectedClass.id), {
                                                    preserveScroll: true,
                                                    onSuccess: () => journalForm.reset(),
                                                });
                                            }}
                                        >
                                            <Input type="date" value={journalForm.data.entry_date} onChange={(event) => journalForm.setData('entry_date', event.target.value)} />
                                            <Textarea value={journalForm.data.content} onChange={(event) => journalForm.setData('content', event.target.value)} placeholder="Catatan kelas harian" />
                                            <Button type="submit" className="w-full">{editingJournal ? 'Save entry' : 'Add entry'}</Button>
                                        </form>
                                    </Card>
                                </div>
                            ) : null}

                            {activeTab === 'tugas' ? (
                                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-3">
                                        {selectedClass.tasks.map((task) => (
                                            <div key={task.id} className="rounded-xl border p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium">{task.title}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {task.subject_name ?? 'Subject not set'} • {task.staff_name ?? 'Teacher not set'} • {task.due_on ?? 'No due date'}
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">{task.description ?? 'No description'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm(`Delete task ${task.title}?`)) {
                                                                    router.delete(route('data-ruangan.rombongan-belajar.tasks.destroy', [selectedClass.id, task.id]), { preserveScroll: true });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Card className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{editingTask ? 'Edit task' : 'Add task'}</h3>
                                            {editingTask ? <Button variant="ghost" size="sm" onClick={() => setEditingTask(null)}>Clear</Button> : null}
                                        </div>
                                        <form
                                            className="space-y-3"
                                            onSubmit={(event) => {
                                                event.preventDefault();

                                                if (editingTask) {
                                                    taskForm.put(route('data-ruangan.rombongan-belajar.tasks.update', [selectedClass.id, editingTask.id]), {
                                                        preserveScroll: true,
                                                        onSuccess: () => setEditingTask(null),
                                                    });

                                                    return;
                                                }

                                                taskForm.post(route('data-ruangan.rombongan-belajar.tasks.store', selectedClass.id), {
                                                    preserveScroll: true,
                                                    onSuccess: () => taskForm.reset(),
                                                });
                                            }}
                                        >
                                            <NativeSelect value={taskForm.data.class_teacher_assignment_id} onChange={(event) => taskForm.setData('class_teacher_assignment_id', event.target.value)}>
                                                <option value="">Select teacher-subject assignment</option>
                                                {selectedClass.teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.staff_name} • {teacher.subject_name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <Input value={taskForm.data.title} onChange={(event) => taskForm.setData('title', event.target.value)} placeholder="Task title" />
                                            <Input type="date" value={taskForm.data.due_on} onChange={(event) => taskForm.setData('due_on', event.target.value)} />
                                            <Textarea value={taskForm.data.description} onChange={(event) => taskForm.setData('description', event.target.value)} placeholder="Task description" />
                                            <Button type="submit" className="w-full">{editingTask ? 'Save task' : 'Add task'}</Button>
                                        </form>
                                    </Card>
                                </div>
                            ) : null}

                            {activeTab === 'indikator' ? (
                                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-3">
                                        {selectedClass.indicators.map((indicator) => (
                                            <div key={indicator.id} className="rounded-xl border p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium">{indicator.code} • {indicator.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {indicator.subject_name} • {indicator.semester} • {indicator.status}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingIndicator(indicator)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm(`Delete indicator ${indicator.code}?`)) {
                                                                    router.delete(route('data-ruangan.rombongan-belajar.indicators.destroy', [selectedClass.id, indicator.id]), { preserveScroll: true });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Card className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{editingIndicator ? 'Edit indikator' : 'Add indikator'}</h3>
                                            {editingIndicator ? <Button variant="ghost" size="sm" onClick={() => setEditingIndicator(null)}>Clear</Button> : null}
                                        </div>
                                        <form
                                            className="space-y-3"
                                            onSubmit={(event) => {
                                                event.preventDefault();

                                                if (editingIndicator) {
                                                    indicatorForm.put(route('data-ruangan.rombongan-belajar.indicators.update', [selectedClass.id, editingIndicator.id]), {
                                                        preserveScroll: true,
                                                        onSuccess: () => setEditingIndicator(null),
                                                    });

                                                    return;
                                                }

                                                indicatorForm.post(route('data-ruangan.rombongan-belajar.indicators.store', selectedClass.id), {
                                                    preserveScroll: true,
                                                    onSuccess: () => indicatorForm.reset(),
                                                });
                                            }}
                                        >
                                            <Input value={indicatorForm.data.subject_name} onChange={(event) => indicatorForm.setData('subject_name', event.target.value)} placeholder="Subject" />
                                            <Input value={indicatorForm.data.semester} onChange={(event) => indicatorForm.setData('semester', event.target.value)} placeholder="Semester" />
                                            <Input value={indicatorForm.data.code} onChange={(event) => indicatorForm.setData('code', event.target.value)} placeholder="Code" />
                                            <Input value={indicatorForm.data.name} onChange={(event) => indicatorForm.setData('name', event.target.value)} placeholder="Indicator name" />
                                            <NativeSelect value={indicatorForm.data.status} onChange={(event) => indicatorForm.setData('status', event.target.value)}>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="complete">Complete</option>
                                                <option value="incomplete">Incomplete</option>
                                            </NativeSelect>
                                            <Button type="submit" className="w-full">{editingIndicator ? 'Save indikator' : 'Add indikator'}</Button>
                                        </form>
                                    </Card>
                                </div>
                            ) : null}

                            {activeTab === 'raport' ? (
                                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Button asChild variant="outline">
                                                <Link href={selectedClass.report_links.csv}>Export CSV</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href={selectedClass.report_links.print}>Open print view</Link>
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {selectedClass.assessments.map((assessment) => (
                                                <div key={assessment.id} className="rounded-xl border p-4">
                                                    <p className="font-medium">{assessment.student}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {assessment.indicator ?? assessment.subject_name} • {assessment.semester}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Teacher: {assessment.teacher ?? 'Not recorded'}</p>
                                                    <p className="text-sm font-medium">Score: {assessment.score}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Card className="space-y-4 p-4">
                                        <div>
                                            <h3 className="font-semibold">Record raport score</h3>
                                            <p className="text-sm text-muted-foreground">Scores remain scoped to the selected class and indikator.</p>
                                        </div>
                                        <form
                                            className="space-y-3"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                assessmentForm.post(route('data-ruangan.rombongan-belajar.assessments.store', selectedClass.id), {
                                                    preserveScroll: true,
                                                    onSuccess: () => assessmentForm.reset(),
                                                });
                                            }}
                                        >
                                            <NativeSelect value={assessmentForm.data.student_id} onChange={(event) => assessmentForm.setData('student_id', event.target.value)}>
                                                <option value="">Select student</option>
                                                {selectedClass.students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {student.name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <NativeSelect value={assessmentForm.data.academic_indicator_id} onChange={(event) => assessmentForm.setData('academic_indicator_id', event.target.value)}>
                                                <option value="">Select indikator</option>
                                                {selectedClass.indicators.map((indicator) => (
                                                    <option key={indicator.id} value={indicator.id}>
                                                        {indicator.code} • {indicator.subject_name} • {indicator.name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <Input type="number" min="0" max="100" value={assessmentForm.data.score} onChange={(event) => assessmentForm.setData('score', event.target.value)} placeholder="Score" />
                                            <Button type="submit" className="w-full">Save score</Button>
                                        </form>
                                    </Card>
                                </div>
                            ) : null}
                        </Card>
                    </>
                ) : null}
            </div>
        </AppLayout>
    );
}
