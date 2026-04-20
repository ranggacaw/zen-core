<?php

use App\Http\Controllers\AddressReferenceController;
use App\Http\Controllers\AdmissionsController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('webhooks/midtrans', [ResourceController::class, 'webhook'])->name('webhooks.midtrans');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('address-reference', AddressReferenceController::class)->name('address-reference.index');

    Route::middleware('role:admin')->group(function () {
        Route::get('admissions', [AdmissionsController::class, 'index'])->name('admissions.index');
        Route::post('admissions', [AdmissionsController::class, 'store'])->name('admissions.store');
        Route::put('admissions/{applicant}', [AdmissionsController::class, 'update'])->name('admissions.update');
        Route::delete('admissions/{applicant}', [AdmissionsController::class, 'destroy'])->name('admissions.destroy');
        Route::post('admissions/{applicant}/approve', [AdmissionsController::class, 'approve'])->name('admissions.approve');
        Route::post('admissions/{applicant}/reject', [AdmissionsController::class, 'reject'])->name('admissions.reject');

        Route::get('peserta-ppdb', [AdmissionsController::class, 'index'])->name('ppdb.index');
        Route::post('peserta-ppdb', [AdmissionsController::class, 'store'])->name('ppdb.store');
        Route::put('peserta-ppdb/{applicant}', [AdmissionsController::class, 'update'])->name('ppdb.update');
        Route::delete('peserta-ppdb/{applicant}', [AdmissionsController::class, 'destroy'])->name('ppdb.destroy');
        Route::post('peserta-ppdb/{applicant}/approve', [AdmissionsController::class, 'approve'])->name('ppdb.approve');
        Route::post('peserta-ppdb/{applicant}/reject', [AdmissionsController::class, 'reject'])->name('ppdb.reject');

        Route::get('peserta-murid', [StudentController::class, 'index'])->name('students.index');
        Route::post('peserta-murid', [StudentController::class, 'store'])->name('students.store');
        Route::put('peserta-murid/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('peserta-murid/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        Route::get('peserta-wali', [GuardianController::class, 'index'])->name('guardians.index');
        Route::post('peserta-wali', [GuardianController::class, 'store'])->name('guardians.store');
        Route::put('peserta-wali/{guardian}', [GuardianController::class, 'update'])->name('guardians.update');
        Route::delete('peserta-wali/{guardian}', [GuardianController::class, 'destroy'])->name('guardians.destroy');

        Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
        Route::post('staff', [StaffController::class, 'store'])->name('staff.store');

        Route::get('communications', [AnnouncementController::class, 'index'])->name('communications.index');
        Route::post('communications', [AnnouncementController::class, 'store'])->name('communications.store');
        Route::post('communications/{announcement}/approve', [AnnouncementController::class, 'approve'])->name('communications.approve');
        Route::post('communications/{announcement}/publish', [AnnouncementController::class, 'publish'])->name('communications.publish');

        Route::get('resources', [ResourceController::class, 'index'])->name('resources.index');
        Route::post('resources/billing', [ResourceController::class, 'storeBilling'])->name('resources.billing.store');
        Route::post('resources/billing/{billing}/reconcile', [ResourceController::class, 'reconcileBilling'])->name('resources.billing.reconcile');
        Route::post('resources/inventory', [ResourceController::class, 'storeInventory'])->name('resources.inventory.store');
        Route::post('resources/facilities', [ResourceController::class, 'storeFacility'])->name('resources.facilities.store');
        Route::post('resources/events', [ResourceController::class, 'storeEvent'])->name('resources.events.store');
        Route::post('resources/events/{event}/allocate', [ResourceController::class, 'allocateEvent'])->name('resources.events.allocate');
    });

    Route::middleware('role:admin,teacher')->group(function () {
        Route::get('classes', [ClassroomController::class, 'index'])->name('classes.index');
        Route::post('classes', [ClassroomController::class, 'store'])->name('classes.store');
        Route::post('classes/{schoolClass}/teachers', [ClassroomController::class, 'assignTeacher'])->name('classes.teachers.store');
        Route::post('classes/{schoolClass}/schedules', [ClassroomController::class, 'storeSchedule'])->name('classes.schedules.store');
        Route::post('classes/{schoolClass}/tasks', [ClassroomController::class, 'storeTask'])->name('classes.tasks.store');
        Route::post('classes/{schoolClass}/indicators', [ClassroomController::class, 'storeIndicator'])->name('classes.indicators.store');
        Route::post('classes/{schoolClass}/assessments', [ClassroomController::class, 'storeAssessment'])->name('classes.assessments.store');

        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('attendance/scan', [AttendanceController::class, 'scan'])->name('attendance.scan');

        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/students.csv', [ReportController::class, 'studentsCsv'])->name('reports.students.csv');
        Route::get('reports/attendance.csv', [ReportController::class, 'attendanceCsv'])->name('reports.attendance.csv');
        Route::get('reports/classes/{schoolClass}/print', [ReportController::class, 'printClassReport'])->name('reports.classes.print');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
