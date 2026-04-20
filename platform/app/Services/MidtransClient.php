<?php

namespace App\Services;

use Illuminate\Support\Arr;

class MidtransClient
{
    /**
     * @return array{reference:string,status:string,paid_at:?string,payload:array<string,mixed>}|null
     */
    public function normalizeSettlement(array $payload): ?array
    {
        $status = (string) Arr::get($payload, 'transaction_status', Arr::get($payload, 'status', ''));

        if (! in_array($status, ['capture', 'paid', 'settlement'], true)) {
            return null;
        }

        return [
            'reference' => (string) Arr::get($payload, 'order_id', Arr::get($payload, 'transaction_id', 'unknown-reference')),
            'status' => 'paid',
            'paid_at' => Arr::get($payload, 'settlement_time', Arr::get($payload, 'transaction_time')),
            'payload' => $payload,
        ];
    }
}
