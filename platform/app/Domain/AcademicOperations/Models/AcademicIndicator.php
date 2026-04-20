<?php

namespace App\Domain\AcademicOperations\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicIndicator extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_class_id',
        'subject_name',
        'semester',
        'code',
        'name',
        'status',
    ];

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(AssessmentEntry::class);
    }
}
