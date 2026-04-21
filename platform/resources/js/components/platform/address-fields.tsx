import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

export interface AddressOption {
    code: string;
    name: string;
}

export interface AddressOptions {
    provinces: AddressOption[];
    regencies: AddressOption[];
    districts: AddressOption[];
    villages: AddressOption[];
}

export interface AddressValue {
    address_line: string;
    province_code: string;
    regency_code: string;
    district_code: string;
    village_code: string;
}

interface AddressFieldsProps {
    data: AddressValue;
    options: AddressOptions;
    setData: (field: keyof AddressValue, value: string) => void;
}

export function AddressFields({ data, options, setData }: AddressFieldsProps) {
    const [dynamicOptions, setDynamicOptions] = useState(options);

    useEffect(() => {
        setDynamicOptions(options);
    }, [options]);

    useEffect(() => {
        const controller = new AbortController();
        const searchParams = new URLSearchParams();

        if (data.province_code) {
            searchParams.set('province', data.province_code);
        }

        if (data.regency_code) {
            searchParams.set('regency', data.regency_code);
        }

        if (data.district_code) {
            searchParams.set('district', data.district_code);
        }

        fetch(`/address-reference?${searchParams.toString()}`, { signal: controller.signal })
            .then((response) => response.json())
            .then((payload: AddressOptions) => {
                setDynamicOptions({
                    provinces: payload.provinces.length ? payload.provinces : options.provinces,
                    regencies: payload.regencies,
                    districts: payload.districts,
                    villages: payload.villages,
                });

                const nextRegency = payload.regencies.some((item) => item.code === data.regency_code)
                    ? data.regency_code
                    : payload.regencies[0]?.code ?? '';

                if (nextRegency !== data.regency_code) {
                    setData('regency_code', nextRegency);
                }

                const nextDistrict = payload.districts.some((item) => item.code === data.district_code)
                    ? data.district_code
                    : payload.districts[0]?.code ?? '';

                if (nextDistrict !== data.district_code) {
                    setData('district_code', nextDistrict);
                }

                const nextVillage = payload.villages.some((item) => item.code === data.village_code)
                    ? data.village_code
                    : payload.villages[0]?.code ?? '';

                if (nextVillage !== data.village_code) {
                    setData('village_code', nextVillage);
                }
            })
            .catch(() => {
                // Keep initial fallback options when the lookup request is unavailable.
            });

        return () => controller.abort();
    }, [data.province_code, data.regency_code, data.district_code, data.village_code, options.provinces]);

    return (
        <>
            <div>
                <label className="mb-1 block text-xs text-muted-foreground">Address line</label>
                <Textarea value={data.address_line} onChange={(event) => setData('address_line', event.target.value)} placeholder="Street, RT/RW, house number" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Province</label>
                    <NativeSelect value={data.province_code} onChange={(event) => setData('province_code', event.target.value)}>
                        <option value="">Select province</option>
                        {dynamicOptions.provinces.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name}
                            </option>
                        ))}
                    </NativeSelect>
                </div>
                <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Regency</label>
                    <NativeSelect value={data.regency_code} onChange={(event) => setData('regency_code', event.target.value)}>
                        <option value="">Select regency</option>
                        {dynamicOptions.regencies.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name}
                            </option>
                        ))}
                    </NativeSelect>
                </div>
                <div>
                    <label className="mb-1 block text-xs text-muted-foreground">District</label>
                    <NativeSelect value={data.district_code} onChange={(event) => setData('district_code', event.target.value)}>
                        <option value="">Select district</option>
                        {dynamicOptions.districts.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name}
                            </option>
                        ))}
                    </NativeSelect>
                </div>
                <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Village</label>
                    <NativeSelect value={data.village_code} onChange={(event) => setData('village_code', event.target.value)}>
                        <option value="">Select village</option>
                        {dynamicOptions.villages.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name}
                            </option>
                        ))}
                    </NativeSelect>
                </div>
            </div>
        </>
    );
}
