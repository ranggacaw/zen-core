<?php

namespace Tests\Feature;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DataPesertaFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_readonly_student_detail_and_update_photo(): void
    {
        Storage::fake(config('zen.upload_disk'));

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $guardian = Guardian::query()->create([
            'name' => 'Siti Aminah',
            'relationship' => 'Mother',
            'phone' => '08123456789',
            'email' => 'siti.aminah@example.com',
        ]);
        $student = Student::query()->create([
            'guardian_id' => $guardian->id,
            'name' => 'Rania Putri',
            'student_number' => 'STD-9001',
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->get(route('students.show', $student))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('students/show')
                ->where('student.name', 'Rania Putri')
                ->where('student.guardian.name', 'Siti Aminah'));

        $this->actingAs($admin)
            ->post(route('students.photo.update', $student), [
                'avatar' => UploadedFile::fake()->image('student.png'),
            ])
            ->assertRedirect(route('students.show', $student));

        $student->refresh();

        self::assertNotNull($student->avatar);
        Storage::disk(config('zen.upload_disk'))->assertExists($student->avatar);

        $this->actingAs($admin)
            ->get(route('students.show', $student))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('students/show')
                ->where('student.avatar', fn ($avatar) => is_string($avatar) && $avatar !== ''));
    }

    public function test_guardian_management_creates_and_updates_linked_user_account(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $student = Student::query()->create([
            'name' => 'Nadia Safitri',
            'student_number' => 'STD-9005',
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->get(route('guardians.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('guardians/create')
                ->where('students.0.id', $student->id)
                ->where('students.0.student_number', 'STD-9005'));

        $this->actingAs($admin)
            ->post(route('guardians.store'), [
                'name' => 'Bapak Yusuf',
                'relationship' => 'Father',
                'email' => 'bapak.yusuf@example.com',
                'phone' => '08111111111',
                'students' => [$student->id],
            ])
            ->assertRedirect();

        $guardian = Guardian::query()->firstOrFail();

        self::assertNotNull($guardian->user_id);
        $this->assertDatabaseHas('users', [
            'id' => $guardian->user_id,
            'name' => 'Bapak Yusuf',
            'email' => 'bapak.yusuf@example.com',
            'role' => UserRole::RegisteredUser->value,
        ]);

        $this->assertDatabaseHas('user_has_roles', [
            'user_id' => $guardian->user_id,
        ]);

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'guardian_id' => $guardian->id,
        ]);

        $this->actingAs($admin)
            ->put(route('guardians.update', $guardian), [
                'name' => 'Bapak Yusuf Update',
                'relationship' => 'Parent',
                'email' => 'bapak.yusuf.update@example.com',
                'phone' => '08222222222',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $guardian->user_id,
            'name' => 'Bapak Yusuf Update',
            'email' => 'bapak.yusuf.update@example.com',
        ]);
    }

    public function test_ppdb_detail_requires_rejection_note_and_class_selection_for_approval(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $guardian = Guardian::query()->create([
            'name' => 'Ibu Rani',
            'relationship' => 'Parent',
        ]);
        $class = SchoolClass::query()->create([
            'name' => 'Kelas 3A',
            'grade_level' => 'Grade 3',
            'academic_year' => '2025/2026',
            'room_name' => 'Melati',
        ]);
        $applicant = Applicant::query()->create([
            'guardian_id' => $guardian->id,
            'name' => 'Alif Ramadhan',
            'student_number' => 'STD-9002',
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->get(route('ppdb.show', $applicant))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ppdb/show')
                ->where('applicant.name', 'Alif Ramadhan')
                ->where('applicant.guardian.name', 'Ibu Rani'));

        $this->actingAs($admin)
            ->post(route('ppdb.reject', $applicant), [])
            ->assertSessionHasErrors('decision_notes');

        $this->actingAs($admin)
            ->post(route('ppdb.approve', $applicant), [])
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->actingAs($admin)
            ->post(route('ppdb.approve', $applicant), [
                'school_class_id' => $class->id,
            ])
            ->assertRedirect(route('ppdb.show', $applicant));

        $this->assertDatabaseHas('students', [
            'applicant_id' => $applicant->id,
            'school_class_id' => $class->id,
            'status' => 'active',
        ]);
    }
}
