<?php

namespace App\Domain\BusinessResources\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    use HasFactory;

    public const TYPE_ROOM = 'ruangan_belajar';

    public const TYPE_FACILITY = 'fasilitas_sekolah';

    protected $fillable = [
        'name',
        'location',
        'type',
        'status',
    ];

    public function scopeForType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function typeLabel(): string
    {
        return $this->type === self::TYPE_ROOM ? 'Ruangan Belajar' : 'Fasilitas Sekolah';
    }

    public function roomBookings(): HasMany
    {
        return $this->hasMany(RoomBooking::class);
    }
}
