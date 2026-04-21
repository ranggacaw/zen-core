<?php

namespace App\Domain\WorkforceAccess\Models;

use App\Domain\AcademicOperations\Models\ClassSchedule;
use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Staff extends Model
{
    use HasFactory;
    use Searchable;

    public const TYPE_PENGAJAR = 'pengajar';

    public const TYPE_NON_PENGAJAR = 'non_pengajar';

    public const RELIGIONS = [
        'islam' => 'Islam',
        'kristen' => 'Kristen',
        'katolik' => 'Katolik',
        'hindu' => 'Hindu',
        'buddha' => 'Buddha',
        'khonghucu' => 'Khonghucu',
    ];

    protected $table = 'staff';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'role',
        'staff_type',
        'position',
        'employee_number',
        'bank_account',
        'employment_status',
        'avatar',
        'nik',
        'education',
        'specialization_subjects',
        'phone',
        'gender',
        'birth_place',
        'birth_date',
        'nip',
        'religion',
        'bank_name',
        'join_date',
        'end_date',
        'decree_permanent',
        'decree_contract',
        'address_line',
        'province_code',
        'province_name',
        'regency_code',
        'regency_name',
        'district_code',
        'district_name',
        'village_code',
        'village_name',
        'postal_code',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'join_date' => 'date',
            'end_date' => 'date',
            'specialization_subjects' => 'array',
        ];
    }

    public function scopeForType(Builder $query, string $type): Builder
    {
        return $query->where(function (Builder $builder) use ($type) {
            $builder->where('staff_type', $type)
                ->orWhere(function (Builder $fallbackQuery) use ($type) {
                    $fallbackQuery->whereNull('staff_type');

                    if ($type === self::TYPE_PENGAJAR) {
                        $fallbackQuery->where('role', UserRole::Teacher->value);

                        return;
                    }

                    $fallbackQuery->where('role', '!=', UserRole::Teacher->value);
                });
        });
    }

    public static function labelForType(string $type): string
    {
        return $type === self::TYPE_PENGAJAR ? 'Pengajar' : 'Non-Pengajar';
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function religionOptions(): array
    {
        return collect(self::RELIGIONS)
            ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }

    public function resolvedType(): string
    {
        if ($this->staff_type !== null) {
            return $this->staff_type;
        }

        return $this->role === UserRole::Teacher->value
            ? self::TYPE_PENGAJAR
            : self::TYPE_NON_PENGAJAR;
    }

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
            'phone' => $this->phone,
            'nik' => $this->nik,
        ];
    }
}
