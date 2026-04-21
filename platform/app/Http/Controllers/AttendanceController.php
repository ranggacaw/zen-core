<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Student;
use App\Events\AttendanceScanned;
use App\Jobs\TrackAnalyticsEvent;
use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        return $this->pesertaDidik($request);
    }

    public function pesertaDidik(Request $request): Response
    {
        $assignedClassIds = $this->assignedClassIds($request);
        $summaryQuery = $this->attendanceSummaryQuery($request, $assignedClassIds);

        return Inertia::render('absensi/peserta-didik/index', [
            'todayLabel' => today()->toFormattedDateString(),
            'scopeLabel' => $request->user()?->hasRole(UserRole::Teacher) ? 'Assigned classes only' : 'All school attendance activity',
            'summary' => [
                'checked_in' => (clone $summaryQuery)->whereNotNull('check_in_at')->count(),
                'checked_out' => (clone $summaryQuery)->whereNotNull('check_out_at')->count(),
                'open_records' => (clone $summaryQuery)->whereNull('check_out_at')->count(),
            ],
        ]);
    }

    public function pesertaDidikList(Request $request): Response
    {
        $records = $this->attendanceRecords($request, 30);

        return Inertia::render('absensi/peserta-didik-list/index', [
            'scopeLabel' => $request->user()?->hasRole(UserRole::Teacher) ? 'Assigned classes only' : 'All school attendance activity',
            'records' => $records->map(fn (AttendanceRecord $record) => [
                'id' => $record->id,
                'student' => $record->student?->name,
                'student_number' => $record->student?->student_number,
                'class' => $record->schoolClass?->name,
                'class_context' => collect([
                    $record->schoolClass?->name,
                    $record->schoolClass?->grade_level,
                    $record->schoolClass?->room_name,
                ])->filter()->implode(' • '),
                'attendance_date' => optional($record->attendance_date)?->toDateString(),
                'status' => $record->check_out_at ? 'Checked out' : 'Checked in',
                'check_in_at' => optional($record->check_in_at)?->format('H:i:s'),
                'check_out_at' => optional($record->check_out_at)?->format('H:i:s'),
                'scan_count' => $record->scan_count,
                'needs_checkout' => $record->check_in_at !== null && $record->check_out_at === null,
            ])->values(),
        ]);
    }

    public function scan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string', 'max:50'],
        ]);

        $student = Student::query()
            ->where('student_number', $validated['identifier'])
            ->first();

        if (! $student) {
            return back()->withErrors([
                'identifier' => 'Student identifier was not found.',
            ]);
        }

        $user = $request->user();

        if ($user?->hasRole(UserRole::Teacher)) {
            $staff = $user->staff;

            if (! $staff) {
                return back()->withErrors([
                    'identifier' => 'Your teacher account is not linked to a staff record.',
                ]);
            }

            $canScan = ClassTeacherAssignment::query()
                ->where('staff_id', $staff->id)
                ->where('school_class_id', $student->school_class_id)
                ->exists();

            if (! $canScan) {
                return back()->withErrors([
                    'identifier' => 'You can only scan attendance for your assigned classes.',
                ]);
            }
        }

        $record = AttendanceRecord::query()
            ->where('student_id', $student->id)
            ->whereDate('attendance_date', today())
            ->first();

        if (! $record) {
            $record = AttendanceRecord::query()->create([
                'student_id' => $student->id,
                'attendance_date' => today()->toDateString(),
                'school_class_id' => $student->school_class_id,
                'check_in_at' => now(),
                'scan_count' => 1,
            ]);
        }

        $status = 'Checked in';

        if ($record->wasRecentlyCreated === false) {
            if ($record->check_in_at === null) {
                $record->check_in_at = now();
                $status = 'Checked in';
            } elseif ($record->check_out_at === null) {
                $record->check_out_at = now();
                $status = 'Checked out';
            } else {
                $record->check_out_at = now();
                $status = 'Checked out';
            }

            $record->scan_count++;
            $record->save();
        }

        $activity = [
            'student' => $student->name,
            'class' => $student->schoolClass?->name ?? '-',
            'status' => $status,
            'scanned_at' => now()->toDateTimeString(),
        ];

        AttendanceScanned::dispatch($activity);
        TrackAnalyticsEvent::dispatch('attendance.scanned', $request->user()?->id, [
            'student_id' => $student->id,
            'status' => $status,
        ]);

        return back()->with('success', "{$student->name} {$status}.");
    }

    private function assignedClassIds(Request $request): Collection
    {
        $user = $request->user();
        $staff = $user?->staff;

        if (! $user?->hasRole(UserRole::Teacher) || ! $staff) {
            return collect();
        }

        return ClassTeacherAssignment::query()
            ->where('staff_id', $staff->id)
            ->pluck('school_class_id')
            ->unique()
            ->values();
    }

    private function attendanceRecords(Request $request, int $limit = 20): Collection
    {
        $assignedClassIds = $this->assignedClassIds($request);
        $recordsQuery = AttendanceRecord::query()
            ->with(['student', 'schoolClass'])
            ->orderByDesc('attendance_date')
            ->orderByDesc('updated_at')
            ->limit($limit);

        if ($request->user()?->hasRole(UserRole::Teacher)) {
            $assignedClassIds->isNotEmpty()
                ? $recordsQuery->whereIn('school_class_id', $assignedClassIds)
                : $recordsQuery->whereRaw('1 = 0');
        }

        return $recordsQuery->get();
    }

    private function attendanceSummaryQuery(Request $request, Collection $assignedClassIds)
    {
        $summaryQuery = AttendanceRecord::query()->whereDate('attendance_date', today());

        if ($request->user()?->hasRole(UserRole::Teacher)) {
            $assignedClassIds->isNotEmpty()
                ? $summaryQuery->whereIn('school_class_id', $assignedClassIds)
                : $summaryQuery->whereRaw('1 = 0');
        }

        return $summaryQuery;
    }
}
