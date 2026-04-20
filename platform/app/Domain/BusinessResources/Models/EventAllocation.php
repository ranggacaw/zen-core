<?php

namespace App\Domain\BusinessResources\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class EventAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_event_id',
        'allocatable_type',
        'allocatable_id',
        'quantity',
        'status',
    ];

    public function schoolEvent(): BelongsTo
    {
        return $this->belongsTo(SchoolEvent::class);
    }

    public function allocatable(): MorphTo
    {
        return $this->morphTo();
    }
}
