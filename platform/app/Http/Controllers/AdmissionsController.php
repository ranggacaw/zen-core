<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Http\Controllers\Concerns\ResolvesStudentLifecycleAddressData;
use App\Services\AddressReferenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionsController extends Controller
{
    use ResolvesStudentLifecycleAddressData;

    public function __construct(protected AddressReferenceService $addressReference)
    {
    }

    public function index(): Response
    {
        return Inertia::render('ppdb/index', [
            'applicants' => Applicant::query()
                ->with(['guardian:id,name,relationship,email,phone,address_line,province_code,regency_code,district_code,village_code', 'schoolClass:id,name'])
                ->latest()
                ->get()
                ->map(fn (Applicant $applicant) => [
                    'id' => $applicant->id,
                    'name' => $applicant->name,
                    'student_number' => $applicant->student_number,
                    'status' => $applicant->status,
                    'decision_notes' => $applicant->decision_notes,
                    'guardian_id' => $applicant->guardian_id,
                    'guardian' => $applicant->guardian?->name,
                    'guardian_name' => $applicant->guardian?->name,
                    'guardian_email' => $applicant->guardian?->email,
                    'guardian_phone' => $applicant->guardian?->phone,
                    'relationship' => $applicant->guardian?->relationship,
                    'school_class_id' => $applicant->school_class_id,
                    'class' => $applicant->schoolClass?->name,
                    'address_line' => $applicant->address_line,
                    'province_code' => $applicant->province_code,
                    'regency_code' => $applicant->regency_code,
                    'district_code' => $applicant->district_code,
                    'village_code' => $applicant->village_code,
                    'updated_at' => $applicant->updated_at->toDateTimeString(),
                ]),
            'classes' => SchoolClass::query()->orderBy('name')->get(['id', 'name']),
            'addressOptions' => $this->addressOptions($this->addressReference),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        DB::transaction(function () use ($validated) {
            $guardian = Guardian::query()->create([
                'name' => $validated['guardian_name'],
                'email' => $validated['guardian_email'] ?? null,
                'phone' => $validated['guardian_phone'] ?? null,
                'relationship' => $validated['relationship'] ?? 'Parent',
                'address_line' => $validated['address_line'] ?? null,
                ...$this->addressNames($this->addressReference, $validated),
            ]);

            Applicant::query()->create([
                'guardian_id' => $guardian->id,
                'school_class_id' => $validated['school_class_id'] ?? null,
                'name' => $validated['name'],
                'student_number' => $validated['student_number'] ?? null,
                'status' => 'pending',
                'address_line' => $validated['address_line'] ?? null,
                ...$this->addressNames($this->addressReference, $validated),
            ]);
        });

        return back()->with('success', 'Applicant created.');
    }

    public function update(Request $request, Applicant $applicant): RedirectResponse
    {
        $validated = $request->validate($this->rules($applicant));

        DB::transaction(function () use ($validated, $applicant) {
            $guardian = $applicant->guardian;

            if (! $guardian) {
                $guardian = Guardian::query()->create([
                    'name' => $validated['guardian_name'],
                    'relationship' => $validated['relationship'] ?? 'Parent',
                ]);
            }

            $guardian->update([
                'name' => $validated['guardian_name'],
                'email' => $validated['guardian_email'] ?? null,
                'phone' => $validated['guardian_phone'] ?? null,
                'relationship' => $validated['relationship'] ?? 'Parent',
                'address_line' => $validated['address_line'] ?? null,
                ...$this->addressNames($this->addressReference, $validated),
            ]);

            $applicant->update([
                'guardian_id' => $guardian->id,
                'school_class_id' => $validated['school_class_id'] ?? null,
                'name' => $validated['name'],
                'student_number' => $validated['student_number'] ?? null,
                'address_line' => $validated['address_line'] ?? null,
                ...$this->addressNames($this->addressReference, $validated),
            ]);

            if ($applicant->status === 'approved' || Student::query()->where('applicant_id', $applicant->id)->exists()) {
                $this->syncStudentRecord($applicant->fresh(['guardian']));
            }
        });

        return back()->with('success', 'Applicant updated.');
    }

    public function approve(Applicant $applicant): RedirectResponse
    {
        DB::transaction(function () use ($applicant) {
            $this->syncStudentRecord($applicant);
        });

        return back()->with('success', 'Applicant approved.');
    }

    public function reject(Request $request, Applicant $applicant): RedirectResponse
    {
        $validated = $request->validate([
            'decision_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $applicant->update([
            'status' => 'rejected',
            'decision_notes' => $validated['decision_notes'] ?? 'Rejected during admissions review.',
        ]);

        return back()->with('success', 'Applicant rejected and retained for audit history.');
    }

    public function destroy(Applicant $applicant): RedirectResponse
    {
        if ($applicant->status === 'approved' || Student::query()->where('applicant_id', $applicant->id)->exists()) {
            return back()->with('error', 'Approved applicants are retained as audit history and cannot be deleted.');
        }

        DB::transaction(function () use ($applicant) {
            $guardianId = $applicant->guardian_id;

            $applicant->delete();

            if (! $guardianId) {
                return;
            }

            $guardian = Guardian::query()->find($guardianId);

            if (! $guardian) {
                return;
            }

            if (! $guardian->students()->exists() && ! $guardian->applicants()->exists()) {
                $guardian->delete();
            }
        });

        return back()->with('success', 'Applicant deleted.');
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

    /**
     * @return array<string, mixed>
     */
    protected function rules(?Applicant $applicant = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'student_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('applicants', 'student_number')->ignore($applicant?->id),
                function (string $attribute, mixed $value, \Closure $fail) use ($applicant): void {
                    if (! is_string($value) || $value === '') {
                        return;
                    }

                    $studentQuery = Student::query()->where('student_number', $value);

                    if ($applicant) {
                        $studentQuery->where(function ($query) use ($applicant) {
                            $query->whereNull('applicant_id')->orWhere('applicant_id', '!=', $applicant->id);
                        });
                    }

                    if ($studentQuery->exists()) {
                        $fail('The student number has already been taken.');
                    }
                },
            ],
            'school_class_id' => ['nullable', 'integer', 'exists:school_classes,id'],
            'guardian_name' => ['required', 'string', 'max:255'],
            'guardian_email' => ['nullable', 'email', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:50'],
            'relationship' => ['nullable', 'string', 'max:100'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'province_code' => ['nullable', 'string', 'max:50'],
            'regency_code' => ['nullable', 'string', 'max:50'],
            'district_code' => ['nullable', 'string', 'max:50'],
            'village_code' => ['nullable', 'string', 'max:50'],
        ];
    }
}
