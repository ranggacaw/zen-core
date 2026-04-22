<?php

namespace App\Domain\StudentLifecycle\Models;

use App\Domain\AcademicOperations\Models\AssessmentEntry;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Laravel\Scout\Searchable;

class Student extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'applicant_id',
        'guardian_id',
        'school_class_id',
        'name',
        'nickname',
        'student_number',
        'religion',
        'phone',
        'email',
        'avatar',
        'birth_place',
        'birth_date',
        'gender',
        'child_number',
        'child_of_total',
        'citizenship',
        'join_date',
        'end_date',
        'postal_code',
        'domicile_address',
        'status',
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

    protected $casts = [
        'birth_date' => 'date',
        'join_date' => 'date',
        'end_date' => 'date',
    ];

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class);
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function assessmentEntries(): HasMany
    {
        return $this->hasMany(AssessmentEntry::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'student_number' => $this->student_number,
            'status' => $this->status,
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        $avatarPath = is_string($this->avatar) ? trim($this->avatar) : $this->avatar;

        if ($avatarPath === null || $avatarPath === '' || $avatarPath === '0') {
            return null;
        }

        $disk = config('zen.upload_disk', 'public');

        if ($disk === 'local' || $disk === 'public') {
            return '/storage/'.$avatarPath;
        }

        return Storage::disk($disk)->url($avatarPath);
    }
}
