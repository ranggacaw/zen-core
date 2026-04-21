<?php

namespace App\Http\Controllers;

use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('staff/index', [
            'staff' => Staff::query()
                ->with('user:id,name,email,role')
                ->latest()
                ->get()
                ->map(fn (Staff $staff) => [
                    'id' => $staff->id,
                    'name' => $staff->name,
                    'email' => $staff->email,
                    'role' => $staff->role,
                    'position' => $staff->position,
                    'employee_number' => $staff->employee_number,
                    'employment_status' => $staff->employment_status,
                    'has_user_account' => $staff->user_id !== null,
                ]),
            'roles' => collect([UserRole::Admin, UserRole::Teacher])->map(fn (UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:staff,email',
                function (string $attribute, mixed $value, \Closure $fail) use ($request): void {
                    if ($request->boolean('create_user_account') && User::query()->where('email', $value)->exists()) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            'role' => ['required', Rule::in([UserRole::Admin->value, UserRole::Teacher->value])],
            'position' => ['required', 'string', 'max:255'],
            'employee_number' => ['required', 'string', 'max:50', 'unique:staff,employee_number'],
            'bank_account' => ['nullable', 'string', 'max:100'],
            'create_user_account' => ['nullable', 'boolean'],
        ]);

        $createUserAccount = (bool) ($validated['create_user_account'] ?? false);

        DB::transaction(function () use ($validated, $createUserAccount) {
            $user = null;

            if ($createUserAccount) {
                $user = User::query()->create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'role' => $validated['role'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                ]);
            }

            Staff::query()->create([
                'user_id' => $user?->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'position' => $validated['position'],
                'employee_number' => $validated['employee_number'],
                'bank_account' => $validated['bank_account'] ?? null,
                'employment_status' => 'active',
            ]);
        });

        return back()->with('success', $createUserAccount
            ? 'Staff member onboarded with linked system access.'
            : 'Staff member onboarded without a login account.');
    }
}
