<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\AcademicOperations\Models\AssessmentEntry;
use App\Domain\AcademicOperations\Models\ClassSchedule;
use App\Domain\AcademicOperations\Models\ClassTask;
use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $staff = $user?->staff;

        $classesQuery = SchoolClass::query()->withCount(['students', 'teachers']);

        if ($user?->hasRole(UserRole::Teacher) && $staff) {
            $classIds = ClassTeacherAssignment::query()->where('staff_id', $staff->id)->pluck('school_class_id');
            $classesQuery->whereIn('id', $classIds);
        }

        $classes = $classesQuery->orderBy('name')->get();
        $selectedClass = $classes->firstWhere('id', (int) $request->integer('class')) ?? $classes->first();
        $selectedClass?->load([
            'students',
            'teachers.staff',
            'schedules.staff',
            'tasks',
            'indicators',
            'assessments.student',
        ]);

        return Inertia::render('classes/index', [
            'classes' => $classes->map(fn (SchoolClass $schoolClass) => [
                'id' => $schoolClass->id,
                'name' => $schoolClass->name,
                'grade_level' => $schoolClass->grade_level,
                'academic_year' => $schoolClass->academic_year,
                'student_count' => $schoolClass->students_count,
                'teacher_count' => $schoolClass->teachers_count,
            ]),
            'selectedClass' => $selectedClass ? [
                'id' => $selectedClass->id,
                'name' => $selectedClass->name,
                'grade_level' => $selectedClass->grade_level,
                'academic_year' => $selectedClass->academic_year,
                'room_name' => $selectedClass->room_name,
                'students' => $selectedClass->students->map->only(['id', 'name', 'student_number']),
                'teachers' => $selectedClass->teachers->map(fn (ClassTeacherAssignment $assignment) => [
                    'id' => $assignment->id,
                    'staff' => $assignment->staff?->name,
                    'subject_name' => $assignment->subject_name,
                    'is_homeroom' => $assignment->is_homeroom,
                ]),
                'schedules' => $selectedClass->schedules->map(fn (ClassSchedule $schedule) => [
                    'id' => $schedule->id,
                    'day_of_week' => $schedule->day_of_week,
                    'subject_name' => $schedule->subject_name,
                    'time' => "{$schedule->starts_at}-{$schedule->ends_at}",
                    'teacher' => $schedule->staff?->name,
                ]),
                'tasks' => $selectedClass->tasks->map(fn (ClassTask $task) => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'due_on' => optional($task->due_on)?->toDateString(),
                ]),
                'indicators' => $selectedClass->indicators->map(fn (AcademicIndicator $indicator) => [
                    'id' => $indicator->id,
                    'code' => $indicator->code,
                    'name' => $indicator->name,
                    'subject_name' => $indicator->subject_name,
                    'semester' => $indicator->semester,
                    'status' => $indicator->status,
                ]),
                'assessments' => $selectedClass->assessments->map(fn (AssessmentEntry $assessment) => [
                    'id' => $assessment->id,
                    'student' => $assessment->student?->name,
                    'subject_name' => $assessment->subject_name,
                    'semester' => $assessment->semester,
                    'score' => $assessment->score,
                ]),
            ] : null,
            'staff' => Staff::query()->orderBy('name')->get(['id', 'name', 'role']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'grade_level' => ['required', 'string', 'max:100'],
            'academic_year' => ['required', 'string', 'max:100'],
            'room_name' => ['nullable', 'string', 'max:100'],
        ]);

        $schoolClass = SchoolClass::query()->create($validated);

        return redirect()->route('classes.index', ['class' => $schoolClass->id])->with('success', 'Class workspace created.');
    }

    public function assignTeacher(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'staff_id' => ['required', 'integer', 'exists:staff,id'],
            'subject_name' => ['nullable', 'string', 'max:255'],
            'is_homeroom' => ['nullable', 'boolean'],
        ]);

        ClassTeacherAssignment::query()->create([
            'school_class_id' => $schoolClass->id,
            'staff_id' => $validated['staff_id'],
            'subject_name' => $validated['subject_name'] ?? null,
            'is_homeroom' => $validated['is_homeroom'] ?? false,
        ]);

        return back()->with('success', 'Teacher assignment added.');
    }

    public function storeSchedule(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'staff_id' => ['nullable', 'integer', 'exists:staff,id'],
            'day_of_week' => ['required', 'string', 'max:20'],
            'subject_name' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date_format:H:i'],
            'ends_at' => ['required', 'date_format:H:i'],
        ]);

        $schoolClass->schedules()->create($validated);

        return back()->with('success', 'Schedule added.');
    }

    public function storeTask(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_on' => ['nullable', 'date'],
        ]);

        $schoolClass->tasks()->create($validated);

        return back()->with('success', 'Class task added.');
    }

    public function storeIndicator(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'subject_name' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        $schoolClass->indicators()->create($validated);

        return back()->with('success', 'Academic indicator added.');
    }

    public function storeAssessment(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'academic_indicator_id' => ['nullable', 'integer', 'exists:academic_indicators,id'],
            'subject_name' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'string', 'max:100'],
            'score' => ['required', 'numeric', 'between:0,100'],
        ]);

        $user = $request->user();
        $staff = $user?->staff;

        if ($user?->hasRole(UserRole::Teacher)) {
            abort_unless($staff !== null, 403);

            $allowed = ClassTeacherAssignment::query()
                ->where('school_class_id', $schoolClass->id)
                ->where('staff_id', $staff->id)
                ->where(function ($query) use ($validated) {
                    $query->where('subject_name', $validated['subject_name'])
                        ->orWhere('is_homeroom', true);
                })
                ->exists();

            abort_unless($allowed, 403);
        }

        $schoolClass->assessments()->create([
            ...$validated,
            'staff_id' => $staff?->id,
        ]);

        return back()->with('success', 'Assessment recorded.');
    }
}
