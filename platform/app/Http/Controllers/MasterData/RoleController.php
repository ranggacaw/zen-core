<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->get();

        $users = User::with('roles')->paginate(20);

        return Inertia::render('master-data/user-groups/index', [
            'roles' => $roles,
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('master-data/user-groups/create', [
            'permissions' => Permission::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        Role::create($validated);

        return redirect()->route('master-data.user-groups.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        return Inertia::render('master-data/user-groups/edit', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::all(),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $role->update($validated);

        return redirect()->route('master-data.user-groups.index')
            ->with('success', 'Role updated successfully.');
    }

    public function updatePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permissions']);

        return back()->with('success', 'Permissions updated successfully.');
    }

    public function destroy(Role $role)
    {
        if ($role->users()->count() > 0) {
            return back()->with('error', 'Cannot delete role with assigned users.');
        }

        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }

    public function editUserPermissions(User $user)
    {
        return Inertia::render('master-data/user-groups/user-permissions', [
            'user' => $user->load('permissions', 'roles'),
            'allPermissions' => Permission::all(),
        ]);
    }

    public function updateUserPermissions(Request $request, User $user)
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $user->permissions()->sync($validated['permissions']);

        return back()->with('success', 'User permissions updated successfully.');
    }
}