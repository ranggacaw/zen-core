import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';

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
    return (
        <>
            <Textarea value={data.address_line} onChange={(event) => setData('address_line', event.target.value)} placeholder="Address line" />
            <div className="grid gap-4 md:grid-cols-2">
                <NativeSelect value={data.province_code} onChange={(event) => setData('province_code', event.target.value)}>
                    <option value="">Select province</option>
                    {options.provinces.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </NativeSelect>
                <NativeSelect value={data.regency_code} onChange={(event) => setData('regency_code', event.target.value)}>
                    <option value="">Select regency</option>
                    {options.regencies.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </NativeSelect>
                <NativeSelect value={data.district_code} onChange={(event) => setData('district_code', event.target.value)}>
                    <option value="">Select district</option>
                    {options.districts.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </NativeSelect>
                <NativeSelect value={data.village_code} onChange={(event) => setData('village_code', event.target.value)}>
                    <option value="">Select village</option>
                    {options.villages.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </NativeSelect>
            </div>
        </>
    );
}
