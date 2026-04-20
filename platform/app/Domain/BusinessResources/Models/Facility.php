<?php

namespace App\Domain\BusinessResources\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'status',
    ];

    public function allocations(): MorphMany
    {
        return $this->morphMany(EventAllocation::class, 'allocatable');
    }
}
