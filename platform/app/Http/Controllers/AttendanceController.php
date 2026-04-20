<?php

namespace App\Http\Controllers;

use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Student;
use App\Events\AttendanceScanned;
use App\Jobs\TrackAnalyticsEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(): Response
    {
        $records = AttendanceRecord::query()
            ->with(['student', 'schoolClass'])
            ->latest('updated_at')
            ->limit(20)
            ->get();

        return Inertia::render('attendance/index', [
            'summary' => [
                'checked_in' => AttendanceRecord::query()->whereDate('attendance_date', today())->whereNotNull('check_in_at')->count(),
                'checked_out' => AttendanceRecord::query()->whereDate('attendance_date', today())->whereNotNull('check_out_at')->count(),
                'open_records' => AttendanceRecord::query()->whereDate('attendance_date', today())->whereNull('check_out_at')->count(),
            ],
            'records' => $records->map(fn (AttendanceRecord $record) => [
                'id' => $record->id,
                'student' => $record->student?->name,
                'student_number' => $record->student?->student_number,
                'class' => $record->schoolClass?->name,
                'status' => $record->check_out_at ? 'Checked out' : 'Checked in',
                'check_in_at' => optional($record->check_in_at)?->format('H:i:s'),
                'check_out_at' => optional($record->check_out_at)?->format('H:i:s'),
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
            ->firstOrFail();

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
        Cache::forget('dashboard:metrics:admin');
        Cache::forget('dashboard:metrics:teacher');

        return back()->with('success', "{$student->name} {$status}.");
    }
}
