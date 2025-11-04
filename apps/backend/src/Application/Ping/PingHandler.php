<?php

namespace App\Application\Ping;

use App\Domain\Ping\PingResult;

final class PingHandler
{
    public function handle(): PingResult
    {
        return PingResult::success();
    }
}
