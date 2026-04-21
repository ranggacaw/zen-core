<?php

namespace App\Http\Controllers;

use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Http\Controllers\Concerns\ResolvesStudentLifecycleAddressData;
use App\Services\AddressReferenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GuardianController extends Controller
{
    use ResolvesStudentLifecycleAddressData;

    public function __construct(protected AddressReferenceService $addressReference)
    {
    }

    public function index(): Response
    {
        return Inertia::render('guardians/index', [
            'guardians' => Guardian::query()
                ->with(['students:id,guardian_id,name', 'applicants:id,guardian_id,name'])
                ->latest()
                ->get()
                ->map(fn (Guardian $guardian) => [
                    'id' => $guardian->id,
                    'name' => $guardian->name,
                    'relationship' => $guardian->relationship,
                    'phone' => $guardian->phone,
                    'email' => $guardian->email,
                    'address_line' => $guardian->address_line,
                    'province_code' => $guardian->province_code,
                    'regency_code' => $guardian->regency_code,
                    'district_code' => $guardian->district_code,
                    'village_code' => $guardian->village_code,
                    'avatar' => $guardian->avatar,
                    'birth_place' => $guardian->birth_place,
                    'birth_date' => $guardian->birth_date?->format('Y-m-d'),
                    'occupation' => $guardian->occupation,
                    'children_count' => $guardian->children_count,
                    'religion' => $guardian->religion,
                    'postal_code' => $guardian->postal_code,
                    'students' => $guardian->students->pluck('name')->all(),
                    'student_ids' => $guardian->students->pluck('id')->all(),
                    'applicants' => $guardian->applicants->pluck('name')->all(),
                    'updated_at' => $guardian->updated_at->toDateTimeString(),
                ]),
            'addressOptions' => $this->addressOptions($this->addressReference),
            'students' => Student::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $guardian = Guardian::query()->create([
            'name' => $validated['name'],
            'relationship' => $validated['relationship'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address_line' => $validated['address_line'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'occupation' => $validated['occupation'] ?? null,
            'children_count' => $validated['children_count'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            ...$this->addressNames($this->addressReference, $validated),
        ]);

        if (isset($validated['students']) && is_array($validated['students'])) {
            \App\Domain\StudentLifecycle\Models\Student::whereIn('id', $validated['students'])
                ->update(['guardian_id' => $guardian->id]);
        }

        return back()->with('success', 'Guardian record created.');
    }

    public function update(Request $request, Guardian $guardian): RedirectResponse
    {
        $validated = $request->validate($this->rules($guardian));

        $guardian->update([
            'name' => $validated['name'],
            'relationship' => $validated['relationship'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address_line' => $validated['address_line'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'occupation' => $validated['occupation'] ?? null,
            'children_count' => $validated['children_count'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            ...$this->addressNames($this->addressReference, $validated),
        ]);

        if (array_key_exists('students', $validated) && is_array($validated['students'])) {
            \App\Domain\StudentLifecycle\Models\Student::where('guardian_id', $guardian->id)
                ->whereNotIn('id', $validated['students'])
                ->update(['guardian_id' => null]);

            if (! empty($validated['students'])) {
                \App\Domain\StudentLifecycle\Models\Student::whereIn('id', $validated['students'])
                    ->update(['guardian_id' => $guardian->id]);
            }
        }

        return back()->with('success', 'Guardian record updated.');
    }

    public function create(): Response
    {
        return Inertia::render('guardians/create', [
            'addressOptions' => $this->addressOptions($this->addressReference),
            'students' => Student::select('id', 'name')->get(),
        ]);
    }

    public function edit(Guardian $guardian): Response
    {
        return Inertia::render('guardians/edit', [
            'guardian' => [
                'id' => $guardian->id,
                'name' => $guardian->name,
                'relationship' => $guardian->relationship,
                'phone' => $guardian->phone,
                'email' => $guardian->email,
                'address_line' => $guardian->address_line,
                'province_code' => $guardian->province_code,
                'regency_code' => $guardian->regency_code,
                'district_code' => $guardian->district_code,
                'village_code' => $guardian->village_code,
                'birth_place' => $guardian->birth_place,
                'birth_date' => $guardian->birth_date?->format('Y-m-d'),
                'occupation' => $guardian->occupation,
                'children_count' => $guardian->children_count,
                'religion' => $guardian->religion,
                'postal_code' => $guardian->postal_code,
                'student_ids' => $guardian->students->pluck('id')->all(),
            ],
            'addressOptions' => $this->addressOptions($this->addressReference),
            'students' => Student::select('id', 'name')->get(),
        ]);
    }

    public function destroy(Guardian $guardian): RedirectResponse
    {
        if ($guardian->students()->exists() || $guardian->applicants()->exists()) {
            return back()->with('error', 'Guardians linked to students or applicants cannot be deleted.');
        }

        $guardian->delete();

        return back()->with('success', 'Guardian record deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    protected function rules(?Guardian $guardian = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('guardians', 'email')->ignore($guardian?->id)],
            'address_line' => ['nullable', 'string', 'max:255'],
            'province_code' => ['nullable', 'string', 'max:50'],
            'regency_code' => ['nullable', 'string', 'max:50'],
            'district_code' => ['nullable', 'string', 'max:50'],
            'village_code' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'string'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'children_count' => ['nullable', 'integer', 'min:0'],
            'religion' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'students' => ['nullable', 'array'],
            'students.*' => ['integer', 'exists:students,id'],
        ];
    }
}
