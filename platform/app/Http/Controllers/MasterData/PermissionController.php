<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $permissions = Permission::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->group, fn ($query, $group) => $query->where('group_name', $group))
            ->orderBy('group_name')
            ->orderBy('name')
            ->get()
            ->groupBy('group_name');

        $groups = Permission::distinct()->pluck('group_name')->filter()->values();

        return Inertia::render('master-data/permissions/index', [
            'permissions' => $permissions,
            'groups' => $groups,
            'filters' => $request->only(['search', 'group']),
        ]);
    }

    public function create()
    {
        return Inertia::render('master-data/permissions/create', [
            'groups' => Permission::distinct()->pluck('group_name')->filter()->values(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
            'group_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        Permission::create($validated);

        return redirect()->route('master-data.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('master-data/permissions/edit', [
            'permission' => $permission,
            'groups' => Permission::distinct()->pluck('group_name')->filter()->values(),
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name,' . $permission->id],
            'group_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $permission->update($validated);

        return redirect()->route('master-data.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back()->with('success', 'Permission deleted successfully.');
    }
}