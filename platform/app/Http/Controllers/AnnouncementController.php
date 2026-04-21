<?php

namespace App\Http\Controllers;

use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Jobs\TrackAnalyticsEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('communications/index', [
            'announcements' => Announcement::query()
                ->with(['classes:id,name', 'approver:id,name'])
                ->latest()
                ->get()
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'status' => $announcement->status,
                    'classes' => $announcement->classes->pluck('name')->all(),
                    'class_ids' => $announcement->classes->pluck('id')->all(),
                    'approver' => $announcement->approver?->name,
                    'has_cover' => $announcement->cover_path !== null,
                    'has_document' => $announcement->document_path !== null,
                    'document_download_url' => $announcement->document_path ? route('communications.documents.download', $announcement) : null,
                    'published_at' => optional($announcement->published_at)?->toDateTimeString(),
                ]),
            'classes' => SchoolClass::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'class_ids' => ['required', 'array', 'min:1'],
            'class_ids.*' => ['integer', 'exists:school_classes,id'],
            'cover_image' => ['nullable', 'file', 'max:4096'],
            'document' => ['nullable', 'file', 'max:5120'],
        ]);

        $disk = config('zen.upload_disk', 'public');

        $announcement = Announcement::query()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => 'draft',
            'cover_path' => $request->file('cover_image')?->store('announcements/covers', $disk),
            'document_path' => $request->file('document')?->store('announcements/documents', $disk),
        ]);

        $announcement->classes()->sync($validated['class_ids']);

        return back()->with('success', 'Announcement draft created.');
    }

    public function approve(Request $request, Announcement $announcement): RedirectResponse
    {
        $announcement->update([
            'status' => 'approved',
            'approved_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Announcement approved.');
    }

    public function publish(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'class_ids' => ['required', 'array', 'min:1'],
            'class_ids.*' => ['integer', 'exists:school_classes,id'],
        ]);

        abort_unless($announcement->status === 'approved', 422, 'Announcement must be approved before publishing.');

        $announcement->classes()->sync($validated['class_ids']);
        $announcement->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        TrackAnalyticsEvent::dispatch('announcement.published', $request->user()?->id, [
            'announcement_id' => $announcement->id,
            'audience_count' => count($validated['class_ids']),
        ]);

        return back()->with('success', 'Announcement published to the selected classes.');
    }

    public function downloadDocument(Announcement $announcement): StreamedResponse
    {
        abort_unless($announcement->document_path, 404);

        $disk = config('zen.upload_disk', 'public');
        abort_unless(Storage::disk($disk)->exists($announcement->document_path), 404);

        return Storage::disk($disk)->download($announcement->document_path, basename($announcement->document_path));
    }
}
