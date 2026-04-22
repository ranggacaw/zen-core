<?php

namespace Tests\Feature;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserProfileCloneTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.indonesia_address.base_url', null);
        config()->set('zen.upload_disk', 'public');
    }

    public function test_admin_can_open_pengajar_profile_on_the_legacy_masterdata_path(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacherUser = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'pengajar@example.com']);

        $this->createAcademicIndicator('Matematika', 'MTK-1');

        Staff::query()->create([
            'user_id' => $teacherUser->id,
            'name' => 'Dewi Purnama',
            'email' => $teacherUser->email,
            'role' => UserRole::Teacher->value,
            'staff_type' => Staff::TYPE_PENGAJAR,
            'position' => 'Guru Matematika',
            'employee_number' => 'PG-001',
            'specialization_subjects' => [],
        ]);

        $this->actingAs($admin)
            ->get('/masterdata/user/'.$teacherUser->id.'/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('master-data/users/profile')
                ->where('can_edit_personal_data', true)
                ->where('default_tab', 'data-diri')
                ->where('staff.staff_type', Staff::TYPE_PENGAJAR)
                ->has('subjects', 1)
            );
    }

    public function test_non_pengajar_profile_only_exposes_password_tab_contract(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $user = User::factory()->create(['role' => UserRole::Admin, 'email' => 'non-pengajar@example.com']);

        Staff::query()->create([
            'user_id' => $user->id,
            'name' => 'Bagus Santoso',
            'email' => $user->email,
            'role' => UserRole::Admin->value,
            'staff_type' => Staff::TYPE_NON_PENGAJAR,
            'position' => 'Operations Officer',
            'employee_number' => 'NPG-001',
        ]);

        $this->actingAs($admin)
            ->get('/masterdata/user/'.$user->id.'/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('master-data/users/profile')
                ->where('can_edit_personal_data', false)
                ->where('default_tab', 'password')
            );
    }

    public function test_admin_can_update_pengajar_profile_data_and_replace_photo(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacherUser = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'old-pengajar@example.com', 'name' => 'Old Name']);

        $math = $this->createAcademicIndicator('Matematika', 'MTK-1');
        $science = $this->createAcademicIndicator('IPA', 'IPA-1');

        $staff = Staff::query()->create([
            'user_id' => $teacherUser->id,
            'name' => 'Old Name',
            'email' => 'old-pengajar@example.com',
            'role' => UserRole::Teacher->value,
            'staff_type' => Staff::TYPE_PENGAJAR,
            'position' => 'Guru Lama',
            'employee_number' => 'PG-OLD',
            'specialization_subjects' => [$math->id],
        ]);

        $this->actingAs($admin)
            ->put(route('master-data.users.profile.update', $teacherUser), [
                'name' => 'Dewi Purnama',
                'email' => 'dewi.purnama@example.com',
                'position' => 'Guru Matematika',
                'employee_number' => 'PG-001',
                'employment_status' => 'active',
                'avatar' => UploadedFile::fake()->image('profile.jpg'),
                'nik' => '3578001011990001',
                'education' => 'S.Pd',
                'specialization_subjects' => [$math->id, $science->id],
                'phone' => '081234567890',
                'gender' => 'P',
                'birth_place' => 'Surabaya',
                'birth_date' => '1990-01-01',
                'nip' => '198901012020011001',
                'religion' => 'islam',
                'bank_name' => 'BCA',
                'bank_account' => '1234567890',
                'join_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'decree_permanent' => 'SK-001',
                'decree_contract' => 'SK-002',
                'address_line' => 'Jl. Mawar 1',
                'province_code' => '35',
                'regency_code' => '3578',
                'district_code' => '3578090',
                'village_code' => '3578090002',
                'postal_code' => '60242',
            ])
            ->assertRedirect();

        $teacherUser->refresh();
        $staff->refresh();

        $this->assertSame('Dewi Purnama', $teacherUser->name);
        $this->assertSame('dewi.purnama@example.com', $teacherUser->email);
        $this->assertSame('Dewi Purnama', $staff->name);
        $this->assertSame('dewi.purnama@example.com', $staff->email);
        $this->assertSame('Guru Matematika', $staff->position);
        $this->assertSame('PG-001', $staff->employee_number);
        $this->assertSame([ $math->id, $science->id ], $staff->specialization_subjects);
        $this->assertSame('Jawa Timur', $staff->province_name);
        $this->assertSame('Kota Surabaya', $staff->regency_name);
        $this->assertSame('Wonokromo', $staff->district_name);
        $this->assertSame('Sawunggaling', $staff->village_name);
        $this->assertNotNull($staff->avatar);
        Storage::disk('public')->assertExists($staff->avatar);
    }

    public function test_invalid_pengajar_profile_submission_keeps_existing_data(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacherUser = User::factory()->create(['role' => UserRole::Teacher, 'email' => 'teacher@example.com', 'name' => 'Teacher']);
        $otherUser = User::factory()->create(['email' => 'taken@example.com']);

        $staff = Staff::query()->create([
            'user_id' => $teacherUser->id,
            'name' => 'Teacher',
            'email' => 'teacher@example.com',
            'role' => UserRole::Teacher->value,
            'staff_type' => Staff::TYPE_PENGAJAR,
            'position' => 'Guru Bahasa',
            'employee_number' => 'PG-002',
        ]);

        $this->actingAs($admin)
            ->from(route('master-data.users.profile', $teacherUser))
            ->put(route('master-data.users.profile.update', $teacherUser), [
                'name' => '',
                'email' => $otherUser->email,
                'position' => '',
                'employee_number' => '',
                'avatar' => UploadedFile::fake()->create('document.pdf', 10, 'application/pdf'),
            ])
            ->assertRedirect(route('master-data.users.profile', $teacherUser))
            ->assertSessionHasErrors(['name', 'email', 'position', 'employee_number', 'avatar']);

        $teacherUser->refresh();
        $staff->refresh();

        $this->assertSame('Teacher', $teacherUser->name);
        $this->assertSame('teacher@example.com', $teacherUser->email);
        $this->assertSame('Guru Bahasa', $staff->position);
        $this->assertSame('PG-002', $staff->employee_number);
        $this->assertNull($staff->avatar);
    }

    public function test_password_updates_require_at_least_eight_characters(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $user = User::factory()->create(['role' => UserRole::Teacher, 'password' => 'password']);
        $originalHash = $user->password;

        $this->actingAs($admin)
            ->put(route('master-data.users.password', $user), [
                'password' => '1234567',
                'password_confirmation' => '1234567',
            ])
            ->assertSessionHasErrors('password');

        $user->refresh();
        $this->assertSame($originalHash, $user->password);

        $this->actingAs($admin)
            ->put(route('master-data.users.password', $user), [
                'password' => 'new-password-123',
                'password_confirmation' => 'new-password-123',
            ])
            ->assertRedirect();

        $user->refresh();
        $this->assertTrue(Hash::check('new-password-123', $user->password));
    }

    public function test_address_reference_endpoint_filters_by_selected_parent_codes(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->getJson(route('address-reference.index', [
                'province' => '35',
                'regency' => '3578',
                'district' => '3578090',
            ]))
            ->assertOk()
            ->assertJsonPath('regencies.0.code', '3578')
            ->assertJsonPath('districts.0.code', '3578090')
            ->assertJsonPath('villages.0.code', '3578090001');
    }

    protected function createAcademicIndicator(string $name, string $code): AcademicIndicator
    {
        $schoolClass = SchoolClass::query()->create([
            'name' => 'Kelas Profil '.$code,
            'grade_level' => 'Grade 4',
            'academic_year' => '2025/2026',
        ]);

        return AcademicIndicator::query()->create([
            'school_class_id' => $schoolClass->id,
            'subject_name' => $name,
            'semester' => 'Semester 1',
            'code' => $code,
            'name' => $name,
        ]);
    }
}
