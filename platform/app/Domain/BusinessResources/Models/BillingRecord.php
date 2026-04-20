<?php

namespace App\Domain\BusinessResources\Models;

use App\Domain\StudentLifecycle\Models\Student;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'title',
        'amount',
        'status',
        'payment_reference',
        'paid_at',
        'provider_payload',
        'due_on',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'due_on' => 'date',
            'provider_payload' => 'array',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
