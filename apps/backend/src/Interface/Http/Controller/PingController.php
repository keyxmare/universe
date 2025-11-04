<?php

namespace App\Interface\Http\Controller;

use App\Application\Ping\PingHandler;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

final class PingController
{
    public function __construct(private readonly PingHandler $handler)
    {
    }

    #[Route('/ping', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $result = $this->handler->handle();
        return new JsonResponse($result->toArray());
    }
}
