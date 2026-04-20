<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Http\Controllers\Concerns\ResolvesStudentLifecycleAddressData;
use App\Services\AddressReferenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    use ResolvesStudentLifecycleAddressData;

    public function __construct(protected AddressReferenceService $addressReference)
    {
    }

    public function index(): Response
    {
        return Inertia::render('students/index', [
            'students' => Student::query()
                ->with(['guardian:id,name,relationship', 'schoolClass:id,name'])
                ->latest()
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'nickname' => $student->nickname,
                    'student_number' => $student->student_number,
                    'religion' => $student->religion,
                    'phone' => $student->phone,
                    'email' => $student->email,
                    'avatar' => $student->avatar,
                    'birth_place' => $student->birth_place,
                    'birth_date' => $student->birth_date?->toDateString(),
                    'gender' => $student->gender,
                    'child_number' => $student->child_number,
                    'child_of_total' => $student->child_of_total,
                    'citizenship' => $student->citizenship,
                    'join_date' => $student->join_date?->toDateString(),
                    'end_date' => $student->end_date?->toDateString(),
                    'postal_code' => $student->postal_code,
                    'domicile_address' => $student->domicile_address,
                    'status' => $student->status,
                    'guardian_id' => $student->guardian_id,
                    'school_class_id' => $student->school_class_id,
                    'guardian' => $student->guardian?->name,
                    'relationship' => $student->guardian?->relationship,
                    'class' => $student->schoolClass?->name,
                    'address_line' => $student->address_line,
                    'province_code' => $student->province_code,
                    'regency_code' => $student->regency_code,
                    'district_code' => $student->district_code,
                    'village_code' => $student->village_code,
                    'updated_at' => $student->updated_at->toDateTimeString(),
                ]),
            'guardians' => Guardian::query()->orderBy('name')->get(['id', 'name', 'relationship']),
            'classes' => SchoolClass::query()->orderBy('name')->get(['id', 'name']),
            'addressOptions' => $this->addressOptions($this->addressReference),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $data = [
            'guardian_id' => $validated['guardian_id'],
            'school_class_id' => $validated['school_class_id'] ?? null,
            'name' => $validated['name'],
            'nickname' => $validated['nickname'] ?? null,
            'student_number' => $validated['student_number'],
            'religion' => $validated['religion'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'child_number' => $validated['child_number'] ?? null,
            'child_of_total' => $validated['child_of_total'] ?? null,
            'citizenship' => $validated['citizenship'] ?? null,
            'join_date' => $validated['join_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'domicile_address' => $validated['domicile_address'] ?? null,
            'status' => $validated['status'],
            'address_line' => $validated['address_line'] ?? null,
        ];

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        Student::query()->create([
            ...$data,
            ...$this->addressNames($this->addressReference, $validated),
        ]);

        return back()->with('success', 'Student record created.');
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate($this->rules($student));

        $data = [
            'guardian_id' => $validated['guardian_id'],
            'school_class_id' => $validated['school_class_id'] ?? null,
            'name' => $validated['name'],
            'nickname' => $validated['nickname'] ?? null,
            'student_number' => $validated['student_number'],
            'religion' => $validated['religion'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'child_number' => $validated['child_number'] ?? null,
            'child_of_total' => $validated['child_of_total'] ?? null,
            'citizenship' => $validated['citizenship'] ?? null,
            'join_date' => $validated['join_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'domicile_address' => $validated['domicile_address'] ?? null,
            'status' => $validated['status'],
            'address_line' => $validated['address_line'] ?? null,
        ];

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $student->update([
            ...$data,
            ...$this->addressNames($this->addressReference, $validated),
        ]);

        return back()->with('success', 'Student record updated.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        if ($student->attendanceRecords()->exists() || $student->assessmentEntries()->exists() || $student->billingRecords()->exists()) {
            return back()->with('error', 'Student records with operational history cannot be deleted.');
        }

        $student->delete();

        return back()->with('success', 'Student record deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    protected function rules(?Student $student = null): array
    {
        return [
            'guardian_id' => ['required', 'integer', 'exists:guardians,id'],
            'school_class_id' => ['nullable', 'integer', 'exists:school_classes,id'],
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string', 'max:255'],
            'student_number' => ['required', 'string', 'max:50', Rule::unique('students', 'student_number')->ignore($student?->id)],
            'religion' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:L,P'],
            'child_number' => ['nullable', 'string', 'max:10'],
            'child_of_total' => ['nullable', 'string', 'max:10'],
            'citizenship' => ['nullable', 'string', 'max:50'],
            'join_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'domicile_address' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'in:active,graduated,dropped'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'province_code' => ['nullable', 'string', 'max:50'],
            'regency_code' => ['nullable', 'string', 'max:50'],
            'district_code' => ['nullable', 'string', 'max:50'],
            'village_code' => ['nullable', 'string', 'max:50'],
        ];
    }
}
