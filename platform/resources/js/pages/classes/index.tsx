import { PageHeader } from '@/components/platform/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Classes', href: '/classes' },
];

interface ClassesProps {
    classes: Array<{ id: number; name: string; grade_level: string; academic_year: string; student_count: number; teacher_count: number }>;
    selectedClass: {
        id: number;
        name: string;
        grade_level: string;
        academic_year: string;
        room_name: string | null;
        students: Array<{ id: number; name: string; student_number: string }>;
        teachers: Array<{ id: number; staff: string | null; subject_name: string | null; is_homeroom: boolean }>;
        schedules: Array<{ id: number; day_of_week: string; subject_name: string; time: string; teacher: string | null }>;
        indicators: Array<{ id: number; code: string; name: string; subject_name: string; semester: string; status: string }>;
        assessments: Array<{ id: number; student: string | null; indicator: string | null; subject_name: string; semester: string; score: string }>;
    } | null;
    staff: Array<{ id: number; name: string; role: string }>;
}

export default function ClassesIndex({ classes, selectedClass, staff }: ClassesProps) {
    const role = usePage<SharedData>().props.auth.user?.role;

    const classForm = useForm({ name: '', grade_level: '', academic_year: '', room_name: '' });
    const teacherForm = useForm({ staff_id: '', subject_name: '', is_homeroom: false as boolean });
    const scheduleForm = useForm({ staff_id: '', day_of_week: 'Monday', subject_name: '', starts_at: '07:30', ends_at: '09:00' });
    const indicatorForm = useForm({ subject_name: '', semester: 'Semester 1', code: '', name: '', status: 'complete' });
    const assessmentForm = useForm({ student_id: '', academic_indicator_id: '', score: '' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Academic operations"
                    description="Run class workspaces with students, teachers, schedules, indicators, and controlled score entry."
                    actions={
                        <NativeSelect
                            value={selectedClass?.id ?? ''}
                            onChange={(event) => router.get(route('classes.index'), { class: event.target.value })}
                            className="min-w-56"
                        >
                            <option value="">Select a class workspace</option>
                            {classes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </NativeSelect>
                    }
                />

                {role === 'admin' ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create class workspace</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="grid gap-4 md:grid-cols-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    classForm.post(route('classes.store'), { onSuccess: () => classForm.reset() });
                                }}
                            >
                                <Input value={classForm.data.name} onChange={(event) => classForm.setData('name', event.target.value)} placeholder="Class name" />
                                <Input
                                    value={classForm.data.grade_level}
                                    onChange={(event) => classForm.setData('grade_level', event.target.value)}
                                    placeholder="Grade level"
                                />
                                <Input
                                    value={classForm.data.academic_year}
                                    onChange={(event) => classForm.setData('academic_year', event.target.value)}
                                    placeholder="Academic year"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        value={classForm.data.room_name}
                                        onChange={(event) => classForm.setData('room_name', event.target.value)}
                                        placeholder="Room"
                                    />
                                    <Button type="submit">Create</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : null}

                {selectedClass ? (
                    <>
                        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {selectedClass.name} • {selectedClass.grade_level}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-xl border border-border/60 p-4">
                                        <p className="text-sm text-muted-foreground">Academic year</p>
                                        <p className="font-semibold">{selectedClass.academic_year}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">Room</p>
                                        <p className="font-semibold">{selectedClass.room_name ?? 'Not assigned'}</p>
                                    </div>
                                    <div className="rounded-xl border border-border/60 p-4">
                                        <p className="text-sm text-muted-foreground">Students</p>
                                        <p className="font-semibold">{selectedClass.students.length}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">Teachers</p>
                                        <p className="font-semibold">{selectedClass.teachers.length}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Teacher assignments</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {selectedClass.teachers.map((assignment) => (
                                        <div key={assignment.id} className="rounded-xl border border-border/60 p-3 text-sm">
                                            <p className="font-medium">{assignment.staff}</p>
                                            <p className="text-muted-foreground">
                                                {assignment.subject_name ?? 'All subjects'} {assignment.is_homeroom ? '• Homeroom' : ''}
                                            </p>
                                        </div>
                                    ))}
                                    <form
                                        className="space-y-3 border-t border-border/60 pt-3"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            teacherForm.post(route('classes.teachers.store', selectedClass.id), { onSuccess: () => teacherForm.reset('staff_id', 'subject_name') });
                                        }}
                                    >
                                        <NativeSelect value={teacherForm.data.staff_id} onChange={(event) => teacherForm.setData('staff_id', event.target.value)}>
                                            <option value="">Assign staff member</option>
                                            {staff.map((member) => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name} • {member.role}
                                                </option>
                                            ))}
                                        </NativeSelect>
                                        <Input
                                            value={teacherForm.data.subject_name}
                                            onChange={(event) => teacherForm.setData('subject_name', event.target.value)}
                                            placeholder="Subject name"
                                        />
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={teacherForm.data.is_homeroom}
                                                onChange={(event) => teacherForm.setData('is_homeroom', event.target.checked)}
                                            />
                                            Mark as homeroom teacher
                                        </label>
                                        <Button type="submit" className="w-full">Add assignment</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Students and schedules</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-xl border border-border/60 p-4">
                                        <h3 className="mb-3 font-medium">Enrolled students</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            {selectedClass.students.map((student) => (
                                                <div key={student.id} className="flex items-center justify-between">
                                                    <span>{student.name}</span>
                                                    <span>{student.student_number}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-border/60 p-4">
                                        <h3 className="mb-3 font-medium">Weekly schedule</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            {selectedClass.schedules.map((schedule) => (
                                                <div key={schedule.id}>
                                                    {schedule.day_of_week} • {schedule.subject_name} • {schedule.time} • {schedule.teacher ?? 'TBA'}
                                                </div>
                                            ))}
                                        </div>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                scheduleForm.post(route('classes.schedules.store', selectedClass.id), { onSuccess: () => scheduleForm.reset('subject_name') });
                                            }}
                                        >
                                            <NativeSelect value={scheduleForm.data.staff_id} onChange={(event) => scheduleForm.setData('staff_id', event.target.value)}>
                                                <option value="">Teacher</option>
                                                {staff.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <Input
                                                value={scheduleForm.data.subject_name}
                                                onChange={(event) => scheduleForm.setData('subject_name', event.target.value)}
                                                placeholder="Subject"
                                            />
                                            <Input value={scheduleForm.data.day_of_week} onChange={(event) => scheduleForm.setData('day_of_week', event.target.value)} />
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input type="time" value={scheduleForm.data.starts_at} onChange={(event) => scheduleForm.setData('starts_at', event.target.value)} />
                                                <Input type="time" value={scheduleForm.data.ends_at} onChange={(event) => scheduleForm.setData('ends_at', event.target.value)} />
                                            </div>
                                            <Button type="submit" className="md:col-span-2">Add schedule</Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Indicators and scores</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-xl border border-border/60 p-4">
                                        <h3 className="mb-3 font-medium">Indicators</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            {selectedClass.indicators.map((indicator) => (
                                                <div key={indicator.id}>
                                                    {indicator.code} • {indicator.subject_name} • {indicator.name} • {indicator.status}
                                                </div>
                                            ))}
                                        </div>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                indicatorForm.post(route('classes.indicators.store', selectedClass.id), { onSuccess: () => indicatorForm.reset('code', 'name', 'subject_name') });
                                            }}
                                        >
                                            <Input
                                                value={indicatorForm.data.subject_name}
                                                onChange={(event) => indicatorForm.setData('subject_name', event.target.value)}
                                                placeholder="Subject"
                                            />
                                            <Input value={indicatorForm.data.semester} onChange={(event) => indicatorForm.setData('semester', event.target.value)} placeholder="Semester" />
                                            <Input value={indicatorForm.data.code} onChange={(event) => indicatorForm.setData('code', event.target.value)} placeholder="Code" />
                                            <Input value={indicatorForm.data.name} onChange={(event) => indicatorForm.setData('name', event.target.value)} placeholder="Indicator name" />
                                            <NativeSelect value={indicatorForm.data.status} onChange={(event) => indicatorForm.setData('status', event.target.value)}>
                                                <option value="complete">Complete</option>
                                                <option value="incomplete">Incomplete</option>
                                            </NativeSelect>
                                            <Button type="submit">Add indicator</Button>
                                        </form>
                                    </div>
                                    <div className="rounded-xl border border-border/60 p-4">
                                        <h3 className="mb-3 font-medium">Assessment entries</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            {selectedClass.assessments.map((assessment) => (
                                                <div key={assessment.id}>
                                                    {assessment.student} • {assessment.indicator ?? assessment.subject_name} • {assessment.score}
                                                </div>
                                            ))}
                                        </div>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                assessmentForm.post(route('classes.assessments.store', selectedClass.id), { onSuccess: () => assessmentForm.reset('student_id', 'academic_indicator_id', 'score') });
                                            }}
                                        >
                                            <NativeSelect value={assessmentForm.data.student_id} onChange={(event) => assessmentForm.setData('student_id', event.target.value)}>
                                                <option value="">Student</option>
                                                {selectedClass.students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {student.name}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <NativeSelect
                                                value={assessmentForm.data.academic_indicator_id}
                                                onChange={(event) => assessmentForm.setData('academic_indicator_id', event.target.value)}
                                            >
                                                <option value="">Indicator</option>
                                                {selectedClass.indicators.map((indicator) => (
                                                    <option key={indicator.id} value={indicator.id}>
                                                        {indicator.code} • {indicator.subject_name} • {indicator.name} • {indicator.semester}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                            <Input value={assessmentForm.data.score} onChange={(event) => assessmentForm.setData('score', event.target.value)} placeholder="Score" />
                                            <Button type="submit" className="md:col-span-2">Record score</Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-sm text-muted-foreground">No class workspace is available for this role yet.</CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
