<?php

namespace App\Domain\AcademicOperations\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_class_id',
        'class_teacher_assignment_id',
        'title',
        'description',
        'due_on',
    ];

    protected function casts(): array
    {
        return [
            'due_on' => 'date',
        ];
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function teacherAssignment(): BelongsTo
    {
        return $this->belongsTo(ClassTeacherAssignment::class);
    }
}
