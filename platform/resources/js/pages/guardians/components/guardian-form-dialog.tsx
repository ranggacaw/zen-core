import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { AddressFields } from '@/components/platform/address-fields';

export interface GuardianRecord {
  id: number;
  name: string;
  email: string;
  birth_place: string;
  birth_date: string;
  phone: string;
  occupation: string;
  children_count: number;
  religion: string;
  province_code: string;
  regency_code: string;
  district_code: string;
  village_code: string;
  postal_code: string;
  address_line: string;
  // add more if needed
}

export interface AddressOptions {
  provinces: { code: string; name: string }[];
  regencies: { code: string; name: string }[];
  districts: { code: string; name: string }[];
  villages: { code: string; name: string }[];
}

export interface GuardianFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  guardian?: GuardianRecord;
  students: { id: number; name: string }[];
  addressOptions: AddressOptions;
  onSubmitSuccess?: () => void;
}

export default function GuardianFormDialog({
  isOpen,
  onClose,
  guardian,
  students,
  addressOptions,
  onSubmitSuccess
}: GuardianFormDialogProps) {
  const isEditing = !!guardian;

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: '',
    email: '',
    birth_place: '',
    birth_date: '',
    phone: '',
    occupation: '',
    children_count: 0,
    religion: '',
    student_id: '',
    province_code: '',
    regency_code: '',
    district_code: '',
    village_code: '',
    postal_code: '',
    address_line: '',
    avatar: null as File | null,
  });

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      if (guardian) {
        setData({
          ...data,
          name: guardian.name || '',
          email: guardian.email || '',
          birth_place: guardian.birth_place || '',
          birth_date: guardian.birth_date || '',
          phone: guardian.phone || '',
          occupation: guardian.occupation || '',
          children_count: guardian.children_count || 0,
          religion: guardian.religion || '',
          student_id: '',
          province_code: guardian.province_code || '',
          regency_code: guardian.regency_code || '',
          district_code: guardian.district_code || '',
          village_code: guardian.village_code || '',
          postal_code: guardian.postal_code || '',
          address_line: guardian.address_line || '',
        });
      } else {
        reset();
      }
    }
  }, [isOpen, guardian]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        reset();
        onSubmitSuccess?.();
        onClose();
      },
    };

    if (isEditing) {
      put(`/guardians/${guardian.id}`, options);
    } else {
      post('/guardians', options);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Wali' : 'Tambah Wali'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_place">Tempat Lahir</Label>
              <Input
                id="birth_place"
                value={data.birth_place}
                onChange={(e) => setData('birth_place', e.target.value)}
              />
              {errors.birth_place && <p className="text-sm text-destructive">{errors.birth_place}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Tanggal Lahir</Label>
              <Input
                id="birth_date"
                type="date"
                value={data.birth_date}
                onChange={(e) => setData('birth_date', e.target.value)}
              />
              {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. HP / Telepon</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Pekerjaan</Label>
              <Input
                id="occupation"
                value={data.occupation}
                onChange={(e) => setData('occupation', e.target.value)}
              />
              {errors.occupation && <p className="text-sm text-destructive">{errors.occupation}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="children_count">Jumlah Anak</Label>
              <Input
                id="children_count"
                type="number"
                min="0"
                value={data.children_count}
                onChange={(e) => setData('children_count', parseInt(e.target.value) || 0)}
              />
              {errors.children_count && <p className="text-sm text-destructive">{errors.children_count}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion">Agama</Label>
              <NativeSelect
                id="religion"
                value={data.religion}
                onChange={(e) => setData('religion', e.target.value)}
              >
                <option value="">Pilih Agama</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </NativeSelect>
              {errors.religion && <p className="text-sm text-destructive">{errors.religion}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="student_id">Siswa Terkait</Label>
              <NativeSelect
                id="student_id"
                value={data.student_id}
                onChange={(e) => setData('student_id', e.target.value)}
              >
                <option value="">Pilih Siswa</option>
                {students.map((stu) => (
                  <option key={stu.id} value={stu.id}>{stu.name}</option>
                ))}
              </NativeSelect>
              {errors.student_id && <p className="text-sm text-destructive">{errors.student_id}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="avatar">Pilih Foto</Label>
              <Input
                id="avatar"
                type="file"
                onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
              />
              {errors.avatar && <p className="text-sm text-destructive">{errors.avatar}</p>}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-4">Informasi Alamat</h4>
            <AddressFields
              data={data}
              options={addressOptions}
              setData={(field, value) => setData(field, value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
              Batal
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
