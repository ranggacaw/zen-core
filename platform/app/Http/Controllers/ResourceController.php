<?php

namespace App\Http\Controllers;

use App\Domain\BusinessResources\Models\BillingRecord;
use App\Domain\BusinessResources\Models\EventAllocation;
use App\Domain\BusinessResources\Models\Facility;
use App\Domain\BusinessResources\Models\InventoryItem;
use App\Domain\BusinessResources\Models\SchoolEvent;
use App\Domain\StudentLifecycle\Models\Student;
use App\Jobs\TrackAnalyticsEvent;
use App\Services\MidtransClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function __construct(protected MidtransClient $midtrans)
    {
    }

    public function index(): Response
    {
        return Inertia::render('resources/index', [
            'billing' => BillingRecord::query()
                ->with('student:id,name,student_number')
                ->latest()
                ->get()
                ->map(fn (BillingRecord $billing) => [
                    'id' => $billing->id,
                    'student' => $billing->student?->name,
                    'student_number' => $billing->student?->student_number,
                    'title' => $billing->title,
                    'amount' => $billing->amount,
                    'status' => $billing->status,
                    'payment_reference' => $billing->payment_reference,
                    'due_on' => optional($billing->due_on)?->toDateString(),
                ]),
            'inventory' => InventoryItem::query()->latest()->get(['id', 'name', 'stock_quantity', 'status']),
            'facilities' => Facility::query()->latest()->get(['id', 'name', 'location', 'status']),
            'events' => SchoolEvent::query()
                ->with('allocations.allocatable')
                ->latest('scheduled_for')
                ->get()
                ->map(fn (SchoolEvent $event) => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'scheduled_for' => $event->scheduled_for->toDateTimeString(),
                    'notes' => $event->notes,
                    'allocations' => $event->allocations->map(fn (EventAllocation $allocation) => [
                        'resource' => $allocation->allocatable?->name,
                        'status' => $allocation->status,
                        'quantity' => $allocation->quantity,
                    ]),
                ]),
            'students' => Student::query()->orderBy('name')->get(['id', 'name', 'student_number']),
        ]);
    }

    public function storeBilling(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'due_on' => ['nullable', 'date'],
        ]);

        BillingRecord::query()->create($validated + ['status' => 'pending']);

        return back()->with('success', 'Billing record created.');
    }

    public function reconcileBilling(Request $request, BillingRecord $billing): RedirectResponse
    {
        $payload = $request->all() ?: [
            'order_id' => 'billing-'.$billing->id,
            'transaction_status' => 'settlement',
            'settlement_time' => now()->toDateTimeString(),
        ];

        $settlement = $this->midtrans->normalizeSettlement($payload);

        abort_unless($settlement !== null, 422, 'Payment is not settled yet.');

        $billing->update([
            'status' => $settlement['status'],
            'payment_reference' => $settlement['reference'],
            'paid_at' => $settlement['paid_at'],
            'provider_payload' => $settlement['payload'],
        ]);

        TrackAnalyticsEvent::dispatch('billing.reconciled', $request->user()?->id, [
            'billing_id' => $billing->id,
            'status' => $settlement['status'],
        ]);

        return back()->with('success', 'Billing reconciled successfully.');
    }

    public function storeInventory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
        ]);

        InventoryItem::query()->create($validated + ['status' => 'available']);

        return back()->with('success', 'Inventory item created.');
    }

    public function storeFacility(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        Facility::query()->create($validated + ['status' => 'available']);

        return back()->with('success', 'Facility created.');
    }

    public function storeEvent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'scheduled_for' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        SchoolEvent::query()->create($validated);

        return back()->with('success', 'Event created.');
    }

    public function allocateEvent(Request $request, SchoolEvent $event): RedirectResponse
    {
        $validated = $request->validate([
            'resource_type' => ['required', 'in:facility,inventory'],
            'resource_id' => ['required', 'integer'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $resource = $validated['resource_type'] === 'facility'
            ? Facility::query()->findOrFail($validated['resource_id'])
            : InventoryItem::query()->findOrFail($validated['resource_id']);

        $event->allocations()->create([
            'allocatable_type' => $resource::class,
            'allocatable_id' => $resource->id,
            'quantity' => $validated['quantity'] ?? 1,
            'status' => 'allocated',
        ]);

        $resource->update([
            'status' => $validated['resource_type'] === 'facility' ? 'booked' : 'allocated',
        ]);

        return back()->with('success', 'Resource allocated to event.');
    }

    public function webhook(Request $request): JsonResponse
    {
        $settlement = $this->midtrans->normalizeSettlement($request->all());

        if (! $settlement) {
            return response()->json(['status' => 'ignored'], 202);
        }

        $billingId = (int) str((string) $request->input('order_id', ''))->after('billing-')->toString();
        $billing = BillingRecord::query()->findOrFail($billingId);

        $billing->update([
            'status' => $settlement['status'],
            'payment_reference' => $settlement['reference'],
            'paid_at' => $settlement['paid_at'],
            'provider_payload' => $settlement['payload'],
        ]);

        return response()->json(['status' => 'ok']);
    }
}
