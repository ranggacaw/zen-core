<?php

namespace App\Domain\SchoolInformation\Models;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SchoolInformation extends Model
{
    use HasFactory;

    protected $table = 't_informasi_sekolah';

    protected $fillable = [
        'tanggal',
        'jenis_informasi',
        'judul',
        'isi',
        'gambar_sampul_path',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 't_informasi_has_kelas', 'informasi_id', 'school_class_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function document(): HasOne
    {
        return $this->hasOne(SchoolInformationDocument::class, 'informasi_id');
    }
}
