<?php

namespace App\Tests\Application;

use App\Application\Ping\PingHandler;
use PHPUnit\Framework\TestCase;

class PingHandlerTest extends TestCase
{
    public function testHandleReturnsPongResult(): void
    {
        $handler = new PingHandler();
        $result = $handler->handle();

        $this->assertTrue($result->isPong());
        $this->assertIsInt($result->getTimestamp());
        $this->assertGreaterThan(0, $result->getTimestamp());
        $array = $result->toArray();
        $this->assertArrayHasKey('pong', $array);
        $this->assertArrayHasKey('ts', $array);
    }
}
