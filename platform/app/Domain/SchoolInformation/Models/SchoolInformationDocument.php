<?php

namespace App\Domain\SchoolInformation\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolInformationDocument extends Model
{
    use HasFactory;

    protected $table = 't_document';

    protected $fillable = [
        'informasi_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    public function information(): BelongsTo
    {
        return $this->belongsTo(SchoolInformation::class, 'informasi_id');
    }
}
