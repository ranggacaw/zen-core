<?php

namespace App\Domain\AcademicOperations\Models;

use App\Domain\WorkforceAccess\Models\Staff;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassTeacherAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_class_id',
        'staff_id',
        'subject_name',
        'is_homeroom',
    ];

    protected function casts(): array
    {
        return [
            'is_homeroom' => 'boolean',
        ];
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ClassTask::class);
    }
}
