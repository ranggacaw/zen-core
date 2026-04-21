<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\SchoolInformation\Models\SchoolInformation;
use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SchoolInformationController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('sekolah/informasi/index', [
            'items' => SchoolInformation::query()
                ->with(['approver:id,name', 'classes:id,name', 'document'])
                ->latest()
                ->get()
                ->map(fn (SchoolInformation $information) => $this->informationListItem($information)),
            'canApprove' => $request->user()?->hasRole(UserRole::Admin) ?? false,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('sekolah/informasi/form', [
            'mode' => 'create',
            'information' => null,
            'classes' => $this->activeClasses(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePayload($request);
        $disk = config('zen.upload_disk', 'public');

        DB::transaction(function () use ($request, $validated, $disk): void {
            $information = SchoolInformation::query()->create([
                'tanggal' => $validated['tanggal'],
                'jenis_informasi' => $validated['jenis_informasi'],
                'judul' => $validated['judul'],
                'isi' => $validated['isi'],
                'gambar_sampul_path' => $request->file('cover_image')?->store('school-information/covers', $disk),
            ]);

            $information->classes()->sync($validated['class_ids']);
            $this->storeDocument($information, $request, $disk);
        });

        return redirect()->route('sekolah.informasi.index')->with('success', 'Informasi sekolah berhasil dibuat.');
    }

    public function edit(SchoolInformation $schoolInformation): Response
    {
        $schoolInformation->load(['classes:id,name', 'document']);

        return Inertia::render('sekolah/informasi/form', [
            'mode' => 'edit',
            'information' => $this->informationFormData($schoolInformation),
            'classes' => $this->activeClasses(),
        ]);
    }

    public function update(Request $request, SchoolInformation $schoolInformation): RedirectResponse
    {
        $validated = $this->validatePayload($request);
        $disk = config('zen.upload_disk', 'public');

        DB::transaction(function () use ($request, $validated, $schoolInformation, $disk): void {
            $coverPath = $schoolInformation->gambar_sampul_path;

            if ($request->file('cover_image')) {
                if ($coverPath) {
                    Storage::disk($disk)->delete($coverPath);
                }

                $coverPath = $request->file('cover_image')->store('school-information/covers', $disk);
            }

            $schoolInformation->update([
                'tanggal' => $validated['tanggal'],
                'jenis_informasi' => $validated['jenis_informasi'],
                'judul' => $validated['judul'],
                'isi' => $validated['isi'],
                'gambar_sampul_path' => $coverPath,
            ]);

            $schoolInformation->classes()->sync($validated['class_ids']);
            $this->storeDocument($schoolInformation, $request, $disk, true);
        });

        return redirect()->route('sekolah.informasi.index')->with('success', 'Informasi sekolah berhasil diperbarui.');
    }

    public function destroy(SchoolInformation $schoolInformation): RedirectResponse
    {
        DB::transaction(function () use ($schoolInformation): void {
            $this->deleteAssets($schoolInformation);
            $schoolInformation->delete();
        });

        return redirect()->route('sekolah.informasi.index')->with('success', 'Informasi sekolah berhasil dihapus.');
    }

    public function approve(Request $request, SchoolInformation $schoolInformation): RedirectResponse
    {
        abort_unless($request->user()?->hasRole(UserRole::Admin), 403);

        $schoolInformation->update([
            'approved_by' => $request->user()?->id,
            'approved_at' => now(),
        ]);

        return redirect()->route('sekolah.informasi.index')->with('success', 'Informasi sekolah berhasil disetujui.');
    }

    public function downloadDocument(SchoolInformation $schoolInformation): StreamedResponse
    {
        $document = $schoolInformation->document;

        abort_unless($document, 404);
        abort_unless(Storage::disk($document->disk)->exists($document->path), 404);

        return Storage::disk($document->disk)->download($document->path, $document->original_name);
    }

    private function validatePayload(Request $request): array
    {
        $validated = $request->validate([
            'tanggal' => ['required', 'date'],
            'jenis_informasi' => ['required', 'string', 'max:100'],
            'judul' => ['required', 'string', 'max:255'],
            'isi' => ['required', 'string'],
            'class_ids' => ['required', 'array', 'min:1'],
            'class_ids.*' => ['integer', 'exists:school_classes,id'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'document' => ['nullable', 'file', 'max:5120'],
        ]);

        $activeClassIds = collect($this->activeClasses())->pluck('id')->all();
        $invalidClassIds = array_diff($validated['class_ids'], $activeClassIds);

        if ($invalidClassIds !== []) {
            throw ValidationException::withMessages([
                'class_ids' => 'Kelas tujuan harus berasal dari tahun ajaran aktif.',
            ]);
        }

        return $validated;
    }

    private function activeClasses(): array
    {
        $currentAcademicYear = $this->currentAcademicYear();
        $query = SchoolClass::query()->orderBy('name');

        if (SchoolClass::query()->where('academic_year', $currentAcademicYear)->exists()) {
            $query->where('academic_year', $currentAcademicYear);
        }

        return $query
            ->get(['id', 'name', 'academic_year'])
            ->map(fn (SchoolClass $schoolClass) => [
                'id' => $schoolClass->id,
                'name' => $schoolClass->name,
                'academic_year' => $schoolClass->academic_year,
            ])
            ->all();
    }

    private function currentAcademicYear(): string
    {
        $startYear = now()->month >= 7 ? now()->year : now()->year - 1;

        return sprintf('%d/%d', $startYear, $startYear + 1);
    }

    private function informationListItem(SchoolInformation $information): array
    {
        return [
            'id' => $information->id,
            'tanggal' => $information->tanggal?->format('Y-m-d'),
            'jenis_informasi' => $information->jenis_informasi,
            'judul' => $information->judul,
            'isi_ringkas' => Str::limit(trim(strip_tags($information->isi)), 180),
            'classes' => $information->classes->pluck('name')->all(),
            'approval_status' => $information->approved_at ? 'approved' : 'pending',
            'approved_by' => $information->approver?->name,
            'created_at' => $information->created_at?->toDateTimeString(),
            'has_cover' => $information->gambar_sampul_path !== null,
            'document_download_url' => $information->document ? route('sekolah.informasi.documents.download', $information) : null,
        ];
    }

    private function informationFormData(SchoolInformation $information): array
    {
        return [
            'id' => $information->id,
            'tanggal' => $information->tanggal?->format('Y-m-d') ?? '',
            'jenis_informasi' => $information->jenis_informasi,
            'judul' => $information->judul,
            'isi' => $information->isi,
            'class_ids' => $information->classes->pluck('id')->map(fn (int $id) => (string) $id)->all(),
            'has_cover' => $information->gambar_sampul_path !== null,
            'document_name' => $information->document?->original_name,
        ];
    }

    private function storeDocument(SchoolInformation $information, Request $request, string $disk, bool $replaceExisting = false): void
    {
        if (! $request->file('document')) {
            return;
        }

        if ($replaceExisting && $information->document) {
            Storage::disk($information->document->disk)->delete($information->document->path);
            $information->document()->delete();
        }

        $file = $request->file('document');
        $path = $file->store('school-information/documents', $disk);

        $information->document()->create([
            'disk' => $disk,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    private function deleteAssets(SchoolInformation $information): void
    {
        if ($information->gambar_sampul_path) {
            Storage::disk(config('zen.upload_disk', 'public'))->delete($information->gambar_sampul_path);
        }

        if ($information->document) {
            Storage::disk($information->document->disk)->delete($information->document->path);
        }
    }
}
