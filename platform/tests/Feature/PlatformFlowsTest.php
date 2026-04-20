<?php

namespace Tests\Feature;

use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\BusinessResources\Models\BillingRecord;
use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $this->actingAs($teacher)
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'subject_name' => 'Mathematics',
                'semester' => 'Semester 1',
                'score' => 92,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('assessment_entries', [
            'school_class_id' => $class->id,
            'student_id' => $student->id,
            'staff_id' => $staff->id,
            'subject_name' => 'Mathematics',
        ]);

        $this->actingAs($teacher)
            ->post(route('classes.assessments.store', $class), [
                'student_id' => $student->id,
                'subject_name' => 'Science',
                'semester' => 'Semester 1',
                'score' => 90,
            ])
            ->assertForbidden();
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

    public function test_midtrans_webhook_reconciles_a_successful_billing_record(): void
    {
        $student = Student::query()->create([
            'name' => 'Tania Putri',
            'student_number' => 'STD-5001',
            'status' => 'active',
        ]);
        $billing = BillingRecord::query()->create([
            'student_id' => $student->id,
            'title' => 'May Tuition',
            'amount' => 850000,
            'status' => 'pending',
        ]);

        $this->post(route('webhooks.midtrans'), [
            'order_id' => 'billing-'.$billing->id,
            'transaction_status' => 'settlement',
            'settlement_time' => now()->toDateTimeString(),
        ])->assertOk();

        $this->assertDatabaseHas('billing_records', [
            'id' => $billing->id,
            'status' => 'paid',
            'payment_reference' => 'billing-'.$billing->id,
        ]);
    }
}
