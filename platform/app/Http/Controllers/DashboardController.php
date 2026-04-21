<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\BusinessResources\Models\RoomBooking;
use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user?->role?->value ?? $user?->role;
        $staff = $user?->staff;
        $query = trim((string) $request->string('q'));
        $assignedClassIds = collect();
        $linkedStudentIds = collect();
        $linkedClassIds = collect();
        $guardianWorkspace = null;
        $guardianId = null;

        if ($role === UserRole::RegisteredUser->value && $user) {
            $guardian = Guardian::query()
                ->with(['students.schoolClass:id,name', 'applicants.schoolClass:id,name'])
                ->where('user_id', $user->id)
                ->first();

            if ($guardian) {
                $guardianId = $guardian->id;
                $linkedStudentIds = $guardian->students->pluck('id')->values();
                $linkedClassIds = $guardian->students->pluck('school_class_id')->filter()->unique()->values();

                $guardianWorkspace = [
                    'name' => $guardian->name,
                    'relationship' => $guardian->relationship,
                    'phone' => $guardian->phone,
                    'email' => $guardian->email,
                    'students' => $guardian->students->map(fn (Student $student) => [
                        'name' => $student->name,
                        'student_number' => $student->student_number,
                        'class' => $student->schoolClass?->name,
                        'status' => $student->status,
                    ])->values(),
                    'applicants' => $guardian->applicants->map(fn (Applicant $applicant) => [
                        'name' => $applicant->name,
                        'student_number' => $applicant->student_number,
                        'class' => $applicant->schoolClass?->name,
                        'status' => $applicant->status,
                        'decision_notes' => $applicant->decision_notes,
                    ])->values(),
                ];
            }
        }

        if ($role === 'teacher' && $staff) {
            $assignedClassIds = ClassTeacherAssignment::query()
                ->where('staff_id', $staff->id)
                ->pluck('school_class_id')
                ->unique()
                ->values();
        }

        $classReadinessQuery = SchoolClass::query()
            ->withCount([
                'indicators as incomplete_indicators_count' => fn ($query) => $query->where('status', '!=', 'complete'),
            ]);

        if ($role === 'teacher') {
            $assignedClassIds->isNotEmpty()
                ? $classReadinessQuery->whereIn('id', $assignedClassIds)
                : $classReadinessQuery->whereRaw('1 = 0');
        }

        if ($role === UserRole::RegisteredUser->value) {
            $classReadinessQuery->whereRaw('1 = 0');
        }

        $classReadiness = $classReadinessQuery
            ->limit(5)
            ->get()
            ->map(fn (SchoolClass $schoolClass) => [
                'name' => $schoolClass->name,
                'academic_year' => $schoolClass->academic_year,
                'incomplete_indicators' => $schoolClass->incomplete_indicators_count,
            ]);

        $metrics = $role === UserRole::RegisteredUser->value
            ? [
                'pendingApplicants' => $guardianId
                    ? Applicant::query()->where('guardian_id', $guardianId)->where('status', 'pending')->count()
                    : 0,
                'activeStudents' => Student::query()->whereIn('id', $linkedStudentIds)->where('status', 'active')->count(),
                'staffMembers' => 0,
                'activeRoomBookings' => 0,
                'publishedAnnouncements' => 0,
                'assignedClasses' => $linkedClassIds->count(),
                'incompleteIndicators' => 0,
                'checkedInToday' => AttendanceRecord::query()
                    ->whereDate('attendance_date', today())
                    ->whereIn('student_id', $linkedStudentIds)
                    ->whereNotNull('check_in_at')
                    ->count(),
            ]
            : [
                'pendingApplicants' => Applicant::query()->where('status', 'pending')->count(),
                'activeStudents' => Student::query()->where('status', 'active')->count(),
                'staffMembers' => Staff::query()->count(),
                'activeRoomBookings' => RoomBooking::query()->where('ends_at', '>=', now())->count(),
                'publishedAnnouncements' => Announcement::query()->where('status', 'published')->count(),
                'assignedClasses' => $assignedClassIds->count(),
                'incompleteIndicators' => $classReadiness->sum('incomplete_indicators'),
                'checkedInToday' => AttendanceRecord::query()->whereDate('attendance_date', today())->whereNotNull('check_in_at')->count(),
            ];

        $recentAttendanceQuery = AttendanceRecord::query()
            ->with(['student', 'schoolClass'])
            ->latest('updated_at')
            ->limit(6);

        if ($role === 'teacher') {
            $assignedClassIds->isNotEmpty()
                ? $recentAttendanceQuery->whereIn('school_class_id', $assignedClassIds)
                : $recentAttendanceQuery->whereRaw('1 = 0');
        }

        if ($role === UserRole::RegisteredUser->value) {
            $linkedStudentIds->isNotEmpty()
                ? $recentAttendanceQuery->whereIn('student_id', $linkedStudentIds)
                : $recentAttendanceQuery->whereRaw('1 = 0');
        }

        $recentAttendance = $recentAttendanceQuery
            ->get()
            ->map(fn (AttendanceRecord $record) => [
                'student' => $record->student?->name,
                'student_number' => $record->student?->student_number,
                'class' => $record->schoolClass?->name,
                'status' => $record->check_out_at ? 'Checked out' : 'Checked in',
                'time' => optional($record->check_out_at ?? $record->check_in_at)?->format('H:i'),
            ]);

        $publishedAnnouncementsQuery = Announcement::query()
            ->with('classes:id,name')
            ->where('status', 'published')
            ->latest('published_at');

        if ($role === 'teacher') {
            $assignedClassIds->isNotEmpty()
                ? $publishedAnnouncementsQuery->whereHas('classes', fn ($query) => $query->whereIn('school_classes.id', $assignedClassIds))
                : $publishedAnnouncementsQuery->whereRaw('1 = 0');
        }

        if ($role === UserRole::RegisteredUser->value) {
            $linkedClassIds->isNotEmpty()
                ? $publishedAnnouncementsQuery->whereHas('classes', fn ($query) => $query->whereIn('school_classes.id', $linkedClassIds))
                : $publishedAnnouncementsQuery->whereRaw('1 = 0');
        }

        $publishedAnnouncements = $publishedAnnouncementsQuery
            ->limit($role === 'registered_user' ? 5 : 3)
            ->get()
            ->map(fn (Announcement $announcement) => [
                'title' => $announcement->title,
                'status' => $announcement->status,
                'published_at' => optional($announcement->published_at)?->toDateTimeString(),
                'audiences' => $announcement->classes->pluck('name')->all(),
            ]);

        return Inertia::render('dashboard', [
            'query' => $query,
            'roleSummary' => [
                'title' => $role === 'teacher' ? 'Teacher workspace' : ($role === 'registered_user' ? 'Guardian workspace' : 'Admin control center'),
                'description' => $role === 'teacher'
                    ? 'Follow your assigned classes, attendance activity, report-card readiness, and published announcements.'
                    : ($role === 'registered_user'
                        ? 'Review linked students, admissions progress, today\'s attendance, and class announcements for your family.'
                        : 'Manage admissions, staffing, room usage, attendance, and communication from one operations dashboard.'),
            ],
            'metrics' => $metrics,
            'recentAttendance' => $recentAttendance,
            'classReadiness' => $classReadiness,
            'announcements' => $publishedAnnouncements,
            'guardianWorkspace' => $guardianWorkspace,
            'searchResults' => $query !== '' ? $this->search($query) : [],
        ]);
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    protected function search(string $query): array
    {
        return [
            'applicants' => $this->searchModel(Applicant::class, $query, ['name', 'student_number', 'status']),
            'students' => $this->searchModel(Student::class, $query, ['name', 'student_number', 'status']),
            'staff' => $this->searchModel(Staff::class, $query, ['name', 'email', 'position']),
            'classes' => $this->searchModel(SchoolClass::class, $query, ['name', 'grade_level', 'academic_year']),
            'announcements' => $this->searchModel(Announcement::class, $query, ['title', 'status']),
        ];
    }

    /**
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelClass
     * @param  list<string>  $columns
     * @return list<array<string, mixed>>
     */
    protected function searchModel(string $modelClass, string $query, array $columns): array
    {
        try {
            if (method_exists($modelClass, 'search')) {
                return $modelClass::search($query)
                    ->take(5)
                    ->get()
                    ->map(fn ($record) => $record->only($columns))
                    ->values()
                    ->all();
            }
        } catch (Throwable) {
            // Fall back to database queries when the search service is unavailable.
        }

        return $modelClass::query()
            ->where(function ($builder) use ($columns, $query) {
                foreach ($columns as $index => $column) {
                    $method = $index === 0 ? 'where' : 'orWhere';
                    $builder->{$method}($column, 'like', "%{$query}%");
                }
            })
            ->limit(5)
            ->get($columns)
            ->map(fn ($record) => $record->only($columns))
            ->values()
            ->all();
    }
}
