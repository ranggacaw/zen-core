<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $schoolClass->name }} Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
        .header { margin-bottom: 24px; }
        .muted { color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
        th { background: #f3f4f6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }} - {{ $schoolClass->name }}</h1>
        <p class="muted">Academic year: {{ $schoolClass->academic_year }} | Generated at: {{ now()->format('Y-m-d H:i') }}</p>
    </div>

    <h2>Teacher assignments</h2>
    <ul>
        @foreach ($schoolClass->teachers as $assignment)
            <li>{{ $assignment->staff?->name }} - {{ $assignment->subject_name ?? 'General support' }}{{ $assignment->is_homeroom ? ' (Homeroom)' : '' }}</li>
        @endforeach
    </ul>

    <h2>Student summary</h2>
    <table>
        <thead>
            <tr>
                <th>Student</th>
                <th>Student Number</th>
                <th>Average Score</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($studentSummaries as $summary)
                <tr>
                    <td>{{ $summary['name'] }}</td>
                    <td>{{ $summary['student_number'] }}</td>
                    <td>{{ $summary['average_score'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
