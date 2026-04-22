<?php

namespace App\Http\Controllers\MasterData;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Services\AddressReferenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected AddressReferenceService $addressReference)
    {
    }

    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->user_type, fn ($query, $type) => $query->where('role', $type))
            ->when($request->date_from, fn ($query, $date) => $query->where('created_at', '>=', $date))
            ->when($request->date_to, fn ($query, $date) => $query->where('created_at', '<=', $date))
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('master-data/users/index', [
            'users' => $users,
            'filters' => $request->only(['user_type', 'date_from', 'date_to']),
            'roles' => Role::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('master-data/users/create', [
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['nullable', 'string'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'registered_user',
        ]);

        $defaultRole = Role::query()->where('name', 'superadmin')->first();

        if ($defaultRole) {
            $user->assignRole($defaultRole);
        }

        return to_route('master-data.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('master-data/users/edit', [
            'user' => $user->load('roles', 'permissions'),
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'role' => ['nullable', 'string'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'] ?? $user->role,
        ]);

        return to_route('master-data.users.index')->with('success', 'User updated successfully.');
    }

    public function profile(User $user)
    {
        $user->load('roles', 'permissions', 'staff');

        $staff = $user->staff;
        $canEditPersonalData = $staff !== null && $this->canEditPersonalData($staff);

        return Inertia::render('master-data/users/profile', [
            'user' => $user,
            'staff' => $staff ? [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'role_display' => $this->roleDisplay($user),
                'staff_type' => $staff->resolvedType(),
                'position' => $staff->position,
                'employee_number' => $staff->employee_number,
                'employment_status' => $staff->employment_status,
                'avatar' => $staff->avatar,
                'avatar_url' => $staff->avatar_url,
                'nik' => $staff->nik,
                'education' => $staff->education,
                'specialization_subjects' => $staff->specialization_subjects ?? [],
                'phone' => $staff->phone,
                'gender' => $staff->gender,
                'birth_place' => $staff->birth_place,
                'birth_date' => $staff->birth_date?->toDateString(),
                'nip' => $staff->nip,
                'religion' => $staff->religion,
                'bank_name' => $staff->bank_name,
                'bank_account' => $staff->bank_account,
                'join_date' => $staff->join_date?->toDateString(),
                'end_date' => $staff->end_date?->toDateString(),
                'decree_permanent' => $staff->decree_permanent,
                'decree_contract' => $staff->decree_contract,
                'address_line' => $staff->address_line,
                'province_code' => $staff->province_code,
                'province_name' => $staff->province_name,
                'regency_code' => $staff->regency_code,
                'regency_name' => $staff->regency_name,
                'district_code' => $staff->district_code,
                'district_name' => $staff->district_name,
                'village_code' => $staff->village_code,
                'village_name' => $staff->village_name,
                'postal_code' => $staff->postal_code,
            ] : null,
            'can_edit_personal_data' => $canEditPersonalData,
            'default_tab' => $canEditPersonalData ? 'data-diri' : 'password',
            'religions' => Staff::religionOptions(),
            'addressOptions' => $this->addressOptions($staff?->province_code, $staff?->regency_code, $staff?->district_code),
            'subjects' => $this->subjectOptions(),
        ]);
    }

    public function updateProfile(Request $request, User $user): RedirectResponse
    {
        $user->loadMissing('staff');

        $staff = $user->staff;

        if (! $staff || ! $this->canEditPersonalData($staff)) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
                Rule::unique('staff', 'email')->ignore($staff->id),
            ],
            'position' => ['required', 'string', 'max:255'],
            'employee_number' => ['required', 'string', 'max:50', Rule::unique('staff', 'employee_number')->ignore($staff->id)],
            'employment_status' => ['nullable', Rule::in(['active', 'inactive'])],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'nik' => ['nullable', 'string', 'max:50'],
            'education' => ['nullable', 'string', 'max:255'],
            'specialization_subjects' => ['nullable', 'array'],
            'specialization_subjects.*' => ['integer', 'exists:academic_indicators,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', Rule::in(['L', 'P'])],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'nip' => ['nullable', 'string', 'max:100'],
            'religion' => ['nullable', 'string', 'max:100'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'bank_account' => ['nullable', 'string', 'max:100'],
            'join_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:join_date'],
            'decree_permanent' => ['nullable', 'string', 'max:255'],
            'decree_contract' => ['nullable', 'string', 'max:255'],
            'address_line' => ['nullable', 'string', 'max:500'],
            'province_code' => ['nullable', 'string', 'max:50'],
            'regency_code' => ['nullable', 'string', 'max:50'],
            'district_code' => ['nullable', 'string', 'max:50'],
            'village_code' => ['nullable', 'string', 'max:50'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        DB::transaction(function () use ($validated, $staff, $user) {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $staff->update(array_merge([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'position' => $validated['position'],
                'employee_number' => $validated['employee_number'],
                'employment_status' => $validated['employment_status'] ?? $staff->employment_status,
                'nik' => $validated['nik'] ?? null,
                'education' => $validated['education'] ?? null,
                'specialization_subjects' => $validated['specialization_subjects'] ?? [],
                'phone' => $validated['phone'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'birth_place' => $validated['birth_place'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'nip' => $validated['nip'] ?? null,
                'religion' => $validated['religion'] ?? null,
                'bank_name' => $validated['bank_name'] ?? null,
                'bank_account' => $validated['bank_account'] ?? null,
                'join_date' => $validated['join_date'] ?? null,
                'end_date' => $validated['end_date'] ?? null,
                'decree_permanent' => $validated['decree_permanent'] ?? null,
                'decree_contract' => $validated['decree_contract'] ?? null,
                'address_line' => $validated['address_line'] ?? null,
                'province_code' => $validated['province_code'] ?? null,
                'regency_code' => $validated['regency_code'] ?? null,
                'district_code' => $validated['district_code'] ?? null,
                'village_code' => $validated['village_code'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
            ], $this->addressNames($validated)));
        });

        $this->syncAvatar($request, $staff->fresh());

        return back()->with('success', 'Employee profile updated successfully.');
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user->update([
            'password' => $validated['password'],
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }

    protected function canEditPersonalData(Staff $staff): bool
    {
        return $staff->resolvedType() === Staff::TYPE_PENGAJAR;
    }

    protected function roleDisplay(User $user): string
    {
        $roles = $user->roles->pluck('name')->filter()->values();

        if ($roles->isNotEmpty()) {
            return $roles->join(', ');
        }

        $role = $user->role;

        return ucfirst((string) (is_object($role) && property_exists($role, 'value') ? $role->value : $role));
    }

    protected function syncAvatar(Request $request, Staff $staff): void
    {
        if (! $request->hasFile('avatar')) {
            return;
        }

        $disk = config('zen.upload_disk', 'public');

        if ($staff->avatar) {
            Storage::disk($disk)->delete($staff->avatar);
        }

        $staff->update([
            'avatar' => $request->file('avatar')->store('staff/avatars', $disk),
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string|null>
     */
    protected function addressNames(array $data): array
    {
        $names = [];

        if (! empty($data['province_code'])) {
            $names['province_name'] = $this->addressReference->findProvinceName($data['province_code']);
        }

        if (! empty($data['regency_code']) && ! empty($data['province_code'])) {
            $names['regency_name'] = $this->addressReference->findRegencyName($data['province_code'], $data['regency_code']);
        }

        if (! empty($data['district_code']) && ! empty($data['regency_code'])) {
            $names['district_name'] = $this->addressReference->findDistrictName($data['regency_code'], $data['district_code']);
        }

        if (! empty($data['village_code']) && ! empty($data['district_code'])) {
            $names['village_name'] = $this->addressReference->findVillageName($data['district_code'], $data['village_code']);
        }

        return $names;
    }

    protected function subjectOptions(): array
    {
        return AcademicIndicator::query()
            ->orderBy('name')
            ->get()
            ->map(fn (AcademicIndicator $indicator) => ['value' => $indicator->id, 'label' => $indicator->name])
            ->all();
    }

    protected function addressOptions(?string $provinceCode = null, ?string $regencyCode = null, ?string $districtCode = null): array
    {
        return [
            'provinces' => $this->addressReference->provinces(),
            'regencies' => $provinceCode ? $this->addressReference->regencies($provinceCode) : [],
            'districts' => $regencyCode ? $this->addressReference->districts($regencyCode) : [],
            'villages' => $districtCode ? $this->addressReference->villages($districtCode) : [],
        ];
    }
}
