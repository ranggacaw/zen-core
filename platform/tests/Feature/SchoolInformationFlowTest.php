<?php

namespace Tests\Feature;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\SchoolInformation\Models\SchoolInformation;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SchoolInformationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_school_information_index_in_newest_first_order(): void
    {
        $teacher = User::factory()->create(['role' => UserRole::Teacher]);

        $older = SchoolInformation::query()->create([
            'tanggal' => '2026-04-20',
            'jenis_informasi' => 'Pengumuman',
            'judul' => 'Informasi Lama',
            'isi' => 'Isi lama',
        ]);
        $older->forceFill([
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ])->saveQuietly();

        $newer = SchoolInformation::query()->create([
            'tanggal' => '2026-04-21',
            'jenis_informasi' => 'Agenda',
            'judul' => 'Informasi Baru',
            'isi' => 'Isi baru',
        ]);
        $newer->forceFill([
            'created_at' => now(),
            'updated_at' => now(),
        ])->saveQuietly();

        $response = $this->actingAs($teacher)->get(route('sekolah.informasi.index'));

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('sekolah/informasi/index')
            ->has('items', 2)
            ->where('items.0.id', $newer->id)
            ->where('items.0.judul', 'Informasi Baru')
            ->where('items.1.id', $older->id)
            ->where('canApprove', false));
    }

    public function test_create_page_only_exposes_active_academic_year_classes(): void
    {
        $teacher = User::factory()->create(['role' => UserRole::Teacher]);
        $active = SchoolClass::query()->create([
            'name' => 'Kelas Aktif',
            'grade_level' => 'Grade 4',
            'academic_year' => '2025/2026',
            'room_name' => 'Mawar',
        ]);
        SchoolClass::query()->create([
            'name' => 'Kelas Lama',
            'grade_level' => 'Grade 4',
            'academic_year' => '2024/2025',
            'room_name' => 'Kenanga',
        ]);

        $this->actingAs($teacher)
            ->get(route('sekolah.informasi.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('sekolah/informasi/form')
                ->where('mode', 'create')
                ->has('classes', 1)
                ->where('classes.0.id', $active->id));
    }

    public function test_teacher_can_store_school_information_with_class_targets_and_document(): void
    {
        Storage::fake(config('zen.upload_disk'));

        $teacher = User::factory()->create(['role' => UserRole::Teacher]);
        $active = SchoolClass::query()->create([
            'name' => 'Kelas 6A',
            'grade_level' => 'Grade 6',
            'academic_year' => '2025/2026',
            'room_name' => 'Cendana',
        ]);

        $this->actingAs($teacher)
            ->post(route('sekolah.informasi.store'), [
                'tanggal' => '2026-04-21',
                'jenis_informasi' => 'Pengumuman',
                'judul' => 'Jadwal kegiatan',
                'isi' => 'Rapat orang tua dimulai pukul 09.00.',
                'class_ids' => [$active->id],
                'cover_image' => UploadedFile::fake()->image('cover.png'),
                'document' => UploadedFile::fake()->create('agenda.pdf', 64, 'application/pdf'),
            ])
            ->assertRedirect(route('sekolah.informasi.index'));

        $information = SchoolInformation::query()->with('document')->firstOrFail();

        $this->assertDatabaseHas('t_informasi_has_kelas', [
            'informasi_id' => $information->id,
            'school_class_id' => $active->id,
        ]);
        $this->assertNotNull($information->gambar_sampul_path);
        $this->assertNotNull($information->document);
        Storage::disk(config('zen.upload_disk'))->assertExists($information->gambar_sampul_path);
        Storage::disk(config('zen.upload_disk'))->assertExists($information->document->path);
    }

    public function test_store_validation_rejects_inactive_class_targets(): void
    {
        $teacher = User::factory()->create(['role' => UserRole::Teacher]);
        $inactive = SchoolClass::query()->create([
            'name' => 'Kelas Lama',
            'grade_level' => 'Grade 3',
            'academic_year' => '2024/2025',
            'room_name' => 'Flamboyan',
        ]);
        SchoolClass::query()->create([
            'name' => 'Kelas Aktif',
            'grade_level' => 'Grade 3',
            'academic_year' => '2025/2026',
            'room_name' => 'Cemara',
        ]);

        $this->actingAs($teacher)
            ->from(route('sekolah.informasi.create'))
            ->post(route('sekolah.informasi.store'), [
                'tanggal' => '2026-04-21',
                'jenis_informasi' => 'Pengumuman',
                'judul' => 'Tidak valid',
                'isi' => 'Isi informasi',
                'class_ids' => [$inactive->id],
            ])
            ->assertRedirect(route('sekolah.informasi.create'))
            ->assertSessionHasErrors('class_ids');
    }

    public function test_teacher_can_delete_school_information_and_cleanup_uploaded_assets(): void
    {
        Storage::fake(config('zen.upload_disk'));

        $teacher = User::factory()->create(['role' => UserRole::Teacher]);
        $information = SchoolInformation::query()->create([
            'tanggal' => '2026-04-21',
            'jenis_informasi' => 'Pengumuman',
            'judul' => 'Informasi Hapus',
            'isi' => 'Isi informasi',
            'gambar_sampul_path' => UploadedFile::fake()->image('cover.png')->store('school-information/covers', config('zen.upload_disk')),
        ]);
        $information->document()->create([
            'disk' => config('zen.upload_disk'),
            'path' => UploadedFile::fake()->create('doc.pdf', 64, 'application/pdf')->store('school-information/documents', config('zen.upload_disk')),
            'original_name' => 'doc.pdf',
            'mime_type' => 'application/pdf',
            'size' => 64000,
        ]);

        $coverPath = $information->gambar_sampul_path;
        $documentPath = $information->document->path;

        $this->actingAs($teacher)
            ->delete(route('sekolah.informasi.destroy', $information))
            ->assertRedirect(route('sekolah.informasi.index'));

        $this->assertDatabaseMissing('t_informasi_sekolah', ['id' => $information->id]);
        $this->assertDatabaseMissing('t_document', ['informasi_id' => $information->id]);
        Storage::disk(config('zen.upload_disk'))->assertMissing($coverPath);
        Storage::disk(config('zen.upload_disk'))->assertMissing($documentPath);
    }

    public function test_admin_can_approve_school_information_but_teacher_cannot(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacher = User::factory()->create(['role' => UserRole::Teacher]);
        $information = SchoolInformation::query()->create([
            'tanggal' => '2026-04-21',
            'jenis_informasi' => 'Agenda',
            'judul' => 'Persetujuan',
            'isi' => 'Menunggu persetujuan',
        ]);

        $this->actingAs($teacher)
            ->post(route('sekolah.informasi.approve', $information))
            ->assertForbidden();

        $this->actingAs($admin)
            ->post(route('sekolah.informasi.approve', $information))
            ->assertRedirect(route('sekolah.informasi.index'));

        $information->refresh();

        $this->assertNotNull($information->approved_at);
        $this->assertSame($admin->id, $information->approved_by);
    }
}
