<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class AddressReferenceService
{
    /**
     * @return list<array{code:string,name:string}>
     */
    public function provinces(): array
    {
        return $this->remember('provinces', fn () => $this->fetch('provinces.json', config('zen.address_reference.provinces', [])));
    }

    /**
     * @return list<array{code:string,name:string}>
     */
    public function regencies(?string $provinceCode): array
    {
        if (! $provinceCode) {
            return [];
        }

        $fallback = Arr::get(config('zen.address_reference.regencies', []), $provinceCode, []);

        return $this->remember("regencies:{$provinceCode}", fn () => $this->fetch("regencies/{$provinceCode}.json", $fallback));
    }

    /**
     * @return list<array{code:string,name:string}>
     */
    public function districts(?string $regencyCode): array
    {
        if (! $regencyCode) {
            return [];
        }

        $fallback = Arr::get(config('zen.address_reference.districts', []), $regencyCode, []);

        return $this->remember("districts:{$regencyCode}", fn () => $this->fetch("districts/{$regencyCode}.json", $fallback));
    }

    /**
     * @return list<array{code:string,name:string}>
     */
    public function villages(?string $districtCode): array
    {
        if (! $districtCode) {
            return [];
        }

        $fallback = Arr::get(config('zen.address_reference.villages', []), $districtCode, []);

        return $this->remember("villages:{$districtCode}", fn () => $this->fetch("villages/{$districtCode}.json", $fallback));
    }

    /**
     * @param  callable(): list<array{code:string,name:string}>  $resolver
     * @return list<array{code:string,name:string}>
     */
    protected function remember(string $key, callable $resolver): array
    {
        /** @var list<array{code:string,name:string}> $data */
        $data = Cache::remember("address-reference:{$key}", now()->addDay(), $resolver);

        return $data;
    }

    /**
     * @param  list<array{code:string,name:string}>  $fallback
     * @return list<array{code:string,name:string}>
     */
    protected function fetch(string $endpoint, array $fallback): array
    {
        $baseUrl = config('services.indonesia_address.base_url');

        if (! $baseUrl) {
            return $fallback;
        }

        try {
            $response = Http::baseUrl($baseUrl)->acceptJson()->timeout(5)->get($endpoint);

            if (! $response->successful()) {
                return $fallback;
            }

            return collect($response->json())
                ->map(fn (array $item) => [
                    'code' => (string) ($item['id'] ?? $item['code'] ?? ''),
                    'name' => (string) ($item['name'] ?? ''),
                ])
                ->filter(fn (array $item) => $item['code'] !== '' && $item['name'] !== '')
                ->values()
                ->all();
        } catch (Throwable) {
            return $fallback;
        }
    }
}
