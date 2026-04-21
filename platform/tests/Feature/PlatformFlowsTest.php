<?php

namespace Tests\Feature;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\BusinessResources\Models\Facility;
use App\Domain\BusinessResources\Models\RoomBooking;
use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PlatformFlowsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_an_applicant_into_an_active_student(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 1A',
            'grade_level' => 'Grade 1',
            'academic_year' => '2025/2026',
            'room_name' => 'Anggrek',
        ]);
        $guardian = Guardian::query()->create([
            'name' => 'Siti Rahma',
            'relationship' => 'Parent',
        ]);
        $applicant = Applicant::query()->create([
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'name' => 'Raka Nugraha',
            'student_number' => 'STD-2001',
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->post(route('admissions.approve', $applicant))
            ->assertRedirect();

        $this->assertDatabaseHas('applicants', [
            'id' => $applicant->id,
            'status' => 'approved',
        ]);

        $this->assertDatabaseHas('students', [
            'applicant_id' => $applicant->id,
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'name' => 'Raka Nugraha',
            'student_number' => 'STD-2001',
            'status' => 'active',
        ]);
    }

    public function test_admin_can_manage_guardian_records_from_peserta_wali(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post(route('guardians.store'), [
                'name' => 'Siti Hasanah',
                'relationship' => 'Mother',
                'phone' => '08123456789',
                'email' => 'siti@example.com',
                'address_line' => 'Jl. Melati 1',
            ])
            ->assertRedirect();

        $guardian = Guardian::query()->firstOrFail();

        $this->actingAs($admin)
            ->put(route('guardians.update', $guardian), [
                'name' => 'Siti Hasanah Updated',
                'relationship' => 'Parent',
                'phone' => '08999999999',
                'email' => 'siti.updated@example.com',
                'address_line' => 'Jl. Melati 2',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('guardians', [
            'id' => $guardian->id,
            'name' => 'Siti Hasanah Updated',
            'relationship' => 'Parent',
            'email' => 'siti.updated@example.com',
        ]);

        $this->actingAs($admin)
            ->delete(route('guardians.destroy', $guardian))
            ->assertRedirect();

        $this->assertDatabaseMissing('guardians', [
            'id' => $guardian->id,
        ]);
    }

    public function test_admin_can_manage_student_records_from_peserta_murid(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $guardian = Guardian::query()->create([
            'name' => 'Dewi Lestari',
            'relationship' => 'Parent',
        ]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 1B',
            'grade_level' => 'Grade 1',
            'academic_year' => '2025/2026',
            'room_name' => 'Cempaka',
        ]);

        $this->actingAs($admin)
            ->post(route('students.store'), [
                'guardian_id' => $guardian->id,
                'school_class_id' => $class->id,
                'name' => 'Arga Pratama',
                'student_number' => 'STD-6001',
                'status' => 'active',
                'address_line' => 'Jl. Kenanga 5',
            ])
            ->assertRedirect();

        $student = Student::query()->firstOrFail();

        $this->actingAs($admin)
            ->put(route('students.update', $student), [
                'guardian_id' => $guardian->id,
                'school_class_id' => $class->id,
                'name' => 'Arga Pratama Updated',
                'student_number' => 'STD-6001',
                'status' => 'graduated',
                'address_line' => 'Jl. Kenanga 6',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'name' => 'Arga Pratama Updated',
            'status' => 'graduated',
        ]);

        $this->actingAs($admin)
            ->delete(route('students.destroy', $student))
            ->assertRedirect();

        $this->assertDatabaseMissing('students', [
            'id' => $student->id,
        ]);
    }

    public function test_admin_can_update_and_delete_pending_ppdb_records_but_not_approved_history(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 2B',
            'grade_level' => 'Grade 2',
            'academic_year' => '2025/2026',
            'room_name' => 'Flamboyan',
        ]);

        $this->actingAs($admin)
            ->post(route('ppdb.store'), [
                'name' => 'Salma Putri',
                'student_number' => 'STD-7001',
                'school_class_id' => $class->id,
                'guardian_name' => 'Budi Putra',
                'guardian_email' => 'budi@example.com',
                'guardian_phone' => '08111111111',
                'relationship' => 'Father',
                'address_line' => 'Jl. Teratai 1',
            ])
            ->assertRedirect();

        $applicant = Applicant::query()->firstOrFail();

        $this->actingAs($admin)
            ->put(route('ppdb.update', $applicant), [
                'name' => 'Salma Putri Updated',
                'student_number' => 'STD-7001',
                'school_class_id' => $class->id,
                'guardian_name' => 'Budi Putra Updated',
                'guardian_email' => 'budi.updated@example.com',
                'guardian_phone' => '08222222222',
                'relationship' => 'Parent',
                'address_line' => 'Jl. Teratai 2',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('applicants', [
            'id' => $applicant->id,
            'name' => 'Salma Putri Updated',
        ]);

        $this->assertDatabaseHas('guardians', [
            'id' => $applicant->guardian_id,
            'name' => 'Budi Putra Updated',
            'email' => 'budi.updated@example.com',
        ]);

        $this->actingAs($admin)
            ->delete(route('ppdb.destroy', $applicant))
            ->assertRedirect();

        $this->assertDatabaseMissing('applicants', [
            'id' => $applicant->id,
        ]);

        $this->assertDatabaseMissing('guardians', [
            'id' => $applicant->guardian_id,
        ]);

        $guardian = Guardian::query()->create([
            'name' => 'Rini Astuti',
            'relationship' => 'Parent',
        ]);
        $approvedApplicant = Applicant::query()->create([
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'name' => 'Fajar Hidayat',
            'student_number' => 'STD-7002',
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->post(route('ppdb.approve', $approvedApplicant))
            ->assertRedirect();

        $this->actingAs($admin)
            ->delete(route('ppdb.destroy', $approvedApplicant))
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertDatabaseHas('applicants', [
            'id' => $approvedApplicant->id,
            'status' => 'approved',
        ]);
    }

    public function test_teacher_dashboard_focuses_on_assigned_classes_only(): void
    {
        $teacher = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'dashboard-teacher@example.com']);
        $staff = Staff::query()->create([
            'user_id' => $teacher->id,
            'name' => 'Nanda Saputra',
            'email' => $teacher->email,
            'role' => UserRole::Teacher->value,
            'position' => 'Subject Teacher',
            'employee_number' => 'TCH-150',
            'employment_status' => 'active',
        ]);
        $assignedClass = SchoolClass::query()->create([
            'name' => 'Kelas Fokus',
            'grade_level' => 'Grade 4',
            'academic_year' => '2025/2026',
            'room_name' => 'Aster',
        ]);
        $otherClass = SchoolClass::query()->create([
            'name' => 'Kelas Lain',
            'grade_level' => 'Grade 4',
            'academic_year' => '2025/2026',
            'room_name' => 'Bougenville',
        ]);

        ClassTeacherAssignment::query()->create([
            'school_class_id' => $assignedClass->id,
            'staff_id' => $staff->id,
            'subject_name' => 'Science',
            'is_homeroom' => false,
        ]);

        AcademicIndicator::query()->create([
            'school_class_id' => $assignedClass->id,
            'subject_name' => 'Science',
            'semester' => 'Semester 1',
            'code' => 'SCI-11',
            'name' => 'Weather observation',
            'status' => 'incomplete',
        ]);
        AcademicIndicator::query()->create([
            'school_class_id' => $otherClass->id,
            'subject_name' => 'Science',
            'semester' => 'Semester 1',
            'code' => 'SCI-12',
            'name' => 'Plant growth',
            'status' => 'incomplete',
        ]);

        $this->actingAs($teacher)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertSee('Teacher workspace')
            ->assertSee('Kelas Fokus')
            ->assertDontSee('Kelas Lain');
    }

    public function test_registered_user_dashboard_shows_linked_family_workspace(): void
    {
        $guardianUser = User::factory()->create([
            'role' => UserRole::RegisteredUser,
            'email' => 'family-workspace@example.com',
        ]);
        $guardian = Guardian::query()->create([
            'user_id' => $guardianUser->id,
            'name' => 'Rina Prameswari',
            'relationship' => 'Parent',
            'email' => $guardianUser->email,
            'phone' => '081111111111',
        ]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 2C',
            'grade_level' => 'Grade 2',
            'academic_year' => '2025/2026',
            'room_name' => 'Teratai',
        ]);
        $otherClass = SchoolClass::query()->create([
            'name' => 'Kelas 2D',
            'grade_level' => 'Grade 2',
            'academic_year' => '2025/2026',
            'room_name' => 'Tulip',
        ]);
        $student = Student::query()->create([
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'name' => 'Nayla Azzahra',
            'student_number' => 'STD-2201',
            'status' => 'active',
        ]);
        Applicant::query()->create([
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'name' => 'Rafi Azzam',
            'student_number' => 'STD-2202',
            'status' => 'pending',
            'decision_notes' => 'Waiting for document verification.',
        ]);

        $visibleAnnouncement = Announcement::query()->create([
            'title' => 'Class 2C Briefing',
            'content' => 'Please attend the class meeting tomorrow.',
            'status' => 'published',
            'published_at' => now(),
        ]);
        $visibleAnnouncement->classes()->sync([$class->id]);

        $hiddenAnnouncement = Announcement::query()->create([
            'title' => 'Class 2D Briefing',
            'content' => 'This should not appear in the guardian workspace.',
            'status' => 'published',
            'published_at' => now(),
        ]);
        $hiddenAnnouncement->classes()->sync([$otherClass->id]);

        AttendanceRecord::query()->create([
            'student_id' => $student->id,
            'school_class_id' => $class->id,
            'attendance_date' => today()->toDateString(),
            'check_in_at' => now()->subHour(),
            'scan_count' => 1,
        ]);

        $this->actingAs($guardianUser)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertSee('Guardian workspace')
            ->assertSee('Rina Prameswari')
            ->assertSee('Nayla Azzahra')
            ->assertSee('Rafi Azzam')
            ->assertSee('Class 2C Briefing')
            ->assertDontSee('Class 2D Briefing');
    }

    public function test_attendance_scan_uses_first_scan_for_check_in_and_second_for_check_out(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 2A',
            'grade_level' => 'Grade 2',
            'academic_year' => '2025/2026',
            'room_name' => 'Melati',
        ]);
        $student = Student::query()->create([
            'school_class_id' => $class->id,
            'name' => 'Nina Aulia',
            'student_number' => 'STD-3001',
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->post(route('attendance.scan'), ['identifier' => 'STD-3001'])
            ->assertRedirect();

        $record = AttendanceRecord::query()->where('student_id', $student->id)->first();

        $this->assertNotNull($record);
        $this->assertNotNull($record->check_in_at);
        $this->assertNull($record->check_out_at);

        $this->actingAs($admin)
            ->post(route('attendance.scan'), ['identifier' => 'STD-3001'])
            ->assertRedirect();

        $record->refresh();

        $this->assertNotNull($record->check_out_at);
        $this->assertSame(2, $record->scan_count);
    }

    public function test_attendance_scan_returns_a_validation_error_for_unknown_student_number(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->from(route('attendance.index'))
            ->post(route('attendance.scan'), ['identifier' => 'UNKNOWN-001'])
            ->assertRedirect(route('attendance.index'))
            ->assertSessionHasErrors('identifier');
    }

    public function test_teacher_attendance_page_only_shows_records_for_assigned_classes(): void
    {
        $teacher = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'attendance-teacher@example.com']);
        $staff = Staff::query()->create([
            'user_id' => $teacher->id,
            'name' => 'Sari Wulandari',
            'email' => $teacher->email,
            'role' => UserRole::Teacher->value,
            'position' => 'Subject Teacher',
            'employee_number' => 'TCH-201',
            'employment_status' => 'active',
        ]);
        $assignedClass = SchoolClass::query()->create([
            'name' => 'Kelas 3C',
            'grade_level' => 'Grade 3',
            'academic_year' => '2025/2026',
            'room_name' => 'Akasia',
        ]);
        $otherClass = SchoolClass::query()->create([
            'name' => 'Kelas 3D',
            'grade_level' => 'Grade 3',
            'academic_year' => '2025/2026',
            'room_name' => 'Anggrek',
        ]);
        $assignedStudent = Student::query()->create([
            'school_class_id' => $assignedClass->id,
            'name' => 'Aditiya Ramadhan',
            'student_number' => 'STD-3010',
            'status' => 'active',
        ]);
        $otherStudent = Student::query()->create([
            'school_class_id' => $otherClass->id,
            'name' => 'Mila Dwi',
            'student_number' => 'STD-3011',
            'status' => 'active',
        ]);

        ClassTeacherAssignment::query()->create([
            'school_class_id' => $assignedClass->id,
            'staff_id' => $staff->id,
            'subject_name' => 'Bahasa Indonesia',
            'is_homeroom' => false,
        ]);

        AttendanceRecord::query()->create([
            'student_id' => $assignedStudent->id,
            'school_class_id' => $assignedClass->id,
            'attendance_date' => today()->toDateString(),
            'check_in_at' => now()->subHour(),
            'scan_count' => 1,
        ]);

        AttendanceRecord::query()->create([
            'student_id' => $otherStudent->id,
            'school_class_id' => $otherClass->id,
            'attendance_date' => today()->toDateString(),
            'check_in_at' => now()->subHour(),
            'scan_count' => 1,
        ]);

        $this->actingAs($teacher)
            ->get(route('attendance.index'))
            ->assertOk()
            ->assertSee('Assigned classes only')
            ->assertSee('Aditiya Ramadhan')
            ->assertDontSee('Mila Dwi');
    }

    public function test_teacher_can_only_record_assessments_for_an_assigned_teaching_context(): void
    {
        $teacher = User::factory()->create([
            'role' => UserRole::Teacher,
            'email' => 'teacher-assessment@example.com',
        ]);
        $staff = Staff::query()->create([
            'user_id' => $teacher->id,
            'name' => $teacher->name,
            'email' => $teacher->email,
            'role' => UserRole::Teacher->value,
            'position' => 'Subject Teacher',
            'employee_number' => 'TCH-200',
            'employment_status' => 'active',
        ]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 3A',
            'grade_level' => 'Grade 3',
            'academic_year' => '2025/2026',
            'room_name' => 'Tulip',
        ]);
        $student = Student::query()->create([
            'school_class_id' => $class->id,
            'name' => 'Farhan Akbar',
            'student_number' => 'STD-4001',
            'status' => 'active',
        ]);

        ClassTeacherAssignment::query()->create([
            'school_class_id' => $class->id,
            'staff_id' => $staff->id,
            'subject_name' => 'Mathematics',
            'is_homeroom' => false,
        ]);

        $indicator = AcademicIndicator::query()->create([
            'school_class_id' => $class->id,
            'subject_name' => 'Mathematics',
            'semester' => 'Semester 1',
            'code' => 'MTK-01',
            'name' => 'Fractions mastery',
            'status' => 'complete',
        ]);

        $this->actingAs($teacher)
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'academic_indicator_id' => $indicator->id,
                'score' => 92,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('assessment_entries', [
            'school_class_id' => $class->id,
            'student_id' => $student->id,
            'staff_id' => $staff->id,
            'academic_indicator_id' => $indicator->id,
            'subject_name' => 'Mathematics',
            'semester' => 'Semester 1',
        ]);

        $this->actingAs($teacher)
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'academic_indicator_id' => AcademicIndicator::query()->create([
                    'school_class_id' => $class->id,
                    'subject_name' => 'Science',
                    'semester' => 'Semester 1',
                    'code' => 'SCI-01',
                    'name' => 'Matter basics',
                    'status' => 'complete',
                ])->id,
                'score' => 90,
            ])
            ->assertForbidden();
    }

    public function test_assessment_entry_must_use_a_student_and_indicator_from_the_selected_class(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 5A',
            'grade_level' => 'Grade 5',
            'academic_year' => '2025/2026',
            'room_name' => 'Dahlia',
        ]);
        $otherClass = SchoolClass::query()->create([
            'name' => 'Kelas 5B',
            'grade_level' => 'Grade 5',
            'academic_year' => '2025/2026',
            'room_name' => 'Flamboyan',
        ]);
        $student = Student::query()->create([
            'school_class_id' => $otherClass->id,
            'name' => 'Rafi Maulana',
            'student_number' => 'STD-5101',
            'status' => 'active',
        ]);
        $indicator = AcademicIndicator::query()->create([
            'school_class_id' => $otherClass->id,
            'subject_name' => 'Bahasa Indonesia',
            'semester' => 'Semester 1',
            'code' => 'BIN-01',
            'name' => 'Reading comprehension',
            'status' => 'complete',
        ]);

        $this->actingAs($admin)
            ->from(route('classes.index', ['class' => $class->id]))
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'academic_indicator_id' => $indicator->id,
                'score' => 88,
            ])
            ->assertRedirect(route('classes.index', ['class' => $class->id]))
            ->assertSessionHasErrors(['student_id', 'academic_indicator_id']);

        $this->assertDatabaseCount('assessment_entries', 0);
    }

    public function test_class_report_print_view_shows_indicator_scores_and_teacher_context(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacherUser = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'wali-kelas@example.com']);
        $staff = Staff::query()->create([
            'user_id' => $teacherUser->id,
            'name' => 'Alya Pratama',
            'email' => $teacherUser->email,
            'role' => UserRole::Teacher->value,
            'position' => 'Homeroom Teacher',
            'employee_number' => 'TCH-301',
            'employment_status' => 'active',
        ]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 6A',
            'grade_level' => 'Grade 6',
            'academic_year' => '2025/2026',
            'room_name' => 'Mawar',
        ]);
        $student = Student::query()->create([
            'school_class_id' => $class->id,
            'name' => 'Nadia Maharani',
            'student_number' => 'STD-6101',
            'status' => 'active',
        ]);
        $indicator = AcademicIndicator::query()->create([
            'school_class_id' => $class->id,
            'subject_name' => 'Bahasa Indonesia',
            'semester' => 'Semester 1',
            'code' => 'BIN-06',
            'name' => 'Narrative writing',
            'status' => 'complete',
        ]);

        ClassTeacherAssignment::query()->create([
            'school_class_id' => $class->id,
            'staff_id' => $staff->id,
            'subject_name' => 'Bahasa Indonesia',
            'is_homeroom' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'academic_indicator_id' => $indicator->id,
                'score' => 94,
            ])
            ->assertRedirect();

        $this->actingAs($admin)
            ->get(route('reports.classes.print', $class))
            ->assertOk()
            ->assertSee('Kelas 6A Report Card')
            ->assertSee('Alya Pratama')
            ->assertSee('BIN-06')
            ->assertSee('Nadia Maharani')
            ->assertSee('94');
    }

    public function test_class_score_csv_export_contains_indicator_columns_and_scores(): void
    {
        $teacher = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'report-export@example.com']);
        $staff = Staff::query()->create([
            'user_id' => $teacher->id,
            'name' => 'Rizky Darmawan',
            'email' => $teacher->email,
            'role' => UserRole::Teacher->value,
            'position' => 'Subject Teacher',
            'employee_number' => 'TCH-302',
            'employment_status' => 'active',
        ]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 6B',
            'grade_level' => 'Grade 6',
            'academic_year' => '2025/2026',
            'room_name' => 'Angsana',
        ]);
        $student = Student::query()->create([
            'school_class_id' => $class->id,
            'name' => 'Fikri Ananda',
            'student_number' => 'STD-6201',
            'status' => 'active',
        ]);
        $indicator = AcademicIndicator::query()->create([
            'school_class_id' => $class->id,
            'subject_name' => 'Science',
            'semester' => 'Semester 2',
            'code' => 'SCI-06',
            'name' => 'Energy transformation',
            'status' => 'complete',
        ]);

        ClassTeacherAssignment::query()->create([
            'school_class_id' => $class->id,
            'staff_id' => $staff->id,
            'subject_name' => 'Science',
            'is_homeroom' => false,
        ]);

        $this->actingAs($teacher)
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'academic_indicator_id' => $indicator->id,
                'score' => 89,
            ])
            ->assertRedirect();

        $response = $this->actingAs($teacher)
            ->get(route('reports.classes.csv', $class));

        $response->assertOk();
        $response->assertHeader('content-disposition');
        $content = $response->streamedContent();

        $this->assertStringContainsString('Student', $content);
        $this->assertStringContainsString('SCI-06 Science', $content);
        $this->assertStringContainsString('Average Score', $content);
        $this->assertStringContainsString('"Fikri Ananda",STD-6201,89,89', $content);
    }

    public function test_admin_can_approve_and_publish_announcements_to_selected_classes(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 4A',
            'grade_level' => 'Grade 4',
            'academic_year' => '2025/2026',
            'room_name' => 'Kenanga',
        ]);

        $this->actingAs($admin)
            ->post(route('communications.store'), [
                'title' => 'Parents Meeting',
                'content' => 'Meeting starts at 09:00.',
                'class_ids' => [$class->id],
            ])
            ->assertRedirect();

        $announcement = Announcement::query()->firstOrFail();

        $this->actingAs($admin)
            ->post(route('communications.approve', $announcement))
            ->assertRedirect();

        $this->actingAs($admin)
            ->post(route('communications.publish', $announcement), [
                'class_ids' => [$class->id],
            ])
            ->assertRedirect();

        $announcement->refresh();

        $this->assertSame('published', $announcement->status);
        $this->assertNotNull($announcement->published_at);
        $this->assertDatabaseHas('announcement_school_class', [
            'announcement_id' => $announcement->id,
            'school_class_id' => $class->id,
        ]);
    }

    public function test_admin_can_store_and_download_an_announcement_document(): void
    {
        Storage::fake(config('zen.upload_disk'));

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 4B',
            'grade_level' => 'Grade 4',
            'academic_year' => '2025/2026',
            'room_name' => 'Kenari',
        ]);

        $this->actingAs($admin)
            ->post(route('communications.store'), [
                'title' => 'Academic Calendar Update',
                'content' => 'Please review the attached calendar.',
                'class_ids' => [$class->id],
                'document' => UploadedFile::fake()->create('calendar.pdf', 64, 'application/pdf'),
            ])
            ->assertRedirect();

        $announcement = Announcement::query()->firstOrFail();

        $this->assertNotNull($announcement->document_path);
        Storage::disk(config('zen.upload_disk'))->assertExists($announcement->document_path);

        $this->actingAs($admin)
            ->get(route('communications.documents.download', $announcement))
            ->assertOk()
            ->assertHeader('content-disposition');
    }

    public function test_admin_can_onboard_staff_without_creating_a_login_account(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post(route('staff.store'), [
                'name' => 'Dina Kurnia',
                'email' => 'dina.staff@example.com',
                'role' => UserRole::Teacher->value,
                'position' => 'Classroom Teacher',
                'employee_number' => 'TCH-501',
                'create_user_account' => false,
            ])
            ->assertRedirect();

        $staff = Staff::query()->where('employee_number', 'TCH-501')->firstOrFail();

        $this->assertNull($staff->user_id);
        $this->assertDatabaseMissing('users', ['email' => 'dina.staff@example.com']);
    }

    public function test_admin_can_create_a_room_booking_for_a_staff_requester(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $staffUser = User::factory()->create(['role' => UserRole::Teacher]);
        $staff = Staff::query()->create([
            'user_id' => $staffUser->id,
            'name' => 'Fahri Hidayat',
            'email' => 'fahri@example.com',
            'role' => 'teacher',
            'position' => 'Science Teacher',
            'employee_number' => 'EMP-9021',
        ]);
        $facility = Facility::query()->create([
            'name' => 'Science Lab',
            'location' => 'Building B',
            'status' => 'available',
        ]);

        $this->actingAs($admin)
            ->post(route('resources.bookings.store'), [
                'facility_id' => $facility->id,
                'requester_type' => 'staff',
                'requester_id' => $staff->id,
                'purpose' => 'Practical exam session',
                'starts_at' => '2026-05-01 09:00:00',
                'ends_at' => '2026-05-01 11:00:00',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('room_bookings', [
            'facility_id' => $facility->id,
            'staff_id' => $staff->id,
            'purpose' => 'Practical exam session',
            'status' => 'scheduled',
        ]);
    }

    public function test_room_booking_rejects_overlapping_time_windows_for_the_same_room(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $student = Student::query()->create([
            'name' => 'Nadia Salsabila',
            'student_number' => 'STD-7001',
            'status' => 'active',
        ]);
        $facility = Facility::query()->create([
            'name' => 'Library Room 2',
            'location' => 'Building A',
            'status' => 'available',
        ]);

        RoomBooking::query()->create([
            'facility_id' => $facility->id,
            'student_id' => $student->id,
            'purpose' => 'Study group',
            'starts_at' => '2026-05-01 10:00:00',
            'ends_at' => '2026-05-01 12:00:00',
            'status' => 'scheduled',
        ]);

        $this->actingAs($admin)
            ->from(route('resources.index'))
            ->post(route('resources.bookings.store'), [
                'facility_id' => $facility->id,
                'requester_type' => 'student',
                'requester_id' => $student->id,
                'purpose' => 'Club meeting',
                'starts_at' => '2026-05-01 11:00:00',
                'ends_at' => '2026-05-01 13:00:00',
            ])
            ->assertRedirect(route('resources.index'))
            ->assertSessionHasErrors('facility_id');

        $this->assertSame(1, RoomBooking::query()->count());
    }
}
