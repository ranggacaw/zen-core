<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('nickname')->nullable()->after('name');
            $table->string('religion')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('avatar')->nullable();
            $table->string('birth_place')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('child_number')->nullable();
            $table->string('child_of_total')->nullable();
            $table->string('citizenship')->nullable();
            $table->date('join_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('domicile_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'nickname',
                'religion',
                'phone',
                'email',
                'avatar',
                'birth_place',
                'birth_date',
                'gender',
                'child_number',
                'child_of_total',
                'citizenship',
                'join_date',
                'end_date',
                'postal_code',
                'domicile_address',
            ]);
        });
    }
};
