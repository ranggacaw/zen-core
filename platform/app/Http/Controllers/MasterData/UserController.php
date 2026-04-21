<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
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

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'registered_user',
        ]);

        $defaultRole = Role::where('name', 'superadmin')->first();
        if ($defaultRole) {
            $user->assignRole($defaultRole);
        }

        return redirect()->route('master-data.users.index')
            ->with('success', 'User created successfully.');
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['nullable', 'string'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'] ?? $user->role,
        ]);

        return redirect()->route('master-data.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function updatePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
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

    public function profile(User $user)
    {
        return Inertia::render('master-data/users/profile', [
            'user' => $user->load('roles', 'permissions'),
            'roles' => Role::all(),
        ]);
    }
}