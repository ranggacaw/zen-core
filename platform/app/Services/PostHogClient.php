<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class PostHogClient
{
    public function capture(string $event, string|int|null $distinctId, array $properties = []): void
    {
        $apiKey = config('services.posthog.key');
        $host = rtrim((string) config('services.posthog.host'), '/');

        if (! $apiKey || ! $host || ! $distinctId) {
            return;
        }

        try {
            Http::asJson()
                ->timeout(5)
                ->post("{$host}/capture/", [
                    'api_key' => $apiKey,
                    'event' => $event,
                    'distinct_id' => (string) $distinctId,
                    'properties' => $properties,
                ])
                ->throw();
        } catch (Throwable $exception) {
            Log::warning('posthog_capture_failed', [
                'event' => $event,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
