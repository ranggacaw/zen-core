<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('relationship')->default('Parent');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address_line')->nullable();
            $table->string('province_code')->nullable();
            $table->string('province_name')->nullable();
            $table->string('regency_code')->nullable();
            $table->string('regency_name')->nullable();
            $table->string('district_code')->nullable();
            $table->string('district_name')->nullable();
            $table->string('village_code')->nullable();
            $table->string('village_name')->nullable();
            $table->timestamps();
        });

        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('grade_level');
            $table->string('academic_year');
            $table->string('room_name')->nullable();
            $table->timestamps();
        });

        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('role');
            $table->string('position');
            $table->string('employee_number')->unique();
            $table->string('bank_account')->nullable();
            $table->string('employment_status')->default('active');
            $table->timestamps();
        });

        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guardian_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('school_class_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('student_number')->nullable()->unique();
            $table->string('status')->default('pending');
            $table->text('decision_notes')->nullable();
            $table->string('address_line')->nullable();
            $table->string('province_code')->nullable();
            $table->string('province_name')->nullable();
            $table->string('regency_code')->nullable();
            $table->string('regency_name')->nullable();
            $table->string('district_code')->nullable();
            $table->string('district_name')->nullable();
            $table->string('village_code')->nullable();
            $table->string('village_name')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('guardian_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('school_class_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('student_number')->unique();
            $table->string('status')->default('active');
            $table->string('address_line')->nullable();
            $table->string('province_code')->nullable();
            $table->string('province_name')->nullable();
            $table->string('regency_code')->nullable();
            $table->string('regency_name')->nullable();
            $table->string('district_code')->nullable();
            $table->string('district_name')->nullable();
            $table->string('village_code')->nullable();
            $table->string('village_name')->nullable();
            $table->timestamps();
        });

        Schema::create('class_teacher_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('staff_id')->constrained()->cascadeOnDelete();
            $table->string('subject_name')->nullable();
            $table->boolean('is_homeroom')->default(false);
            $table->timestamps();
        });

        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('staff_id')->nullable()->constrained()->nullOnDelete();
            $table->string('day_of_week');
            $table->string('subject_name');
            $table->time('starts_at');
            $table->time('ends_at');
            $table->timestamps();
        });

        Schema::create('class_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_on')->nullable();
            $table->timestamps();
        });

        Schema::create('academic_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->string('subject_name');
            $table->string('semester');
            $table->string('code');
            $table->string('name');
            $table->string('status')->default('complete');
            $table->timestamps();
        });

        Schema::create('assessment_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('staff_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('academic_indicator_id')->nullable()->constrained()->nullOnDelete();
            $table->string('subject_name');
            $table->string('semester');
            $table->decimal('score', 5, 2);
            $table->timestamps();
        });

        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_class_id')->nullable()->constrained()->nullOnDelete();
            $table->date('attendance_date');
            $table->timestamp('check_in_at')->nullable();
            $table->timestamp('check_out_at')->nullable();
            $table->unsignedTinyInteger('scan_count')->default(0);
            $table->timestamps();

            $table->unique(['student_id', 'attendance_date']);
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approved_by')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('status')->default('draft');
            $table->string('cover_path')->nullable();
            $table->string('document_path')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('announcement_school_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
        });

        Schema::create('billing_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->decimal('amount', 12, 2);
            $table->string('status')->default('pending');
            $table->string('payment_reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('provider_payload')->nullable();
            $table->date('due_on')->nullable();
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->string('status')->default('available');
            $table->timestamps();
        });

        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('status')->default('available');
            $table->timestamps();
        });

        Schema::create('school_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->dateTime('scheduled_for');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('event_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_event_id')->constrained()->cascadeOnDelete();
            $table->morphs('allocatable');
            $table->unsignedInteger('quantity')->default(1);
            $table->string('status')->default('allocated');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_allocations');
        Schema::dropIfExists('school_events');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('billing_records');
        Schema::dropIfExists('announcement_school_class');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('assessment_entries');
        Schema::dropIfExists('academic_indicators');
        Schema::dropIfExists('class_tasks');
        Schema::dropIfExists('class_schedules');
        Schema::dropIfExists('class_teacher_assignments');
        Schema::dropIfExists('students');
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('staff');
        Schema::dropIfExists('school_classes');
        Schema::dropIfExists('guardians');
    }
};
