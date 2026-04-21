<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'superadmin', 'description' => 'Super Administrator with full access'],
            ['name' => 'admin', 'description' => 'Administrator with limited access'],
            ['name' => 'user', 'description' => 'Regular user'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['name' => $roleData['name']], $roleData);
        }

        $permissions = [
            ['name' => 'users.view', 'group_name' => 'User Management', 'description' => 'View users'],
            ['name' => 'users.create', 'group_name' => 'User Management', 'description' => 'Create users'],
            ['name' => 'users.edit', 'group_name' => 'User Management', 'description' => 'Edit users'],
            ['name' => 'users.delete', 'group_name' => 'User Management', 'description' => 'Delete users'],
            ['name' => 'roles.view', 'group_name' => 'Role Management', 'description' => 'View roles'],
            ['name' => 'roles.create', 'group_name' => 'Role Management', 'description' => 'Create roles'],
            ['name' => 'roles.edit', 'group_name' => 'Role Management', 'description' => 'Edit roles'],
            ['name' => 'roles.delete', 'group_name' => 'Role Management', 'description' => 'Delete roles'],
            ['name' => 'permissions.view', 'group_name' => 'Permission Management', 'description' => 'View permissions'],
            ['name' => 'permissions.create', 'group_name' => 'Permission Management', 'description' => 'Create permissions'],
            ['name' => 'permissions.edit', 'group_name' => 'Permission Management', 'description' => 'Edit permissions'],
            ['name' => 'permissions.delete', 'group_name' => 'Permission Management', 'description' => 'Delete permissions'],
        ];

        foreach ($permissions as $permData) {
            Permission::firstOrCreate(['name' => $permData['name']], $permData);
        }

        $superadmin = Role::where('name', 'superadmin')->first();
        $allPermissions = Permission::all();
        $superadmin->permissions()->sync($allPermissions);
    }
}