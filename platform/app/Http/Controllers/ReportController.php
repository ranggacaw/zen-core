<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Student;
use Illuminate\Support\Collection;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index', [
            'classes' => SchoolClass::query()
                ->with(['teachers.staff:id,name'])
                ->withCount(['students', 'indicators', 'assessments'])
                ->orderBy('name')
                ->get(['id', 'name', 'academic_year'])
                ->map(function (SchoolClass $schoolClass) {
                    $slotTotal = $schoolClass->students_count * $schoolClass->indicators_count;
                    $slotFilled = min($schoolClass->assessments_count, $slotTotal);

                    return [
                        'id' => $schoolClass->id,
                        'name' => $schoolClass->name,
                        'academic_year' => $schoolClass->academic_year,
                        'students_count' => $schoolClass->students_count,
                        'indicators_count' => $schoolClass->indicators_count,
                        'slot_total' => $slotTotal,
                        'slot_filled' => $slotFilled,
                        'completion_percentage' => $slotTotal > 0 ? (int) round(($slotFilled / $slotTotal) * 100) : 0,
                        'homeroom_teacher' => $schoolClass->teachers->firstWhere('is_homeroom', true)?->staff?->name,
                    ];
                }),
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
        $report = $this->buildClassReport($schoolClass);

        return response()->view('reports.class-report', [
            'schoolClass' => $report['schoolClass'],
            'teacherAssignments' => $report['teacherAssignments'],
            'indicators' => $report['indicators'],
            'studentSummaries' => $report['studentSummaries'],
            'scoreSummary' => $report['scoreSummary'],
        ]);
    }

    public function classScoresCsv(SchoolClass $schoolClass): StreamedResponse
    {
        $report = $this->buildClassReport($schoolClass);
        $headers = ['Student', 'Student Number'];

        foreach ($report['indicators'] as $indicator) {
            $headers[] = sprintf('%s %s', $indicator['code'], $indicator['subject_name']);
        }

        $headers[] = 'Average Score';

        return response()->streamDownload(function () use ($headers, $report) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            foreach ($report['studentSummaries'] as $summary) {
                $row = [
                    $summary['name'],
                    $summary['student_number'],
                ];

                foreach ($summary['indicator_scores'] as $score) {
                    $row[] = $score;
                }

                $row[] = $summary['average_score'];
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, sprintf('%s-report-card.csv', str($schoolClass->name)->slug()->toString()));
    }

    /**
     * @return array{schoolClass: SchoolClass, teacherAssignments: Collection<int, array<string, mixed>>, indicators: Collection<int, array<string, mixed>>, studentSummaries: Collection<int, array<string, mixed>>, scoreSummary: array<string, int>}
     */
    protected function buildClassReport(SchoolClass $schoolClass): array
    {
        $schoolClass->load([
            'students',
            'teachers.staff',
            'indicators',
            'assessments.student',
            'assessments.indicator',
        ]);

        $indicators = $schoolClass->indicators
            ->sortBy(['subject_name', 'semester', 'code'])
            ->values()
            ->map(fn ($indicator) => [
                'id' => $indicator->id,
                'code' => $indicator->code,
                'name' => $indicator->name,
                'subject_name' => $indicator->subject_name,
                'semester' => $indicator->semester,
            ]);

        $teacherAssignments = $schoolClass->teachers
            ->map(fn ($assignment) => [
                'staff' => $assignment->staff?->name,
                'subject_name' => $assignment->subject_name,
                'is_homeroom' => $assignment->is_homeroom,
            ]);

        $studentSummaries = $schoolClass->students
            ->sortBy('name')
            ->values()
            ->map(function ($student) use ($schoolClass, $indicators) {
                $scores = $schoolClass->assessments->where('student_id', $student->id)->keyBy('academic_indicator_id');
                $indicatorScores = $indicators->mapWithKeys(function (array $indicator) use ($scores) {
                    $assessment = $scores->get($indicator['id']);

                    return [$indicator['id'] => $assessment ? (string) $assessment->score : '-'];
                });

                return [
                    'name' => $student->name,
                    'student_number' => $student->student_number,
                    'indicator_scores' => $indicatorScores,
                    'average_score' => round($scores->avg('score') ?? 0, 2),
                ];
            });

        $scoreSlotTotal = $schoolClass->students->count() * $indicators->count();
        $scoreSlotFilled = $schoolClass->assessments->count();

        return [
            'schoolClass' => $schoolClass,
            'teacherAssignments' => $teacherAssignments,
            'indicators' => $indicators,
            'studentSummaries' => $studentSummaries,
            'scoreSummary' => [
                'slot_total' => $scoreSlotTotal,
                'slot_filled' => min($scoreSlotFilled, $scoreSlotTotal),
                'completion_percentage' => $scoreSlotTotal > 0 ? (int) round((min($scoreSlotFilled, $scoreSlotTotal) / $scoreSlotTotal) * 100) : 0,
            ],
        ];
    }
}
