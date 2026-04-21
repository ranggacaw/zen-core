<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesStudentLifecycleAddressData;
use App\Models\User;
use App\Services\AddressReferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    use ResolvesStudentLifecycleAddressData;

    public function __construct(protected AddressReferenceService $addressReference)
    {
    }

    public function index(): RedirectResponse
    {
        return to_route('staff.pengajar.index');
    }

    public function store(Request $request): RedirectResponse
    {
        $type = $request->input('role') === UserRole::Teacher->value
            ? Staff::TYPE_PENGAJAR
            : Staff::TYPE_NON_PENGAJAR;

        $validated = $request->validate($this->rules($request, null, $this->allowedRolesForType($type)));

        $this->storeStaff($request, $validated, $type);

        return back()->with('success', ($validated['create_user_account'] ?? false)
            ? 'Staff member onboarded with linked system access.'
            : 'Staff member onboarded without a login account.');
    }

    public function pengajarIndex(): Response
    {
        return $this->renderIndex(Staff::TYPE_PENGAJAR);
    }

    public function nonPengajarIndex(): Response
    {
        return $this->renderIndex(Staff::TYPE_NON_PENGAJAR);
    }

    public function createPengajar(): Response
    {
        return $this->renderForm(Staff::TYPE_PENGAJAR);
    }

    public function createNonPengajar(): Response
    {
        return $this->renderForm(Staff::TYPE_NON_PENGAJAR);
    }

    public function storePengajar(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules($request, null, $this->allowedRolesForType(Staff::TYPE_PENGAJAR)));

        $this->storeStaff($request, $validated, Staff::TYPE_PENGAJAR);

        return to_route('staff.pengajar.index')->with('success', 'Pengajar record created.');
    }

    public function storeNonPengajar(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules($request, null, $this->allowedRolesForType(Staff::TYPE_NON_PENGAJAR)));

        $this->storeStaff($request, $validated, Staff::TYPE_NON_PENGAJAR);

        return to_route('staff.non-pengajar.index')->with('success', 'Non-pengajar record created.');
    }

    public function editPengajar(Staff $staff): Response
    {
        $this->ensureTypeMatches($staff, Staff::TYPE_PENGAJAR);

        return $this->renderForm(Staff::TYPE_PENGAJAR, $staff);
    }

    public function editNonPengajar(Staff $staff): Response
    {
        $this->ensureTypeMatches($staff, Staff::TYPE_NON_PENGAJAR);

        return $this->renderForm(Staff::TYPE_NON_PENGAJAR, $staff);
    }

    public function updatePengajar(Request $request, Staff $staff): RedirectResponse
    {
        $this->ensureTypeMatches($staff, Staff::TYPE_PENGAJAR);

        $validated = $request->validate($this->rules($request, $staff, $this->allowedRolesForType(Staff::TYPE_PENGAJAR)));

        $this->updateStaff($request, $staff, $validated, Staff::TYPE_PENGAJAR);

        return to_route('staff.pengajar.index')->with('success', 'Pengajar record updated.');
    }

    public function updateNonPengajar(Request $request, Staff $staff): RedirectResponse
    {
        $this->ensureTypeMatches($staff, Staff::TYPE_NON_PENGAJAR);

        $validated = $request->validate($this->rules($request, $staff, $this->allowedRolesForType(Staff::TYPE_NON_PENGAJAR)));

        $this->updateStaff($request, $staff, $validated, Staff::TYPE_NON_PENGAJAR);

        return to_route('staff.non-pengajar.index')->with('success', 'Non-pengajar record updated.');
    }

    public function destroyPengajar(Staff $staff): RedirectResponse
    {
        $this->ensureTypeMatches($staff, Staff::TYPE_PENGAJAR);

        $this->deleteStaff($staff);

        return to_route('staff.pengajar.index')->with('success', 'Pengajar record deleted.');
    }

    public function destroyNonPengajar(Staff $staff): RedirectResponse
    {
        $this->ensureTypeMatches($staff, Staff::TYPE_NON_PENGAJAR);

        $this->deleteStaff($staff);

        return to_route('staff.non-pengajar.index')->with('success', 'Non-pengajar record deleted.');
    }

    public function pengajarLookup(Request $request): JsonResponse
    {
        $teachers = Staff::query()
            ->forType(Staff::TYPE_PENGAJAR)
            ->select(['id', 'name', 'position', 'phone'])
            ->when($request->filled('q'), fn ($query) => $query->where('name', 'like', '%'.$request->string('q').'%'))
            ->orderBy('name')
            ->paginate(10);

        return response()->json($teachers);
    }

    protected function renderIndex(string $type): Response
    {
        $routePrefix = $this->routePrefixForType($type);

        return Inertia::render('staff/manage', [
            'staffType' => $type,
            'staffTypeLabel' => Staff::labelForType($type),
            'createUrl' => route($routePrefix.'.create'),
            'items' => Staff::query()
                ->forType($type)
                ->with('user:id')
                ->latest()
                ->get()
                ->map(fn (Staff $staff) => [
                    'id' => $staff->id,
                    'name' => $staff->name,
                    'email' => $staff->email,
                    'phone' => $staff->phone,
                    'role' => $staff->role,
                    'position' => $staff->position,
                    'employee_number' => $staff->employee_number,
                    'employment_status' => $staff->employment_status,
                    'address' => collect([$staff->district_name, $staff->regency_name, $staff->province_name])->filter()->implode(', '),
                    'has_user_account' => $staff->user_id !== null,
                    'edit_url' => route($routePrefix.'.edit', $staff),
                    'delete_url' => route($routePrefix.'.destroy', $staff),
                ])
                ->values(),
        ]);
    }

    protected function renderForm(string $type, ?Staff $staff = null): Response
    {
        $routePrefix = $this->routePrefixForType($type);

        return Inertia::render('staff/form', [
            'staffType' => $type,
            'staffTypeLabel' => Staff::labelForType($type),
            'backUrl' => route($routePrefix.'.index'),
            'submitUrl' => $staff ? route($routePrefix.'.update', $staff) : route($routePrefix.'.store'),
            'roles' => $this->roleOptionsForType($type),
            'religions' => Staff::religionOptions(),
            'genders' => [
                ['value' => 'L', 'label' => 'Laki-laki'],
                ['value' => 'P', 'label' => 'Perempuan'],
            ],
            'addressOptions' => $this->addressOptions(
                $this->addressReference,
                $staff?->province_code,
                $staff?->regency_code,
                $staff?->district_code,
            ),
            'indicators' => $this->indicatorOptions(),
            'staff' => $staff ? [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'position' => $staff->position,
                'employee_number' => $staff->employee_number,
                'employment_status' => $staff->employment_status,
                'avatar' => $staff->avatar,
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
                'regency_code' => $staff->regency_code,
                'district_code' => $staff->district_code,
                'village_code' => $staff->village_code,
                'postal_code' => $staff->postal_code,
                'has_user_account' => $staff->user_id !== null,
            ] : null,
        ]);
    }

    protected function storeStaff(Request $request, array $validated, string $type): Staff
    {
        $staff = DB::transaction(function () use ($validated, $type) {
            $staff = Staff::query()->create($this->staffPayload($validated, $type));

            $this->syncLinkedUser($staff, $validated);

            return $staff->refresh();
        });

        $this->syncAvatar($request, $staff);

        return $staff->refresh();
    }

    protected function updateStaff(Request $request, Staff $staff, array $validated, string $type): void
    {
        DB::transaction(function () use ($staff, $validated, $type) {
            $staff->update($this->staffPayload($validated, $type, $staff));

            $this->syncLinkedUser($staff->refresh(), $validated);
        });

        $this->syncAvatar($request, $staff->refresh());
    }

    protected function deleteStaff(Staff $staff): void
    {
        DB::transaction(function () use ($staff) {
            if ($staff->avatar) {
                Storage::disk(config('zen.upload_disk', 'public'))->delete($staff->avatar);
            }

            $staff->user?->delete();
            $staff->delete();
        });
    }

    protected function syncLinkedUser(Staff $staff, array $validated): void
    {
        if ($staff->user !== null) {
            $staff->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]);

            return;
        }

        if (! ($validated['create_user_account'] ?? false)) {
            return;
        }

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $staff->update(['user_id' => $user->id]);
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
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function staffPayload(array $validated, string $type, ?Staff $staff = null): array
    {
        return [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'staff_type' => $type,
            'position' => $validated['position'],
            'employee_number' => $validated['employee_number'],
            'employment_status' => $validated['employment_status'] ?? $staff?->employment_status ?? 'active',
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
            'postal_code' => $validated['postal_code'] ?? null,
            ...$this->addressNames($this->addressReference, $validated),
        ];
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    protected function rules(Request $request, ?Staff $staff, array $allowedRoles): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('staff', 'email')->ignore($staff?->id),
                function (string $attribute, mixed $value, \Closure $fail) use ($request, $staff): void {
                    if (! $request->boolean('create_user_account') && $staff?->user === null) {
                        return;
                    }

                    $query = User::query()->where('email', $value);

                    if ($staff?->user_id !== null) {
                        $query->whereKeyNot($staff->user_id);
                    }

                    if ($query->exists()) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            'role' => ['required', Rule::in($allowedRoles)],
            'position' => ['required', 'string', 'max:255'],
            'employee_number' => ['required', 'string', 'max:50', Rule::unique('staff', 'employee_number')->ignore($staff?->id)],
            'employment_status' => ['nullable', Rule::in(['active', 'inactive'])],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'nik' => ['nullable', 'string', 'max:50'],
            'education' => ['nullable', 'string', 'max:255'],
            'specialization_subjects' => ['nullable', 'array'],
            'specialization_subjects.*' => ['integer', 'exists:academic_indicators,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', 'string', Rule::in(['L', 'P'])],
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
            'create_user_account' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return list<string>
     */
    protected function allowedRolesForType(string $type): array
    {
        return $type === Staff::TYPE_PENGAJAR
            ? [UserRole::Teacher->value]
            : [UserRole::Admin->value];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    protected function roleOptionsForType(string $type): array
    {
        return collect($this->allowedRolesForType($type))
            ->map(fn (string $role) => ['value' => $role, 'label' => UserRole::from($role)->label()])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{value: number, label: string}>
     */
    protected function indicatorOptions(): array
    {
        return AcademicIndicator::query()
            ->select(['id', 'subject_name'])
            ->orderBy('subject_name')
            ->get()
            ->unique('subject_name')
            ->map(fn (AcademicIndicator $indicator) => [
                'value' => $indicator->id,
                'label' => $indicator->subject_name,
            ])
            ->values()
            ->all();
    }

    protected function routePrefixForType(string $type): string
    {
        return $type === Staff::TYPE_PENGAJAR ? 'staff.pengajar' : 'staff.non-pengajar';
    }

    protected function ensureTypeMatches(Staff $staff, string $expectedType): void
    {
        abort_unless($staff->resolvedType() === $expectedType, 404);
    }
}
