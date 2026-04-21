<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $schoolClass->name }} Report Card</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
        .header { margin-bottom: 24px; }
        .meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
        .meta-card { border: 1px solid #d1d5db; border-radius: 10px; padding: 12px; }
        .muted { color: #6b7280; }
        .section { margin-top: 28px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; vertical-align: top; }
        th { background: #f3f4f6; }
        .small { font-size: 12px; }
        .nowrap { white-space: nowrap; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }} - {{ $schoolClass->name }} Report Card</h1>
        <p class="muted">Academic year: {{ $schoolClass->academic_year }} | Generated at: {{ now()->format('Y-m-d H:i') }}</p>

        <div class="meta">
            <div class="meta-card">
                <div class="muted small">Grade level</div>
                <div>{{ $schoolClass->grade_level }}</div>
            </div>
            <div class="meta-card">
                <div class="muted small">Room</div>
                <div>{{ $schoolClass->room_name ?? 'Not assigned' }}</div>
            </div>
            <div class="meta-card">
                <div class="muted small">Indicators</div>
                <div>{{ $indicators->count() }}</div>
            </div>
            <div class="meta-card">
                <div class="muted small">Score coverage</div>
                <div>{{ $scoreSummary['slot_filled'] }} / {{ $scoreSummary['slot_total'] }}</div>
                <div class="small muted">{{ $scoreSummary['completion_percentage'] }}% complete</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Teacher assignments</h2>
        <ul>
            @foreach ($teacherAssignments as $assignment)
                <li>
                    {{ $assignment['staff'] ?? 'Unassigned teacher' }}
                    - {{ $assignment['subject_name'] ?? 'General academic support' }}{{ $assignment['is_homeroom'] ? ' (Homeroom)' : '' }}
                </li>
            @endforeach
        </ul>
    </div>

    <div class="section">
        <h2>Indicator-based student report card</h2>
        <table>
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Student Number</th>
                    @foreach ($indicators as $indicator)
                        <th>
                            <div class="nowrap">{{ $indicator['code'] }}</div>
                            <div class="small muted">{{ $indicator['subject_name'] }}</div>
                            <div class="small muted">{{ $indicator['semester'] }}</div>
                        </th>
                    @endforeach
                    <th>Average</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($studentSummaries as $summary)
                    <tr>
                        <td>{{ $summary['name'] }}</td>
                        <td>{{ $summary['student_number'] }}</td>
                        @foreach ($summary['indicator_scores'] as $score)
                            <td>{{ $score }}</td>
                        @endforeach
                        <td>{{ $summary['average_score'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
