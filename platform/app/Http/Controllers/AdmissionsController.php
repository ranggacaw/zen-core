<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('ppdb/index', [
            'applicants' => Applicant::query()
                ->with(['guardian:id,name,relationship,email,phone', 'schoolClass:id,name'])
                ->latest()
                ->get()
                ->map(fn (Applicant $applicant) => [
                    'id' => $applicant->id,
                    'name' => $applicant->name,
                    'student_number' => $applicant->student_number,
                    'status' => $applicant->status,
                    'decision_notes' => $applicant->decision_notes,
                    'guardian' => $applicant->guardian?->name,
                    'guardian_phone' => $applicant->guardian?->phone,
                    'class' => $applicant->schoolClass?->name,
                    'updated_at' => $applicant->updated_at->toDateTimeString(),
                ]),
        ]);
    }

    public function show(Applicant $applicant): Response
    {
        $applicant->load([
            'guardian:id,user_id,name,relationship,email,phone,address_line,province_name,regency_name,district_name,village_name',
            'schoolClass:id,name,grade_level,academic_year,room_name',
        ]);

        return Inertia::render('ppdb/show', [
            'applicant' => [
                'id' => $applicant->id,
                'name' => $applicant->name,
                'student_number' => $applicant->student_number,
                'status' => $applicant->status,
                'decision_notes' => $applicant->decision_notes,
                'address_line' => $applicant->address_line,
                'province_name' => $applicant->province_name,
                'regency_name' => $applicant->regency_name,
                'district_name' => $applicant->district_name,
                'village_name' => $applicant->village_name,
                'guardian' => $applicant->guardian ? [
                    'name' => $applicant->guardian->name,
                    'relationship' => $applicant->guardian->relationship,
                    'email' => $applicant->guardian->email,
                    'phone' => $applicant->guardian->phone,
                    'address_line' => $applicant->guardian->address_line,
                    'province_name' => $applicant->guardian->province_name,
                    'regency_name' => $applicant->guardian->regency_name,
                    'district_name' => $applicant->guardian->district_name,
                    'village_name' => $applicant->guardian->village_name,
                ] : null,
                'school_class_id' => $applicant->school_class_id,
                'school_class' => $applicant->schoolClass ? [
                    'name' => $applicant->schoolClass->name,
                    'grade_level' => $applicant->schoolClass->grade_level,
                    'academic_year' => $applicant->schoolClass->academic_year,
                    'room_name' => $applicant->schoolClass->room_name,
                ] : null,
            ],
            'classes' => SchoolClass::query()->orderBy('name')->get(['id', 'name', 'grade_level', 'academic_year', 'room_name']),
        ]);
    }

    public function approve(Request $request, Applicant $applicant): RedirectResponse
    {
        $validated = $request->validate([
            'school_class_id' => ['nullable', 'integer', 'exists:school_classes,id'],
        ]);

        $selectedClassId = $validated['school_class_id'] ?? null;

        if (! $selectedClassId && ! $applicant->school_class_id) {
            return back()->with('error', 'Select a class before approving this PPDB record.');
        }

        DB::transaction(function () use ($applicant, $selectedClassId): void {
            if ($selectedClassId) {
                $applicant->update([
                    'school_class_id' => $selectedClassId,
                ]);
            }

            $this->syncStudentRecord($applicant->fresh());
        });

        return to_route('ppdb.show', $applicant)->with('success', 'Applicant approved.');
    }

    public function reject(Request $request, Applicant $applicant): RedirectResponse
    {
        $validated = $request->validate([
            'decision_notes' => ['required', 'string', 'max:1000'],
        ]);

        $applicant->update([
            'status' => 'rejected',
            'decision_notes' => $validated['decision_notes'],
        ]);

        return to_route('ppdb.show', $applicant)->with('success', 'Applicant rejected and retained for audit history.');
    }

    protected function nextStudentNumber(): string
    {
        $nextId = (Student::query()->max('id') ?? 0) + 1;

        return 'STD-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
    }

    protected function syncStudentRecord(Applicant $applicant): void
    {
        $student = Student::query()->firstOrNew(['applicant_id' => $applicant->id]);
        $studentNumber = $applicant->student_number;

        if (! $studentNumber || Student::query()
            ->where('student_number', $studentNumber)
            ->when($student->exists, fn ($query) => $query->whereKeyNot($student->id))
            ->exists()) {
            $studentNumber = $this->nextStudentNumber();
        }

        $student->fill([
            'guardian_id' => $applicant->guardian_id,
            'school_class_id' => $applicant->school_class_id,
            'name' => $applicant->name,
            'student_number' => $studentNumber,
            'status' => 'active',
            'address_line' => $applicant->address_line,
            'province_code' => $applicant->province_code,
            'province_name' => $applicant->province_name,
            'regency_code' => $applicant->regency_code,
            'regency_name' => $applicant->regency_name,
            'district_code' => $applicant->district_code,
            'district_name' => $applicant->district_name,
            'village_code' => $applicant->village_code,
            'village_name' => $applicant->village_name,
        ])->save();

        $applicant->update([
            'student_number' => $studentNumber,
            'status' => 'approved',
            'decision_notes' => 'Approved and activated as student record.',
        ]);
    }
}
