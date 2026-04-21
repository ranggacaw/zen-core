<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('employment_status');
            $table->string('nik', 50)->nullable()->after('avatar');
            $table->string('education')->nullable()->after('nik');
            $table->json('specialization_subjects')->nullable()->after('education');
            $table->string('phone', 50)->nullable()->after('specialization_subjects');
            $table->string('gender', 10)->nullable()->after('phone');
            $table->string('birth_place')->nullable()->after('gender');
            $table->date('birth_date')->nullable()->after('birth_place');
            $table->string('nip', 100)->nullable()->after('birth_date');
            $table->string('religion', 100)->nullable()->after('nip');
            $table->string('bank_name')->nullable()->after('religion');
            $table->date('join_date')->nullable()->after('bank_name');
            $table->date('end_date')->nullable()->after('join_date');
            $table->string('decree_permanent')->nullable()->after('end_date');
            $table->string('decree_contract')->nullable()->after('decree_permanent');
            $table->text('address_line')->nullable()->after('decree_contract');
            $table->string('province_code', 50)->nullable()->after('address_line');
            $table->string('province_name')->nullable()->after('province_code');
            $table->string('regency_code', 50)->nullable()->after('province_name');
            $table->string('regency_name')->nullable()->after('regency_code');
            $table->string('district_code', 50)->nullable()->after('regency_name');
            $table->string('district_name')->nullable()->after('district_code');
            $table->string('village_code', 50)->nullable()->after('district_name');
            $table->string('village_name')->nullable()->after('village_code');
            $table->string('postal_code', 20)->nullable()->after('village_name');
        });
    }

    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'nik',
                'education',
                'specialization_subjects',
                'phone',
                'gender',
                'birth_place',
                'birth_date',
                'nip',
                'religion',
                'bank_name',
                'join_date',
                'end_date',
                'decree_permanent',
                'decree_contract',
                'address_line',
                'province_code',
                'province_name',
                'regency_code',
                'regency_name',
                'district_code',
                'district_name',
                'village_code',
                'village_name',
                'postal_code',
            ]);
        });
    }
};
