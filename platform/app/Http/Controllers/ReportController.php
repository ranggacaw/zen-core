<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Student;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index', [
            'classes' => SchoolClass::query()->orderBy('name')->get(['id', 'name', 'academic_year']),
            'exports' => [
                'students' => route('reports.students.csv'),
                'attendance' => route('reports.attendance.csv'),
            ],
        ]);
    }

    public function studentsCsv(): StreamedResponse
    {
        $rows = Student::query()->with(['guardian', 'schoolClass'])->orderBy('name')->get();

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Student', 'Student Number', 'Guardian', 'Class', 'Status']);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row->name,
                    $row->student_number,
                    $row->guardian?->name,
                    $row->schoolClass?->name,
                    $row->status,
                ]);
            }

            fclose($handle);
        }, 'students.csv');
    }

    public function attendanceCsv(): StreamedResponse
    {
        $rows = AttendanceRecord::query()->with(['student', 'schoolClass'])->latest('attendance_date')->get();

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Date', 'Student', 'Student Number', 'Class', 'Check In', 'Check Out']);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    optional($row->attendance_date)?->toDateString(),
                    $row->student?->name,
                    $row->student?->student_number,
                    $row->schoolClass?->name,
                    optional($row->check_in_at)?->toDateTimeString(),
                    optional($row->check_out_at)?->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, 'attendance.csv');
    }

    public function printClassReport(SchoolClass $schoolClass): HttpResponse
    {
        $schoolClass->load(['students', 'teachers.staff', 'assessments.student']);

        return response()->view('reports.class-report', [
            'schoolClass' => $schoolClass,
            'studentSummaries' => $schoolClass->students->map(function ($student) use ($schoolClass) {
                $scores = $schoolClass->assessments->where('student_id', $student->id);

                return [
                    'name' => $student->name,
                    'student_number' => $student->student_number,
                    'average_score' => round($scores->avg('score') ?? 0, 2),
                ];
            }),
        ]);
    }
}
