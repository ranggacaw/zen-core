<?php

namespace Database\Seeders;

use App\Domain\AcademicOperations\Models\AcademicIndicator;
use App\Domain\AcademicOperations\Models\AssessmentEntry;
use App\Domain\AcademicOperations\Models\ClassSchedule;
use App\Domain\AcademicOperations\Models\ClassTeacherAssignment;
use App\Domain\AcademicOperations\Models\SchoolClass;
use App\Domain\BusinessResources\Models\Facility;
use App\Domain\BusinessResources\Models\RoomBooking;
use App\Domain\CommunicationEngagement\Models\Announcement;
use App\Domain\DailyOperations\Models\AttendanceRecord;
use App\Domain\StudentLifecycle\Models\Applicant;
use App\Domain\StudentLifecycle\Models\Guardian;
use App\Domain\StudentLifecycle\Models\Student;
use App\Domain\WorkforceAccess\Models\Staff;
use App\Enums\UserRole;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->updateOrCreate([
            'email' => 'admin@zen-core.test',
        ], [
            'name' => 'Zen Core Admin',
            'role' => UserRole::Admin,
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $teacherUser = User::query()->updateOrCreate([
            'email' => 'teacher@zen-core.test',
        ], [
            'name' => 'Alya Pratama',
            'role' => UserRole::Teacher,
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $registeredUser = User::query()->updateOrCreate([
            'email' => 'guardian@zen-core.test',
        ], [
            'name' => 'Budi Santoso',
            'role' => UserRole::RegisteredUser,
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $adminStaff = Staff::query()->updateOrCreate([
            'email' => $admin->email,
        ], [
            'user_id' => $admin->id,
            'name' => $admin->name,
            'role' => UserRole::Admin->value,
            'position' => 'Operations Lead',
            'employee_number' => 'ADM-001',
            'employment_status' => 'active',
        ]);

        $teacherStaff = Staff::query()->updateOrCreate([
            'email' => $teacherUser->email,
        ], [
            'user_id' => $teacherUser->id,
            'name' => $teacherUser->name,
            'role' => UserRole::Teacher->value,
            'position' => 'Homeroom Teacher',
            'employee_number' => 'TCH-001',
            'employment_status' => 'active',
        ]);

        $guardian = Guardian::query()->updateOrCreate([
            'email' => $registeredUser->email,
        ], [
            'user_id' => $registeredUser->id,
            'name' => 'Budi Santoso',
            'relationship' => 'Parent',
            'phone' => '081234567890',
            'address_line' => 'Jl. Pendidikan No. 12',
            'province_code' => '31',
            'province_name' => 'DKI Jakarta',
            'regency_code' => '3171',
            'regency_name' => 'Jakarta Selatan',
            'district_code' => '3171020',
            'district_name' => 'Kebayoran Baru',
            'village_code' => '3171020001',
            'village_name' => 'Senayan',
        ]);

        $class = SchoolClass::query()->updateOrCreate([
            'name' => 'Kelas 5A',
        ], [
            'grade_level' => 'Grade 5',
            'academic_year' => '2025/2026',
            'room_name' => 'Mawar 1',
        ]);

        ClassTeacherAssignment::query()->updateOrCreate([
            'school_class_id' => $class->id,
            'staff_id' => $teacherStaff->id,
            'subject_name' => 'Bahasa Indonesia',
        ], [
            'is_homeroom' => true,
        ]);

        ClassSchedule::query()->updateOrCreate([
            'school_class_id' => $class->id,
            'day_of_week' => 'Monday',
            'subject_name' => 'Bahasa Indonesia',
        ], [
            'staff_id' => $teacherStaff->id,
            'starts_at' => '07:30',
            'ends_at' => '09:00',
        ]);

        $indicator = AcademicIndicator::query()->updateOrCreate([
            'school_class_id' => $class->id,
            'code' => 'BI-01',
        ], [
            'subject_name' => 'Bahasa Indonesia',
            'semester' => 'Semester 1',
            'name' => 'Reading comprehension',
            'status' => 'complete',
        ]);

        $approvedApplicant = Applicant::query()->updateOrCreate([
            'name' => 'Nadia Putri',
        ], [
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'student_number' => 'STD-1001',
            'status' => 'approved',
            'address_line' => 'Jl. Pendidikan No. 12',
            'province_code' => '31',
            'province_name' => 'DKI Jakarta',
            'regency_code' => '3171',
            'regency_name' => 'Jakarta Selatan',
            'district_code' => '3171020',
            'district_name' => 'Kebayoran Baru',
            'village_code' => '3171020001',
            'village_name' => 'Senayan',
        ]);

        $pendingApplicant = Applicant::query()->updateOrCreate([
            'name' => 'Rafi Mahendra',
        ], [
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'student_number' => 'STD-1002',
            'status' => 'pending',
            'address_line' => 'Jl. Pendidikan No. 12',
            'province_code' => '31',
            'province_name' => 'DKI Jakarta',
            'regency_code' => '3171',
            'regency_name' => 'Jakarta Selatan',
            'district_code' => '3171020',
            'district_name' => 'Kebayoran Baru',
            'village_code' => '3171020001',
            'village_name' => 'Senayan',
        ]);

        $student = Student::query()->updateOrCreate([
            'student_number' => $approvedApplicant->student_number,
        ], [
            'applicant_id' => $approvedApplicant->id,
            'guardian_id' => $guardian->id,
            'school_class_id' => $class->id,
            'name' => $approvedApplicant->name,
            'status' => 'active',
            'address_line' => $approvedApplicant->address_line,
            'province_code' => $approvedApplicant->province_code,
            'province_name' => $approvedApplicant->province_name,
            'regency_code' => $approvedApplicant->regency_code,
            'regency_name' => $approvedApplicant->regency_name,
            'district_code' => $approvedApplicant->district_code,
            'district_name' => $approvedApplicant->district_name,
            'village_code' => $approvedApplicant->village_code,
            'village_name' => $approvedApplicant->village_name,
        ]);

        AssessmentEntry::query()->updateOrCreate([
            'school_class_id' => $class->id,
            'student_id' => $student->id,
            'academic_indicator_id' => $indicator->id,
        ], [
            'staff_id' => $teacherStaff->id,
            'subject_name' => 'Bahasa Indonesia',
            'semester' => 'Semester 1',
            'score' => 88,
        ]);

        $seededStudents = $this->seedAbsensiDataset($guardian, $teacherStaff, $class, $student);

        $announcement = Announcement::query()->updateOrCreate([
            'title' => 'Mid Semester Briefing',
        ], [
            'content' => 'Please prepare the briefing materials for class teachers.',
            'status' => 'published',
            'approved_by' => $admin->id,
            'published_at' => now()->subDay(),
        ]);
        $announcement->classes()->syncWithoutDetaching([$class->id]);

        $facility = Facility::query()->updateOrCreate([
            'name' => 'Science Lab',
        ], [
            'location' => 'Building B',
            'status' => 'available',
        ]);

        RoomBooking::query()->updateOrCreate([
            'facility_id' => $facility->id,
            'purpose' => 'Science remediation session',
            'starts_at' => now()->addDay()->setTime(9, 0),
        ], [
            'staff_id' => $teacherStaff->id,
            'ends_at' => now()->addDay()->setTime(10, 30),
            'status' => 'scheduled',
            'notes' => 'Prepare microscopes before students arrive.',
        ]);

        $pendingApplicant->touch();
        $seededStudents->each->touch();
        $adminStaff->touch();
    }

    private function seedAbsensiDataset(Guardian $primaryGuardian, Staff $teacherStaff, SchoolClass $primaryClass, Student $primaryStudent): Collection
    {
        $classes = collect([
            'Kelas 5A' => $primaryClass,
            'Kelas 5B' => SchoolClass::query()->updateOrCreate([
                'name' => 'Kelas 5B',
            ], [
                'grade_level' => 'Grade 5',
                'academic_year' => '2025/2026',
                'room_name' => 'Mawar 2',
            ]),
            'Kelas 6A' => SchoolClass::query()->updateOrCreate([
                'name' => 'Kelas 6A',
            ], [
                'grade_level' => 'Grade 6',
                'academic_year' => '2025/2026',
                'room_name' => 'Anggrek 1',
            ]),
        ]);

        foreach (['Kelas 5A', 'Kelas 5B'] as $className) {
            ClassTeacherAssignment::query()->updateOrCreate([
                'school_class_id' => $classes[$className]->id,
                'staff_id' => $teacherStaff->id,
                'subject_name' => 'Bahasa Indonesia',
            ], [
                'is_homeroom' => $className === 'Kelas 5A',
            ]);
        }

        $guardianData = [
            'guardian@zen-core.test' => $primaryGuardian,
            'farida.guardian@zen-core.test' => Guardian::query()->updateOrCreate([
                'email' => 'farida.guardian@zen-core.test',
            ], [
                'name' => 'Farida Lestari',
                'relationship' => 'Parent',
                'phone' => '081245678901',
                'address_line' => 'Jl. Mawar No. 5',
            ]),
            'andika.guardian@zen-core.test' => Guardian::query()->updateOrCreate([
                'email' => 'andika.guardian@zen-core.test',
            ], [
                'name' => 'Andika Saputra',
                'relationship' => 'Parent',
                'phone' => '081256789012',
                'address_line' => 'Jl. Anggrek No. 7',
            ]),
        ];

        $students = collect([
            [
                'student_number' => $primaryStudent->student_number,
                'name' => $primaryStudent->name,
                'guardian_email' => 'guardian@zen-core.test',
                'class_name' => 'Kelas 5A',
            ],
            [
                'student_number' => 'STD-1003',
                'name' => 'Farhan Akbar',
                'guardian_email' => 'guardian@zen-core.test',
                'class_name' => 'Kelas 5A',
            ],
            [
                'student_number' => 'STD-1004',
                'name' => 'Sekar Puspa',
                'guardian_email' => 'farida.guardian@zen-core.test',
                'class_name' => 'Kelas 5A',
            ],
            [
                'student_number' => 'STD-1005',
                'name' => 'Dimas Prakoso',
                'guardian_email' => 'farida.guardian@zen-core.test',
                'class_name' => 'Kelas 5B',
            ],
            [
                'student_number' => 'STD-1006',
                'name' => 'Ayu Maharani',
                'guardian_email' => 'farida.guardian@zen-core.test',
                'class_name' => 'Kelas 5B',
            ],
            [
                'student_number' => 'STD-1007',
                'name' => 'Raka Pratama',
                'guardian_email' => 'andika.guardian@zen-core.test',
                'class_name' => 'Kelas 6A',
            ],
            [
                'student_number' => 'STD-1008',
                'name' => 'Laila Nuraini',
                'guardian_email' => 'andika.guardian@zen-core.test',
                'class_name' => 'Kelas 6A',
            ],
        ])->map(function (array $studentData) use ($classes, $guardianData) {
            $guardian = $guardianData[$studentData['guardian_email']];
            $schoolClass = $classes[$studentData['class_name']];

            $applicant = Applicant::query()->updateOrCreate([
                'student_number' => $studentData['student_number'],
            ], [
                'guardian_id' => $guardian->id,
                'school_class_id' => $schoolClass->id,
                'name' => $studentData['name'],
                'status' => 'approved',
                'address_line' => $guardian->address_line,
            ]);

            return Student::query()->updateOrCreate([
                'student_number' => $studentData['student_number'],
            ], [
                'applicant_id' => $applicant->id,
                'guardian_id' => $guardian->id,
                'school_class_id' => $schoolClass->id,
                'name' => $studentData['name'],
                'status' => 'active',
                'address_line' => $guardian->address_line,
            ]);
        })->keyBy('student_number');

        $attendanceRows = [
            ['student_number' => 'STD-1001', 'days_ago' => 0, 'check_in' => '06:45', 'check_out' => null, 'scan_count' => 1],
            ['student_number' => 'STD-1003', 'days_ago' => 0, 'check_in' => '06:52', 'check_out' => '14:12', 'scan_count' => 2],
            ['student_number' => 'STD-1004', 'days_ago' => 1, 'check_in' => '06:48', 'check_out' => '14:05', 'scan_count' => 2],
            ['student_number' => 'STD-1005', 'days_ago' => 0, 'check_in' => '07:01', 'check_out' => null, 'scan_count' => 1],
            ['student_number' => 'STD-1006', 'days_ago' => 0, 'check_in' => '07:04', 'check_out' => '13:58', 'scan_count' => 2],
            ['student_number' => 'STD-1007', 'days_ago' => 1, 'check_in' => '06:59', 'check_out' => null, 'scan_count' => 1],
            ['student_number' => 'STD-1008', 'days_ago' => 2, 'check_in' => '06:50', 'check_out' => '14:00', 'scan_count' => 2],
        ];

        foreach ($attendanceRows as $attendanceRow) {
            $student = $students[$attendanceRow['student_number']];
            $attendanceDate = today()->subDays($attendanceRow['days_ago']);

            AttendanceRecord::query()->updateOrCreate([
                'student_id' => $student->id,
                'attendance_date' => $attendanceDate->toDateString(),
            ], [
                'school_class_id' => $student->school_class_id,
                'check_in_at' => $attendanceDate->copy()->setTimeFromTimeString($attendanceRow['check_in']),
                'check_out_at' => $attendanceRow['check_out'] ? $attendanceDate->copy()->setTimeFromTimeString($attendanceRow['check_out']) : null,
                'scan_count' => $attendanceRow['scan_count'],
            ]);
        }

        return $students->values();
    }
}
