<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\AcademicOperations\Models\AssessmentEntry;
use App\Domain\AcademicOperations\Models\ClassDailyJournal;
use App\Domain\AcademicOperations\Models\ClassSchedule;
use App\Domain\AcademicOperations\Models\ClassTask;
use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\BusinessResources\Models\Facility;
use App\Domain\BusinessResources\Models\RoomBooking;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DataRuanganController extends Controller
{
    public function rombonganBelajarIndex(Request $request): Response
    {
        $user = $request->user();
        $staff = $user?->staff;

        $classesQuery = SchoolClass::query()
            ->with(['teachers.staff'])
            ->withCount(['students', 'teachers', 'tasks', 'dailyJournals']);

        if ($user?->hasRole(UserRole::Teacher) && $staff !== null) {
            $classIds = ClassTeacherAssignment::query()
                ->where('staff_id', $staff->id)
                ->pluck('school_class_id');

            $classesQuery->whereIn('id', $classIds);
        }

        $classes = $classesQuery->orderBy('name')->get();
        $selectedClass = $classes->firstWhere('id', $request->integer('class')) ?? $classes->first();

        $selectedClass?->load([
            'students',
            'teachers.staff',
            'schedules.staff',
            'schedules.teacherAssignment.staff',
            'tasks.teacherAssignment.staff',
            'dailyJournals',
            'indicators',
            'assessments.student',
            'assessments.indicator',
            'assessments.staff',
        ]);

        return Inertia::render('data-ruangan/rombongan-belajar/index', [
            'classes' => $classes->map(function (SchoolClass $schoolClass) {
                $homeroomTeacher = $schoolClass->relationLoaded('teachers')
                    ? $schoolClass->teachers->firstWhere('is_homeroom', true)
                    : null;

                return [
                    'id' => $schoolClass->id,
                    'name' => $schoolClass->name,
                    'grade_level' => $schoolClass->grade_level,
                    'academic_year' => $schoolClass->academic_year,
                    'room_name' => $schoolClass->room_name,
                    'student_count' => $schoolClass->students_count,
                    'teacher_count' => $schoolClass->teachers_count,
                    'task_count' => $schoolClass->tasks_count,
                    'journal_count' => $schoolClass->daily_journals_count,
                    'homeroom_teacher' => $homeroomTeacher?->staff?->name,
                ];
            })->values(),
            'selectedClass' => $selectedClass ? $this->serializeSchoolClass($selectedClass) : null,
            'lookups' => [
                'gradeLevels' => $this->gradeLevels(),
                'teachers' => Staff::query()
                    ->forType(Staff::TYPE_PENGAJAR)
                    ->orderBy('name')
                    ->get(['id', 'name', 'position'])
                    ->map(fn (Staff $teacher) => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'position' => $teacher->position,
                    ])
                    ->values(),
                'rooms' => Facility::query()
                    ->forType(Facility::TYPE_ROOM)
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (Facility $room) => [
                        'id' => $room->id,
                        'name' => $room->name,
                    ])
                    ->values(),
            ],
            'routes' => [
                'index' => route('data-ruangan.rombongan-belajar.index'),
                'store' => route('data-ruangan.rombongan-belajar.store'),
            ],
        ]);
    }

    public function storeRombonganBelajar(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'grade_level' => ['required', 'string', 'max:100'],
            'academic_year' => ['required', 'string', 'max:100'],
            'room_id' => [
                'nullable',
                'integer',
                Rule::exists('facilities', 'id')->where('type', Facility::TYPE_ROOM),
            ],
            'homeroom_teacher_id' => [
                'nullable',
                'integer',
                Rule::exists('staff', 'id')->where('role', UserRole::Teacher->value),
            ],
        ]);

        $room = $validated['room_id'] ?? null
            ? Facility::query()->find($validated['room_id'])
            : null;

        $schoolClass = SchoolClass::query()->create([
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'academic_year' => $validated['academic_year'],
            'room_name' => $room?->name,
        ]);

        $this->syncHomeroomTeacher($schoolClass, $validated['homeroom_teacher_id'] ?? null);

        return to_route('data-ruangan.rombongan-belajar.index', ['class' => $schoolClass->id])
            ->with('success', 'Rombongan belajar created.');
    }

    public function updateRombonganBelajar(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'grade_level' => ['required', 'string', 'max:100'],
            'academic_year' => ['required', 'string', 'max:100'],
            'room_id' => [
                'nullable',
                'integer',
                Rule::exists('facilities', 'id')->where('type', Facility::TYPE_ROOM),
            ],
            'homeroom_teacher_id' => [
                'nullable',
                'integer',
                Rule::exists('staff', 'id')->where('role', UserRole::Teacher->value),
            ],
        ]);

        $room = $validated['room_id'] ?? null
            ? Facility::query()->find($validated['room_id'])
            : null;

        $schoolClass->update([
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'academic_year' => $validated['academic_year'],
            'room_name' => $room?->name,
        ]);

        $this->syncHomeroomTeacher($schoolClass, $validated['homeroom_teacher_id'] ?? null);

        return to_route('data-ruangan.rombongan-belajar.index', ['class' => $schoolClass->id])
            ->with('success', 'Rombongan belajar updated.');
    }

    public function destroyRombonganBelajar(SchoolClass $schoolClass): RedirectResponse
    {
        $schoolClass->delete();

        return to_route('data-ruangan.rombongan-belajar.index')->with('success', 'Rombongan belajar deleted.');
    }

    public function storeTeacherAssignment(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'staff_id' => [
                'required',
                'integer',
                Rule::exists('staff', 'id')->where('role', UserRole::Teacher->value),
            ],
            'subject_name' => ['required', 'string', 'max:255'],
            'is_homeroom' => ['nullable', 'boolean'],
        ]);

        if ($validated['is_homeroom'] ?? false) {
            $schoolClass->teachers()->where('is_homeroom', true)->update(['is_homeroom' => false]);
        }

        $schoolClass->teachers()->create([
            'staff_id' => $validated['staff_id'],
            'subject_name' => $validated['subject_name'],
            'is_homeroom' => $validated['is_homeroom'] ?? false,
        ]);

        return back()->with('success', 'Teacher assignment saved.');
    }

    public function updateTeacherAssignment(Request $request, SchoolClass $schoolClass, ClassTeacherAssignment $assignment): RedirectResponse
    {
        abort_unless($assignment->school_class_id === $schoolClass->id, 404);

        $validated = $request->validate([
            'staff_id' => [
                'required',
                'integer',
                Rule::exists('staff', 'id')->where('role', UserRole::Teacher->value),
            ],
            'subject_name' => ['required', 'string', 'max:255'],
            'is_homeroom' => ['nullable', 'boolean'],
        ]);

        if ($validated['is_homeroom'] ?? false) {
            $schoolClass->teachers()
                ->where('is_homeroom', true)
                ->whereKeyNot($assignment->id)
                ->update(['is_homeroom' => false]);
        }

        $assignment->update([
            'staff_id' => $validated['staff_id'],
            'subject_name' => $validated['subject_name'],
            'is_homeroom' => $validated['is_homeroom'] ?? false,
        ]);

        return back()->with('success', 'Teacher assignment updated.');
    }

    public function destroyTeacherAssignment(SchoolClass $schoolClass, ClassTeacherAssignment $assignment): RedirectResponse
    {
        abort_unless($assignment->school_class_id === $schoolClass->id, 404);

        $assignment->delete();

        return back()->with('success', 'Teacher assignment removed.');
    }

    public function storeSchedule(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'class_teacher_assignment_id' => [
                'required',
                'integer',
                Rule::exists('class_teacher_assignments', 'id')->where('school_class_id', $schoolClass->id),
            ],
            'semester' => ['required', 'string', 'max:100'],
            'day_of_week' => ['required', 'string', 'max:20'],
            'starts_at' => ['required', 'date_format:H:i'],
            'ends_at' => ['required', 'date_format:H:i', 'after:starts_at'],
        ]);

        $assignment = $schoolClass->teachers()->with('staff')->findOrFail($validated['class_teacher_assignment_id']);

        $schoolClass->schedules()->create([
            'class_teacher_assignment_id' => $assignment->id,
            'staff_id' => $assignment->staff_id,
            'subject_name' => $assignment->subject_name,
            'semester' => $validated['semester'],
            'day_of_week' => $validated['day_of_week'],
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
        ]);

        return back()->with('success', 'Schedule slot saved.');
    }

    public function updateSchedule(Request $request, SchoolClass $schoolClass, ClassSchedule $schedule): RedirectResponse
    {
        abort_unless($schedule->school_class_id === $schoolClass->id, 404);

        $validated = $request->validate([
            'class_teacher_assignment_id' => [
                'required',
                'integer',
                Rule::exists('class_teacher_assignments', 'id')->where('school_class_id', $schoolClass->id),
            ],
            'semester' => ['required', 'string', 'max:100'],
            'day_of_week' => ['required', 'string', 'max:20'],
            'starts_at' => ['required', 'date_format:H:i'],
            'ends_at' => ['required', 'date_format:H:i', 'after:starts_at'],
        ]);

        $assignment = $schoolClass->teachers()->findOrFail($validated['class_teacher_assignment_id']);

        $schedule->update([
            'class_teacher_assignment_id' => $assignment->id,
            'staff_id' => $assignment->staff_id,
            'subject_name' => $assignment->subject_name,
            'semester' => $validated['semester'],
            'day_of_week' => $validated['day_of_week'],
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
        ]);

        return back()->with('success', 'Schedule slot updated.');
    }

    public function destroySchedule(SchoolClass $schoolClass, ClassSchedule $schedule): RedirectResponse
    {
        abort_unless($schedule->school_class_id === $schoolClass->id, 404);

        $schedule->delete();

        return back()->with('success', 'Schedule slot removed.');
    }

    public function storeDailyJournal(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'entry_date' => ['required', 'date'],
            'content' => ['required', 'string'],
        ]);

        $schoolClass->dailyJournals()->create($validated);

        return back()->with('success', 'Kelas harian entry saved.');
    }

    public function updateDailyJournal(Request $request, SchoolClass $schoolClass, ClassDailyJournal $journal): RedirectResponse
    {
        abort_unless($journal->school_class_id === $schoolClass->id, 404);

        $validated = $request->validate([
            'entry_date' => ['required', 'date'],
            'content' => ['required', 'string'],
        ]);

        $journal->update($validated);

        return back()->with('success', 'Kelas harian entry updated.');
    }

    public function destroyDailyJournal(SchoolClass $schoolClass, ClassDailyJournal $journal): RedirectResponse
    {
        abort_unless($journal->school_class_id === $schoolClass->id, 404);

        $journal->delete();

        return back()->with('success', 'Kelas harian entry removed.');
    }

    public function storeTask(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'class_teacher_assignment_id' => [
                'required',
                'integer',
                Rule::exists('class_teacher_assignments', 'id')->where('school_class_id', $schoolClass->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_on' => ['nullable', 'date'],
        ]);

        $schoolClass->tasks()->create($validated);

        return back()->with('success', 'Task saved.');
    }

    public function updateTask(Request $request, SchoolClass $schoolClass, ClassTask $task): RedirectResponse
    {
        abort_unless($task->school_class_id === $schoolClass->id, 404);

        $validated = $request->validate([
            'class_teacher_assignment_id' => [
                'required',
                'integer',
                Rule::exists('class_teacher_assignments', 'id')->where('school_class_id', $schoolClass->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_on' => ['nullable', 'date'],
        ]);

        $task->update($validated);

        return back()->with('success', 'Task updated.');
    }

    public function destroyTask(SchoolClass $schoolClass, ClassTask $task): RedirectResponse
    {
        abort_unless($task->school_class_id === $schoolClass->id, 404);

        $task->delete();

        return back()->with('success', 'Task removed.');
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

        return back()->with('success', 'Indicator saved.');
    }

    public function updateIndicator(Request $request, SchoolClass $schoolClass, AcademicIndicator $indicator): RedirectResponse
    {
        abort_unless($indicator->school_class_id === $schoolClass->id, 404);

        $validated = $request->validate([
            'subject_name' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        $indicator->update($validated);

        return back()->with('success', 'Indicator updated.');
    }

    public function destroyIndicator(SchoolClass $schoolClass, AcademicIndicator $indicator): RedirectResponse
    {
        abort_unless($indicator->school_class_id === $schoolClass->id, 404);

        $indicator->delete();

        return back()->with('success', 'Indicator removed.');
    }

    public function storeAssessment(Request $request, SchoolClass $schoolClass): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => [
                'required',
                'integer',
                Rule::exists('students', 'id')->where('school_class_id', $schoolClass->id),
            ],
            'academic_indicator_id' => [
                'required',
                'integer',
                Rule::exists('academic_indicators', 'id')->where('school_class_id', $schoolClass->id),
            ],
            'score' => ['required', 'numeric', 'between:0,100'],
        ]);

        $user = $request->user();
        $staff = $user?->staff;
        $indicator = $schoolClass->indicators()->findOrFail($validated['academic_indicator_id']);

        if ($user?->hasRole(UserRole::Teacher)) {
            abort_unless($staff !== null, 403);

            $allowed = ClassTeacherAssignment::query()
                ->where('school_class_id', $schoolClass->id)
                ->where('staff_id', $staff->id)
                ->where(function ($query) use ($indicator) {
                    $query->where('subject_name', $indicator->subject_name)
                        ->orWhere('is_homeroom', true);
                })
                ->exists();

            abort_unless($allowed, 403);
        }

        $schoolClass->assessments()->updateOrCreate([
            'student_id' => $validated['student_id'],
            'academic_indicator_id' => $indicator->id,
        ], [
            'subject_name' => $indicator->subject_name,
            'semester' => $indicator->semester,
            'score' => $validated['score'],
            'staff_id' => $staff?->id,
        ]);

        return back()->with('success', 'Raport score recorded.');
    }

    public function ruanganBelajarIndex(): Response
    {
        return $this->renderRoomPage(
            Facility::TYPE_ROOM,
            'Ruangan Belajar',
            'Manage room master data used by rombongan belajar assignments.'
        );
    }

    public function fasilitasSekolahIndex(): Response
    {
        return $this->renderRoomPage(
            Facility::TYPE_FACILITY,
            'Fasilitas Sekolah',
            'Manage shared facility master data used by booking requests.'
        );
    }

    public function storeRuanganBelajar(Request $request): RedirectResponse
    {
        return $this->storeFacilityByType($request, Facility::TYPE_ROOM, 'Ruangan belajar created.');
    }

    public function updateRuanganBelajar(Request $request, Facility $facility): RedirectResponse
    {
        return $this->updateFacilityByType($request, $facility, Facility::TYPE_ROOM, 'Ruangan belajar updated.');
    }

    public function destroyRuanganBelajar(Facility $facility): RedirectResponse
    {
        return $this->destroyFacilityByType($facility, Facility::TYPE_ROOM, 'Ruangan belajar removed.');
    }

    public function storeFasilitasSekolah(Request $request): RedirectResponse
    {
        return $this->storeFacilityByType($request, Facility::TYPE_FACILITY, 'Fasilitas sekolah created.');
    }

    public function updateFasilitasSekolah(Request $request, Facility $facility): RedirectResponse
    {
        return $this->updateFacilityByType($request, $facility, Facility::TYPE_FACILITY, 'Fasilitas sekolah updated.');
    }

    public function destroyFasilitasSekolah(Facility $facility): RedirectResponse
    {
        return $this->destroyFacilityByType($facility, Facility::TYPE_FACILITY, 'Fasilitas sekolah removed.');
    }

    public function penggunaanFasilitasIndex(): Response
    {
        return Inertia::render('data-ruangan/penggunaan-fasilitas/index', [
            'facilities' => Facility::query()
                ->forType(Facility::TYPE_FACILITY)
                ->orderBy('name')
                ->get(['id', 'name', 'location', 'status'])
                ->map(fn (Facility $facility) => [
                    'id' => $facility->id,
                    'name' => $facility->name,
                    'location' => $facility->location,
                    'status' => $facility->status,
                ])
                ->values(),
            'bookings' => RoomBooking::query()
                ->with(['facility:id,name,location,type', 'staff:id,name', 'student:id,name,student_number'])
                ->whereHas('facility', fn ($query) => $query->where('type', Facility::TYPE_FACILITY))
                ->latest('starts_at')
                ->get()
                ->map(fn (RoomBooking $booking) => [
                    'id' => $booking->id,
                    'facility_id' => $booking->facility_id,
                    'facility' => $booking->facility?->name,
                    'location' => $booking->facility?->location,
                    'requester_type' => $booking->staff_id ? 'guru' : 'murid',
                    'teacher_id' => $booking->staff_id,
                    'student_id' => $booking->student_id,
                    'requester' => $booking->staff?->name ?? $booking->student?->name,
                    'purpose' => $booking->purpose,
                    'notes' => $booking->notes,
                    'starts_at' => $booking->starts_at?->format('Y-m-d\TH:i'),
                    'ends_at' => $booking->ends_at?->format('Y-m-d\TH:i'),
                    'status' => $booking->status,
                    'usage_status' => $booking->ends_at !== null && $booking->ends_at->isPast() ? 'Selesai' : 'Terjadwal',
                ])
                ->values(),
            'teachers' => Staff::query()
                ->forType(Staff::TYPE_PENGAJAR)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Staff $teacher) => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                ])
                ->values(),
            'students' => Student::query()
                ->orderBy('name')
                ->get(['id', 'name', 'student_number'])
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'student_number' => $student->student_number,
                ])
                ->values(),
        ]);
    }

    public function storePenggunaanFasilitas(Request $request): RedirectResponse
    {
        $validated = $this->validateBooking($request);

        if ($this->hasBookingOverlap($validated)) {
            return back()->withErrors([
                'facility_id' => 'Fasilitas sudah digunakan pada rentang waktu tersebut.',
            ]);
        }

        RoomBooking::query()->create([
            'facility_id' => $validated['facility_id'],
            'staff_id' => $validated['requester_type'] === 'guru' ? $validated['teacher_id'] : null,
            'student_id' => $validated['requester_type'] === 'murid' ? $validated['student_id'] : null,
            'purpose' => $validated['purpose'],
            'notes' => $validated['notes'] ?? null,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
            'status' => 'scheduled',
        ]);

        return back()->with('success', 'Penggunaan fasilitas created.');
    }

    public function updatePenggunaanFasilitas(Request $request, RoomBooking $booking): RedirectResponse
    {
        abort_unless($booking->facility?->type === Facility::TYPE_FACILITY, 404);

        $validated = $this->validateBooking($request);

        if ($this->hasBookingOverlap($validated, $booking->id)) {
            return back()->withErrors([
                'facility_id' => 'Fasilitas sudah digunakan pada rentang waktu tersebut.',
            ]);
        }

        $booking->update([
            'facility_id' => $validated['facility_id'],
            'staff_id' => $validated['requester_type'] === 'guru' ? $validated['teacher_id'] : null,
            'student_id' => $validated['requester_type'] === 'murid' ? $validated['student_id'] : null,
            'purpose' => $validated['purpose'],
            'notes' => $validated['notes'] ?? null,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
        ]);

        return back()->with('success', 'Penggunaan fasilitas updated.');
    }

    public function destroyPenggunaanFasilitas(RoomBooking $booking): RedirectResponse
    {
        abort_unless($booking->facility?->type === Facility::TYPE_FACILITY, 404);

        $booking->delete();

        return back()->with('success', 'Penggunaan fasilitas removed.');
    }

    private function renderRoomPage(string $type, string $title, string $description): Response
    {
        return Inertia::render('data-ruangan/rooms/index', [
            'module' => [
                'type' => $type,
                'title' => $title,
                'description' => $description,
            ],
            'items' => Facility::query()
                ->forType($type)
                ->orderBy('name')
                ->get(['id', 'name', 'location', 'status'])
                ->map(fn (Facility $facility) => [
                    'id' => $facility->id,
                    'name' => $facility->name,
                    'location' => $facility->location,
                    'status' => $facility->status,
                ])
                ->values(),
        ]);
    }

    private function storeFacilityByType(Request $request, string $type, string $message): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('facilities', 'name')],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        Facility::query()->create($validated + ['type' => $type]);

        return back()->with('success', $message);
    }

    private function updateFacilityByType(Request $request, Facility $facility, string $type, string $message): RedirectResponse
    {
        abort_unless($facility->type === $type, 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('facilities', 'name')->ignore($facility->id)],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        $facility->update($validated);

        return back()->with('success', $message);
    }

    private function destroyFacilityByType(Facility $facility, string $type, string $message): RedirectResponse
    {
        abort_unless($facility->type === $type, 404);

        $facility->delete();

        return back()->with('success', $message);
    }

    private function validateBooking(Request $request): array
    {
        return $request->validate([
            'facility_id' => [
                'required',
                'integer',
                Rule::exists('facilities', 'id')->where('type', Facility::TYPE_FACILITY),
            ],
            'requester_type' => ['required', Rule::in(['guru', 'murid'])],
            'teacher_id' => [
                'nullable',
                'integer',
                Rule::exists('staff', 'id')->where('role', UserRole::Teacher->value),
                'required_if:requester_type,guru',
            ],
            'student_id' => ['nullable', 'integer', 'exists:students,id', 'required_if:requester_type,murid'],
            'purpose' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
        ]);
    }

    private function hasBookingOverlap(array $validated, ?int $ignoreId = null): bool
    {
        return RoomBooking::query()
            ->when($ignoreId !== null, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('facility_id', $validated['facility_id'])
            ->whereIn('status', ['scheduled', 'approved', 'in_use'])
            ->where('starts_at', '<', $validated['ends_at'])
            ->where('ends_at', '>', $validated['starts_at'])
            ->exists();
    }

    private function syncHomeroomTeacher(SchoolClass $schoolClass, ?int $teacherId): void
    {
        $schoolClass->teachers()->where('is_homeroom', true)->update(['is_homeroom' => false]);

        if ($teacherId === null) {
            return;
        }

        $existingAssignment = $schoolClass->teachers()
            ->where('staff_id', $teacherId)
            ->orderByDesc('is_homeroom')
            ->first();

        if ($existingAssignment) {
            $existingAssignment->update(['is_homeroom' => true]);

            return;
        }

        $schoolClass->teachers()->create([
            'staff_id' => $teacherId,
            'subject_name' => 'Wali Kelas',
            'is_homeroom' => true,
        ]);
    }

    private function serializeSchoolClass(SchoolClass $schoolClass): array
    {
        $homeroomAssignment = $schoolClass->teachers->firstWhere('is_homeroom', true);

        return [
            'id' => $schoolClass->id,
            'name' => $schoolClass->name,
            'grade_level' => $schoolClass->grade_level,
            'academic_year' => $schoolClass->academic_year,
            'room_name' => $schoolClass->room_name,
            'homeroom_teacher_id' => $homeroomAssignment?->staff_id,
            'students' => $schoolClass->students->map(fn (Student $student) => [
                'id' => $student->id,
                'name' => $student->name,
                'student_number' => $student->student_number,
            ])->values(),
            'teachers' => $schoolClass->teachers->map(fn (ClassTeacherAssignment $assignment) => [
                'id' => $assignment->id,
                'staff_id' => $assignment->staff_id,
                'staff_name' => $assignment->staff?->name,
                'subject_name' => $assignment->subject_name,
                'is_homeroom' => $assignment->is_homeroom,
            ])->values(),
            'schedules' => $schoolClass->schedules->map(fn (ClassSchedule $schedule) => [
                'id' => $schedule->id,
                'class_teacher_assignment_id' => $schedule->class_teacher_assignment_id,
                'semester' => $schedule->semester,
                'day_of_week' => $schedule->day_of_week,
                'subject_name' => $schedule->subject_name,
                'staff_name' => $schedule->teacherAssignment?->staff?->name ?? $schedule->staff?->name,
                'starts_at' => (string) $schedule->starts_at,
                'ends_at' => (string) $schedule->ends_at,
            ])->values(),
            'daily_journals' => $schoolClass->dailyJournals->map(fn (ClassDailyJournal $journal) => [
                'id' => $journal->id,
                'entry_date' => $journal->entry_date?->toDateString(),
                'content' => $journal->content,
            ])->values(),
            'tasks' => $schoolClass->tasks->map(fn (ClassTask $task) => [
                'id' => $task->id,
                'class_teacher_assignment_id' => $task->class_teacher_assignment_id,
                'title' => $task->title,
                'description' => $task->description,
                'due_on' => $task->due_on?->toDateString(),
                'subject_name' => $task->teacherAssignment?->subject_name,
                'staff_name' => $task->teacherAssignment?->staff?->name,
            ])->values(),
            'indicators' => $schoolClass->indicators->map(fn (AcademicIndicator $indicator) => [
                'id' => $indicator->id,
                'subject_name' => $indicator->subject_name,
                'semester' => $indicator->semester,
                'code' => $indicator->code,
                'name' => $indicator->name,
                'status' => $indicator->status,
            ])->values(),
            'assessments' => $schoolClass->assessments->map(fn (AssessmentEntry $assessment) => [
                'id' => $assessment->id,
                'student' => $assessment->student?->name,
                'indicator' => $assessment->indicator?->code,
                'subject_name' => $assessment->subject_name,
                'semester' => $assessment->semester,
                'score' => $assessment->score,
                'teacher' => $assessment->staff?->name,
            ])->values(),
            'report_links' => [
                'csv' => route('reports.classes.csv', $schoolClass),
                'print' => route('reports.classes.print', $schoolClass),
            ],
        ];
    }

    private function gradeLevels(): array
    {
        return collect(range(1, 12))
            ->map(fn (int $grade) => 'Grade '.$grade)
            ->values()
            ->all();
    }
}
