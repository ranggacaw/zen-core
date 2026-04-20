<?php

namespace App\Jobs;

use App\Services\PostHogClient;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;

class TrackAnalyticsEvent implements ShouldQueue
{
    use Dispatchable;
    use Queueable;

    /**
     * @param  array<string, mixed>  $properties
     */
    public function __construct(
        public string $event,
        public string|int|null $distinctId,
        public array $properties = [],
    ) {
    }

    public function handle(PostHogClient $client): void
    {
        $client->capture($this->event, $this->distinctId, $this->properties);
    }
}
