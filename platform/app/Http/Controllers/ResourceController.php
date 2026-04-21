<?php

namespace App\Http\Controllers;

use App\Domain\BusinessResources\Models\Facility;
use App\Domain\BusinessResources\Models\RoomBooking;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('resources/index', [
            'facilities' => Facility::query()->latest()->get(['id', 'name', 'location', 'status']),
            'bookings' => RoomBooking::query()
                ->with(['facility:id,name,location', 'staff:id,name', 'student:id,name,student_number'])
                ->latest('starts_at')
                ->get()
                ->map(fn (RoomBooking $booking) => [
                    'id' => $booking->id,
                    'room' => $booking->facility?->name,
                    'location' => $booking->facility?->location,
                    'requester' => $booking->staff?->name ?? $booking->student?->name,
                    'requester_type' => $booking->staff_id ? 'Staff' : 'Student',
                    'purpose' => $booking->purpose,
                    'notes' => $booking->notes,
                    'status' => $booking->status,
                    'starts_at' => $booking->starts_at?->format('Y-m-d H:i'),
                    'ends_at' => $booking->ends_at?->format('Y-m-d H:i'),
                ]),
            'staff' => Staff::query()->orderBy('name')->get(['id', 'name']),
            'students' => Student::query()->orderBy('name')->get(['id', 'name', 'student_number']),
        ]);
    }

    public function storeFacility(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        Facility::query()->create($validated + ['status' => 'available']);

        return back()->with('success', 'Room created.');
    }

    public function storeBooking(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'requester_type' => ['required', 'in:staff,student'],
            'requester_id' => ['required', 'integer'],
            'purpose' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
        ]);

        $staffId = $validated['requester_type'] === 'staff' ? $validated['requester_id'] : null;
        $studentId = $validated['requester_type'] === 'student' ? $validated['requester_id'] : null;

        if ($staffId !== null) {
            Staff::query()->findOrFail($staffId);
        }

        if ($studentId !== null) {
            Student::query()->findOrFail($studentId);
        }

        $hasOverlap = RoomBooking::query()
            ->where('facility_id', $validated['facility_id'])
            ->whereIn('status', ['scheduled', 'approved', 'in_use'])
            ->where('starts_at', '<', $validated['ends_at'])
            ->where('ends_at', '>', $validated['starts_at'])
            ->exists();

        if ($hasOverlap) {
            return back()->withErrors([
                'facility_id' => 'The selected room is already booked for that time window.',
            ]);
        }

        RoomBooking::query()->create([
            'facility_id' => $validated['facility_id'],
            'staff_id' => $staffId,
            'student_id' => $studentId,
            'purpose' => $validated['purpose'],
            'notes' => $validated['notes'] ?? null,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
            'status' => 'scheduled',
        ]);

        return back()->with('success', 'Room booking created.');
    }
}
