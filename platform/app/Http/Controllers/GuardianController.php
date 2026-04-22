<?php

namespace App\Http\Controllers;

use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesStudentLifecycleAddressData;
use App\Services\AddressReferenceService;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
                ->withCount('students')
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
                    'linked_children_count' => $guardian->students_count,
                    'religion' => $guardian->religion,
                    'postal_code' => $guardian->postal_code,
                    'students' => $guardian->students->pluck('name')->all(),
                    'student_ids' => $guardian->students->pluck('id')->all(),
                    'applicants' => $guardian->applicants->pluck('name')->all(),
                    'updated_at' => $guardian->updated_at->toDateTimeString(),
                ]),
            'addressOptions' => $this->addressOptions($this->addressReference),
            'students' => Student::query()->orderBy('name')->get(['id', 'name', 'student_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        DB::transaction(function () use ($request, $validated): void {
            $guardian = Guardian::query()->create([
                'name' => $validated['name'],
                'relationship' => $validated['relationship'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'address_line' => $validated['address_line'] ?? null,
                'avatar' => $request->hasFile('avatar')
                    ? $request->file('avatar')->store('guardians/avatars', config('zen.upload_disk', 'public'))
                    : null,
                'birth_place' => $validated['birth_place'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'occupation' => $validated['occupation'] ?? null,
                'children_count' => $validated['children_count'] ?? null,
                'religion' => $validated['religion'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                ...$this->addressNames($this->addressReference, $validated),
            ]);

            $this->syncLinkedUser($guardian, $validated['name'], $validated['email'] ?? null);
            $this->syncStudents($guardian, $validated['students'] ?? null);
        });

        return back()->with('success', 'Guardian record created.');
    }

    public function update(Request $request, Guardian $guardian): RedirectResponse
    {
        $validated = $request->validate($this->rules($guardian));

        DB::transaction(function () use ($request, $validated, $guardian): void {
            $disk = config('zen.upload_disk', 'public');
            $avatarPath = $guardian->avatar;

            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('guardians/avatars', $disk);

                if ($guardian->avatar) {
                    Storage::disk($disk)->delete($guardian->avatar);
                }
            }

            $guardian->update([
                'name' => $validated['name'],
                'relationship' => $validated['relationship'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'address_line' => $validated['address_line'] ?? null,
                'avatar' => $avatarPath,
                'birth_place' => $validated['birth_place'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'occupation' => $validated['occupation'] ?? null,
                'children_count' => $validated['children_count'] ?? null,
                'religion' => $validated['religion'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                ...$this->addressNames($this->addressReference, $validated),
            ]);

            $this->syncLinkedUser($guardian, $validated['name'], $validated['email'] ?? null);
            $this->syncStudents($guardian, $validated['students'] ?? null);
        });

        return back()->with('success', 'Guardian record updated.');
    }

    public function create(): Response
    {
        return Inertia::render('guardians/create', [
            'addressOptions' => $this->addressOptions($this->addressReference),
            'students' => Student::query()->orderBy('name')->get(['id', 'name', 'student_number']),
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
                'avatar' => $guardian->avatar,
                'birth_place' => $guardian->birth_place,
                'birth_date' => $guardian->birth_date?->format('Y-m-d'),
                'occupation' => $guardian->occupation,
                'children_count' => $guardian->children_count,
                'religion' => $guardian->religion,
                'postal_code' => $guardian->postal_code,
                'student_ids' => $guardian->students->pluck('id')->all(),
            ],
            'addressOptions' => $this->addressOptions($this->addressReference),
            'students' => Student::query()->orderBy('name')->get(['id', 'name', 'student_number']),
        ]);
    }

    public function destroy(Guardian $guardian): RedirectResponse
    {
        if ($guardian->students()->exists() || $guardian->applicants()->exists()) {
            return back()->with('error', 'Guardians linked to students or applicants cannot be deleted.');
        }

        DB::transaction(function () use ($guardian): void {
            $disk = config('zen.upload_disk', 'public');

            if ($guardian->avatar) {
                Storage::disk($disk)->delete($guardian->avatar);
            }

            $guardian->user?->delete();
            $guardian->delete();
        });

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
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('guardians', 'email')->ignore($guardian?->id),
                Rule::unique('users', 'email')->ignore($guardian?->user_id),
            ],
            'address_line' => ['nullable', 'string', 'max:255'],
            'province_code' => ['nullable', 'string', 'max:50'],
            'regency_code' => ['nullable', 'string', 'max:50'],
            'district_code' => ['nullable', 'string', 'max:50'],
            'village_code' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'image', 'max:2048'],
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

    /**
     * @param  array<int, int|string>|null  $studentIds
     */
    protected function syncStudents(Guardian $guardian, ?array $studentIds): void
    {
        if (! is_array($studentIds)) {
            return;
        }

        $ids = collect($studentIds)
            ->map(fn (int|string $id) => (int) $id)
            ->filter()
            ->values()
            ->all();

        Student::query()
            ->where('guardian_id', $guardian->id)
            ->whereNotIn('id', $ids === [] ? [0] : $ids)
            ->update(['guardian_id' => null]);

        if ($ids !== []) {
            Student::query()->whereIn('id', $ids)->update(['guardian_id' => $guardian->id]);
        }
    }

    protected function syncLinkedUser(Guardian $guardian, string $name, ?string $email): void
    {
        if (! $email) {
            if ($guardian->user) {
                $guardian->user->delete();
                $guardian->update(['user_id' => null]);
            }

            return;
        }

        $user = $guardian->user ?? User::query()->create([
            'name' => $name,
            'email' => $email,
            'role' => UserRole::RegisteredUser,
            'password' => Hash::make(Str::password(16)),
        ]);

        $user->update([
            'name' => $name,
            'email' => $email,
            'role' => UserRole::RegisteredUser,
        ]);

        $role = Role::query()->firstOrCreate(
            ['name' => 'user'],
            ['description' => 'Regular user']
        );

        $user->assignRole($role);

        if ($guardian->user_id !== $user->id) {
            $guardian->update(['user_id' => $user->id]);
        }
    }
}
