<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class PingControllerTest extends WebTestCase
{
    public function testPingEndpointReturnsPong(): void
    {
        $client = static::createClient();
        $client->request('GET', '/ping');

        $this->assertSame(200, $client->getResponse()->getStatusCode(), 'Status code should be 200');
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('pong', $data);
        $this->assertTrue($data['pong']);
    }
}
