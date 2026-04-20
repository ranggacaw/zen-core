<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AttendanceScanned implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @param  array{student:string,class:string,status:string,scanned_at:string}  $activity
     */
    public function __construct(public array $activity)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('attendance-feed');
    }

    public function broadcastAs(): string
    {
        return 'attendance.scanned';
    }
}
