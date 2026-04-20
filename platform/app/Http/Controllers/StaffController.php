<?php

namespace App\Http\Controllers;

use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
                ]),
            'roles' => collect(UserRole::cases())->map(fn (UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email', 'unique:staff,email'],
            'role' => ['required', 'in:'.implode(',', UserRole::values())],
            'position' => ['required', 'string', 'max:255'],
            'employee_number' => ['required', 'string', 'max:50', 'unique:staff,employee_number'],
            'bank_account' => ['nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]);

            Staff::query()->create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'position' => $validated['position'],
                'employee_number' => $validated['employee_number'],
                'bank_account' => $validated['bank_account'] ?? null,
                'employment_status' => 'active',
            ]);
        });

        return back()->with('success', 'Staff member onboarded with linked system access.');
    }
}
