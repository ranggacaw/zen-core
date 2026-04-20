<?php

namespace App\Domain\AcademicOperations\Models;

use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Student;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class SchoolClass extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'name',
        'grade_level',
        'academic_year',
        'room_name',
    ];

    public function applicants(): HasMany
    {
        return $this->hasMany(Applicant::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function teachers(): HasMany
    {
        return $this->hasMany(ClassTeacherAssignment::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ClassTask::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(AcademicIndicator::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(AssessmentEntry::class);
    }

    public function announcements(): BelongsToMany
    {
        return $this->belongsToMany(Announcement::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'grade_level' => $this->grade_level,
            'academic_year' => $this->academic_year,
            'room_name' => $this->room_name,
        ];
    }
}
