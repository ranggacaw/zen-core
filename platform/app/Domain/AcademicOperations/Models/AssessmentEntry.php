<?php

namespace App\Domain\AcademicOperations\Models;

use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_class_id',
        'student_id',
        'staff_id',
        'academic_indicator_id',
        'subject_name',
        'semester',
        'score',
    ];

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(AcademicIndicator::class, 'academic_indicator_id');
    }
}
