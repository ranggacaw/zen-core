<?php

namespace App\Domain\AcademicOperations\Models;

use App\Domain\WorkforceAccess\Models\Staff;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_class_id',
        'staff_id',
        'day_of_week',
        'subject_name',
        'starts_at',
        'ends_at',
    ];

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }
}
