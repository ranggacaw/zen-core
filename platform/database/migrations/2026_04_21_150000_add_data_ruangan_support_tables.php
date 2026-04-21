<?php

use App\Domain\BusinessResources\Models\Facility;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            $table->string('type')->default(Facility::TYPE_FACILITY)->after('location');
        });

        Schema::table('class_schedules', function (Blueprint $table) {
            $table->foreignId('class_teacher_assignment_id')->nullable()->after('school_class_id')->constrained()->nullOnDelete();
            $table->string('semester')->default('Semester 1')->after('subject_name');
        });

        Schema::table('class_tasks', function (Blueprint $table) {
            $table->foreignId('class_teacher_assignment_id')->nullable()->after('school_class_id')->constrained()->nullOnDelete();
        });

        Schema::create('class_daily_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->date('entry_date');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_daily_journals');

        Schema::table('class_tasks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('class_teacher_assignment_id');
        });

        Schema::table('class_schedules', function (Blueprint $table) {
            $table->dropConstrainedForeignId('class_teacher_assignment_id');
            $table->dropColumn('semester');
        });

        Schema::table('facilities', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
