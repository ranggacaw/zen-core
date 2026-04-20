<?php

namespace App\Domain\StudentLifecycle\Models;

use App\Domain\AcademicOperations\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Applicant extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'guardian_id',
        'school_class_id',
        'name',
        'student_number',
        'status',
        'decision_notes',
        'address_line',
        'province_code',
        'province_name',
        'regency_code',
        'regency_name',
        'district_code',
        'district_name',
        'village_code',
        'village_name',
    ];

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class);
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'student_number' => $this->student_number,
            'status' => $this->status,
        ];
    }
}
