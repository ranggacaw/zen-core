<?php

namespace App\Domain\WorkforceAccess\Models;

use App\Domain\AcademicOperations\Models\ClassSchedule;
use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Staff extends Model
{
    use HasFactory;
    use Searchable;

    protected $table = 'staff';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'role',
        'position',
        'employee_number',
        'bank_account',
        'employment_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function teachingAssignments(): HasMany
    {
        return $this->hasMany(ClassTeacherAssignment::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'employee_number' => $this->employee_number,
            'position' => $this->position,
        ];
    }
}
