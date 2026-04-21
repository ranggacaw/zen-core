<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_informasi_sekolah', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('jenis_informasi');
            $table->string('judul');
            $table->longText('isi');
            $table->string('gambar_sampul_path')->nullable();
            $table->foreignId('approved_by')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('t_informasi_has_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('informasi_id')->constrained('t_informasi_sekolah')->cascadeOnDelete();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();

            $table->unique(['informasi_id', 'school_class_id']);
        });

        Schema::create('t_document', function (Blueprint $table) {
            $table->id();
            $table->foreignId('informasi_id')->constrained('t_informasi_sekolah')->cascadeOnDelete();
            $table->string('disk');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->timestamps();

            $table->unique('informasi_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_document');
        Schema::dropIfExists('t_informasi_has_kelas');
        Schema::dropIfExists('t_informasi_sekolah');
    }
};
