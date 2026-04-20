<?php

namespace App\Domain\BusinessResources\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'scheduled_for',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_for' => 'datetime',
        ];
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(EventAllocation::class);
    }
}
