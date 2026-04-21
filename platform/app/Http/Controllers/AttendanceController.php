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
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $staff = $user?->staff;
        $assignedClassIds = collect();

        if ($user?->hasRole(UserRole::Teacher) && $staff) {
            $assignedClassIds = ClassTeacherAssignment::query()
                ->where('staff_id', $staff->id)
                ->pluck('school_class_id')
                ->unique()
                ->values();
        }

        $recordsQuery = AttendanceRecord::query()
            ->with(['student', 'schoolClass'])
            ->latest('updated_at')
            ->limit(20);

        if ($user?->hasRole(UserRole::Teacher)) {
            $assignedClassIds->isNotEmpty()
                ? $recordsQuery->whereIn('school_class_id', $assignedClassIds)
                : $recordsQuery->whereRaw('1 = 0');
        }

        $records = $recordsQuery->get();

        $summaryQuery = AttendanceRecord::query()->whereDate('attendance_date', today());

        if ($user?->hasRole(UserRole::Teacher)) {
            $assignedClassIds->isNotEmpty()
                ? $summaryQuery->whereIn('school_class_id', $assignedClassIds)
                : $summaryQuery->whereRaw('1 = 0');
        }

        return Inertia::render('attendance/index', [
            'todayLabel' => today()->toFormattedDateString(),
            'scopeLabel' => $user?->hasRole(UserRole::Teacher) ? 'Assigned classes only' : 'All school attendance activity',
            'summary' => [
                'checked_in' => (clone $summaryQuery)->whereNotNull('check_in_at')->count(),
                'checked_out' => (clone $summaryQuery)->whereNotNull('check_out_at')->count(),
                'open_records' => (clone $summaryQuery)->whereNull('check_out_at')->count(),
            ],
            'records' => $records->map(fn (AttendanceRecord $record) => [
                'id' => $record->id,
                'student' => $record->student?->name,
                'student_number' => $record->student?->student_number,
                'class' => $record->schoolClass?->name,
                'attendance_date' => optional($record->attendance_date)?->toDateString(),
                'status' => $record->check_out_at ? 'Checked out' : 'Checked in',
                'check_in_at' => optional($record->check_in_at)?->format('H:i:s'),
                'check_out_at' => optional($record->check_out_at)?->format('H:i:s'),
                'scan_count' => $record->scan_count,
                'needs_checkout' => $record->check_in_at !== null && $record->check_out_at === null,
            ]),
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
}
