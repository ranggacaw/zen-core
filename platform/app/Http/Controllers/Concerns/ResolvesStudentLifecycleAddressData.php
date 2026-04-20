<?php

namespace App\Http\Controllers\Concerns;

use App\Services\AddressReferenceService;
use Illuminate\Support\Arr;

trait ResolvesStudentLifecycleAddressData
{
    /**
     * @return array{provinces:list<array{code:string,name:string}>,regencies:list<array{code:string,name:string}>,districts:list<array{code:string,name:string}>,villages:list<array{code:string,name:string}>}
     */
    protected function addressOptions(AddressReferenceService $addressReference, ?string $provinceCode = null, ?string $regencyCode = null, ?string $districtCode = null): array
    {
        $provinces = $addressReference->provinces();
        $provinceCode ??= Arr::get($provinces, '0.code');

        $regencies = $addressReference->regencies($provinceCode);
        $regencyCode ??= Arr::get($regencies, '0.code');

        $districts = $addressReference->districts($regencyCode);
        $districtCode ??= Arr::get($districts, '0.code');

        return [
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
            'villages' => $addressReference->villages($districtCode),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, string|null>
     */
    protected function addressNames(AddressReferenceService $addressReference, array $validated): array
    {
        return [
            'province_code' => $validated['province_code'] ?? null,
            'province_name' => $this->lookupName($addressReference->provinces(), $validated['province_code'] ?? null),
            'regency_code' => $validated['regency_code'] ?? null,
            'regency_name' => $this->lookupName($addressReference->regencies($validated['province_code'] ?? null), $validated['regency_code'] ?? null),
            'district_code' => $validated['district_code'] ?? null,
            'district_name' => $this->lookupName($addressReference->districts($validated['regency_code'] ?? null), $validated['district_code'] ?? null),
            'village_code' => $validated['village_code'] ?? null,
            'village_name' => $this->lookupName($addressReference->villages($validated['district_code'] ?? null), $validated['village_code'] ?? null),
        ];
    }

    /**
     * @param  list<array{code:string,name:string}>  $options
     */
    protected function lookupName(array $options, ?string $code): ?string
    {
        return collect($options)->firstWhere('code', $code)['name'] ?? null;
    }
}
