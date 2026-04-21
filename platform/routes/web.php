<?php

use App\Http\Controllers\AddressReferenceController;
use App\Http\Controllers\AdmissionsController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DataRuanganController;
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
        Route::get('peserta-murid/create', [StudentController::class, 'create'])->name('students.create');
        Route::post('peserta-murid', [StudentController::class, 'store'])->name('students.store');
        Route::get('peserta-murid/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
        Route::put('peserta-murid/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('peserta-murid/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        Route::get('peserta-wali', [GuardianController::class, 'index'])->name('guardians.index');
        Route::get('peserta-wali/create', [GuardianController::class, 'create'])->name('guardians.create');
        Route::post('peserta-wali', [GuardianController::class, 'store'])->name('guardians.store');
        Route::get('peserta-wali/{guardian}/edit', [GuardianController::class, 'edit'])->name('guardians.edit');
        Route::put('peserta-wali/{guardian}', [GuardianController::class, 'update'])->name('guardians.update');
        Route::delete('peserta-wali/{guardian}', [GuardianController::class, 'destroy'])->name('guardians.destroy');

        Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
        Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
        Route::get('staff/pengajar', [StaffController::class, 'pengajarIndex'])->name('staff.pengajar.index');
        Route::get('staff/pengajar/create', [StaffController::class, 'createPengajar'])->name('staff.pengajar.create');
        Route::post('staff/pengajar', [StaffController::class, 'storePengajar'])->name('staff.pengajar.store');
        Route::get('staff/pengajar/{staff}/edit', [StaffController::class, 'editPengajar'])->name('staff.pengajar.edit');
        Route::put('staff/pengajar/{staff}', [StaffController::class, 'updatePengajar'])->name('staff.pengajar.update');
        Route::delete('staff/pengajar/{staff}', [StaffController::class, 'destroyPengajar'])->name('staff.pengajar.destroy');
        Route::get('staff/pengajar/api/list', [StaffController::class, 'pengajarLookup'])->name('staff.pengajar.lookup');

        Route::get('staff/non-pengajar', [StaffController::class, 'nonPengajarIndex'])->name('staff.non-pengajar.index');
        Route::get('staff/non-pengajar/create', [StaffController::class, 'createNonPengajar'])->name('staff.non-pengajar.create');
        Route::post('staff/non-pengajar', [StaffController::class, 'storeNonPengajar'])->name('staff.non-pengajar.store');
        Route::get('staff/non-pengajar/{staff}/edit', [StaffController::class, 'editNonPengajar'])->name('staff.non-pengajar.edit');
        Route::put('staff/non-pengajar/{staff}', [StaffController::class, 'updateNonPengajar'])->name('staff.non-pengajar.update');
        Route::delete('staff/non-pengajar/{staff}', [StaffController::class, 'destroyNonPengajar'])->name('staff.non-pengajar.destroy');

        Route::get('communications', [AnnouncementController::class, 'index'])->name('communications.index');
        Route::post('communications', [AnnouncementController::class, 'store'])->name('communications.store');
        Route::get('communications/{announcement}/document', [AnnouncementController::class, 'downloadDocument'])->name('communications.documents.download');
        Route::post('communications/{announcement}/approve', [AnnouncementController::class, 'approve'])->name('communications.approve');
        Route::post('communications/{announcement}/publish', [AnnouncementController::class, 'publish'])->name('communications.publish');

        Route::get('resources', [ResourceController::class, 'index'])->name('resources.index');
        Route::post('resources/facilities', [ResourceController::class, 'storeFacility'])->name('resources.facilities.store');
        Route::post('resources/bookings', [ResourceController::class, 'storeBooking'])->name('resources.bookings.store');

        Route::get('data-ruangan/ruangan-belajar', [DataRuanganController::class, 'ruanganBelajarIndex'])->name('data-ruangan.ruangan-belajar.index');
        Route::post('data-ruangan/ruangan-belajar', [DataRuanganController::class, 'storeRuanganBelajar'])->name('data-ruangan.ruangan-belajar.store');
        Route::put('data-ruangan/ruangan-belajar/{facility}', [DataRuanganController::class, 'updateRuanganBelajar'])->name('data-ruangan.ruangan-belajar.update');
        Route::delete('data-ruangan/ruangan-belajar/{facility}', [DataRuanganController::class, 'destroyRuanganBelajar'])->name('data-ruangan.ruangan-belajar.destroy');

        Route::get('data-ruangan/fasilitas-sekolah', [DataRuanganController::class, 'fasilitasSekolahIndex'])->name('data-ruangan.fasilitas-sekolah.index');
        Route::post('data-ruangan/fasilitas-sekolah', [DataRuanganController::class, 'storeFasilitasSekolah'])->name('data-ruangan.fasilitas-sekolah.store');
        Route::put('data-ruangan/fasilitas-sekolah/{facility}', [DataRuanganController::class, 'updateFasilitasSekolah'])->name('data-ruangan.fasilitas-sekolah.update');
        Route::delete('data-ruangan/fasilitas-sekolah/{facility}', [DataRuanganController::class, 'destroyFasilitasSekolah'])->name('data-ruangan.fasilitas-sekolah.destroy');

        Route::get('data-ruangan/penggunaan-fasilitas', [DataRuanganController::class, 'penggunaanFasilitasIndex'])->name('data-ruangan.penggunaan-fasilitas.index');
        Route::post('data-ruangan/penggunaan-fasilitas', [DataRuanganController::class, 'storePenggunaanFasilitas'])->name('data-ruangan.penggunaan-fasilitas.store');
        Route::put('data-ruangan/penggunaan-fasilitas/{booking}', [DataRuanganController::class, 'updatePenggunaanFasilitas'])->name('data-ruangan.penggunaan-fasilitas.update');
        Route::delete('data-ruangan/penggunaan-fasilitas/{booking}', [DataRuanganController::class, 'destroyPenggunaanFasilitas'])->name('data-ruangan.penggunaan-fasilitas.destroy');
    });

    Route::middleware('role:admin,teacher')->group(function () {
        Route::get('classes', [ClassroomController::class, 'index'])->name('classes.index');
        Route::post('classes', [ClassroomController::class, 'store'])->name('classes.store');
        Route::post('classes/{schoolClass}/teachers', [ClassroomController::class, 'assignTeacher'])->name('classes.teachers.store');
        Route::post('classes/{schoolClass}/schedules', [ClassroomController::class, 'storeSchedule'])->name('classes.schedules.store');
        Route::post('classes/{schoolClass}/indicators', [ClassroomController::class, 'storeIndicator'])->name('classes.indicators.store');
        Route::post('classes/{schoolClass}/assessments', [ClassroomController::class, 'storeAssessment'])->name('classes.assessments.store');

        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('attendance/scan', [AttendanceController::class, 'scan'])->name('attendance.scan');

        Route::get('data-ruangan/rombongan-belajar', [DataRuanganController::class, 'rombonganBelajarIndex'])->name('data-ruangan.rombongan-belajar.index');
        Route::post('data-ruangan/rombongan-belajar', [DataRuanganController::class, 'storeRombonganBelajar'])->name('data-ruangan.rombongan-belajar.store');
        Route::put('data-ruangan/rombongan-belajar/{schoolClass}', [DataRuanganController::class, 'updateRombonganBelajar'])->name('data-ruangan.rombongan-belajar.update');
        Route::delete('data-ruangan/rombongan-belajar/{schoolClass}', [DataRuanganController::class, 'destroyRombonganBelajar'])->name('data-ruangan.rombongan-belajar.destroy');

        Route::post('data-ruangan/rombongan-belajar/{schoolClass}/teachers', [DataRuanganController::class, 'storeTeacherAssignment'])->name('data-ruangan.rombongan-belajar.teachers.store');
        Route::put('data-ruangan/rombongan-belajar/{schoolClass}/teachers/{assignment}', [DataRuanganController::class, 'updateTeacherAssignment'])->name('data-ruangan.rombongan-belajar.teachers.update');
        Route::delete('data-ruangan/rombongan-belajar/{schoolClass}/teachers/{assignment}', [DataRuanganController::class, 'destroyTeacherAssignment'])->name('data-ruangan.rombongan-belajar.teachers.destroy');

        Route::post('data-ruangan/rombongan-belajar/{schoolClass}/schedules', [DataRuanganController::class, 'storeSchedule'])->name('data-ruangan.rombongan-belajar.schedules.store');
        Route::put('data-ruangan/rombongan-belajar/{schoolClass}/schedules/{schedule}', [DataRuanganController::class, 'updateSchedule'])->name('data-ruangan.rombongan-belajar.schedules.update');
        Route::delete('data-ruangan/rombongan-belajar/{schoolClass}/schedules/{schedule}', [DataRuanganController::class, 'destroySchedule'])->name('data-ruangan.rombongan-belajar.schedules.destroy');

        Route::post('data-ruangan/rombongan-belajar/{schoolClass}/daily-journals', [DataRuanganController::class, 'storeDailyJournal'])->name('data-ruangan.rombongan-belajar.daily-journals.store');
        Route::put('data-ruangan/rombongan-belajar/{schoolClass}/daily-journals/{journal}', [DataRuanganController::class, 'updateDailyJournal'])->name('data-ruangan.rombongan-belajar.daily-journals.update');
        Route::delete('data-ruangan/rombongan-belajar/{schoolClass}/daily-journals/{journal}', [DataRuanganController::class, 'destroyDailyJournal'])->name('data-ruangan.rombongan-belajar.daily-journals.destroy');

        Route::post('data-ruangan/rombongan-belajar/{schoolClass}/tasks', [DataRuanganController::class, 'storeTask'])->name('data-ruangan.rombongan-belajar.tasks.store');
        Route::put('data-ruangan/rombongan-belajar/{schoolClass}/tasks/{task}', [DataRuanganController::class, 'updateTask'])->name('data-ruangan.rombongan-belajar.tasks.update');
        Route::delete('data-ruangan/rombongan-belajar/{schoolClass}/tasks/{task}', [DataRuanganController::class, 'destroyTask'])->name('data-ruangan.rombongan-belajar.tasks.destroy');

        Route::post('data-ruangan/rombongan-belajar/{schoolClass}/indicators', [DataRuanganController::class, 'storeIndicator'])->name('data-ruangan.rombongan-belajar.indicators.store');
        Route::put('data-ruangan/rombongan-belajar/{schoolClass}/indicators/{indicator}', [DataRuanganController::class, 'updateIndicator'])->name('data-ruangan.rombongan-belajar.indicators.update');
        Route::delete('data-ruangan/rombongan-belajar/{schoolClass}/indicators/{indicator}', [DataRuanganController::class, 'destroyIndicator'])->name('data-ruangan.rombongan-belajar.indicators.destroy');

        Route::post('data-ruangan/rombongan-belajar/{schoolClass}/assessments', [DataRuanganController::class, 'storeAssessment'])->name('data-ruangan.rombongan-belajar.assessments.store');

        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/students.csv', [ReportController::class, 'studentsCsv'])->name('reports.students.csv');
        Route::get('reports/attendance.csv', [ReportController::class, 'attendanceCsv'])->name('reports.attendance.csv');
        Route::get('reports/classes/{schoolClass}/scores.csv', [ReportController::class, 'classScoresCsv'])->name('reports.classes.csv');
        Route::get('reports/classes/{schoolClass}/print', [ReportController::class, 'printClassReport'])->name('reports.classes.print');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
