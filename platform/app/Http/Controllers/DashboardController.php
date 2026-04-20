<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\BusinessResources\Models\BillingRecord;
use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user?->role?->value ?? $user?->role;
        $query = trim((string) $request->string('q'));

        $metrics = Cache::remember("dashboard:metrics:{$role}", now()->addMinutes(5), function () {
            return [
                'pendingApplicants' => Applicant::query()->where('status', 'pending')->count(),
                'activeStudents' => Student::query()->where('status', 'active')->count(),
                'staffMembers' => Staff::query()->count(),
                'pendingBilling' => BillingRecord::query()->where('status', 'pending')->count(),
                'publishedAnnouncements' => Announcement::query()->where('status', 'published')->count(),
            ];
        });

        $recentAttendance = AttendanceRecord::query()
            ->with(['student', 'schoolClass'])
            ->latest('updated_at')
            ->limit(6)
            ->get()
            ->map(fn (AttendanceRecord $record) => [
                'student' => $record->student?->name,
                'student_number' => $record->student?->student_number,
                'class' => $record->schoolClass?->name,
                'status' => $record->check_out_at ? 'Checked out' : 'Checked in',
                'time' => optional($record->check_out_at ?? $record->check_in_at)?->format('H:i'),
            ]);

        $classReadiness = SchoolClass::query()
            ->withCount([
                'indicators as incomplete_indicators_count' => fn ($query) => $query->where('status', '!=', 'complete'),
            ])
            ->limit(5)
            ->get()
            ->map(fn (SchoolClass $schoolClass) => [
                'name' => $schoolClass->name,
                'academic_year' => $schoolClass->academic_year,
                'incomplete_indicators' => $schoolClass->incomplete_indicators_count,
            ]);

        $publishedAnnouncements = Announcement::query()
            ->with('classes:id,name')
            ->where('status', 'published')
            ->latest('published_at')
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
            'metrics' => $metrics,
            'recentAttendance' => $recentAttendance,
            'classReadiness' => $classReadiness,
            'announcements' => $publishedAnnouncements,
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
