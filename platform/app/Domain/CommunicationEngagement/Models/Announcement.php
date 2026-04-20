<?php

namespace App\Domain\CommunicationEngagement\Models;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class Announcement extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'approved_by',
        'title',
        'content',
        'status',
        'cover_path',
        'document_path',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
        ];
    }
}
