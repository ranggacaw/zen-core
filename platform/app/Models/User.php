<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Domain\WorkforceAccess\Models\Staff;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function staff(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Staff::class);
    }

    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_has_roles');
    }

    public function permissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_has_permissions');
    }

    public function hasRole(UserRole|string ...$roles): bool
    {
        $roleValues = collect($roles)
            ->map(fn (UserRole|string $role) => $role instanceof UserRole ? $role->value : $role)
            ->all();

        return in_array($this->role instanceof UserRole ? $this->role->value : $this->role, $roleValues, true);
    }

    public function hasPermission(string $permission): bool
    {
        $directPermission = $this->permissions()->where('name', $permission)->exists();
        if ($directPermission) {
            return true;
        }

        $rolePermission = $this->roles()
            ->whereHas('permissions', fn ($query) => $query->where('name', $permission))
            ->exists();

        return $rolePermission;
    }

    public function assignRole(Role $role): static
    {
        $this->roles()->syncWithoutDetaching($role);

        return $this;
    }

    public function givePermission(Permission $permission): static
    {
        $this->permissions()->syncWithoutDetaching($permission);

        return $this;
    }

    public function removePermission(Permission $permission): static
    {
        $this->permissions()->detach($permission);

        return $this;
    }
}
