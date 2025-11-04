<?php

namespace App\Domain\Ping;

final readonly class PingResult
{
    public function __construct(private bool $pong, private int $timestamp)
    {
    }

    public static function success(): self
    {
        return new self(true, time());
    }

    public function isPong(): bool
    {
        return $this->pong;
    }

    public function getTimestamp(): int
    {
        return $this->timestamp;
    }

    /**
     * Export structure for HTTP layer.
     *
     * @return array{pong: bool, ts: int}
     */
    public function toArray(): array
    {
        return [
            'pong' => $this->isPong(),
            'ts' => $this->getTimestamp(),
        ];
    }
}
