<?php

namespace App\Http\Controllers;

use App\Domain\StudentLifecycle\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('students/index', [
            'students' => Student::query()
                ->with(['guardian:id,name,relationship', 'schoolClass:id,name', 'applicant:id,status'])
                ->latest()
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'nickname' => $student->nickname,
                    'student_number' => $student->student_number,
                    'gender' => $student->gender,
                    'guardian' => $student->guardian?->name,
                    'class' => $student->schoolClass?->name,
                    'status' => $student->status,
                    'ppdb_status' => $student->applicant?->status,
                ]),
        ]);
    }

    public function show(Student $student): Response
    {
        $student->load([
            'guardian:id,name,relationship,phone,email,address_line,province_name,regency_name,district_name,village_name',
            'schoolClass:id,name,grade_level,academic_year,room_name',
            'applicant:id,status,decision_notes',
        ]);

        return Inertia::render('students/show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'nickname' => $student->nickname,
                'student_number' => $student->student_number,
                'religion' => $student->religion,
                'phone' => $student->phone,
                'email' => $student->email,
                'avatar' => $student->avatar_url,
                'birth_place' => $student->birth_place,
                'birth_date' => $student->birth_date?->toDateString(),
                'gender' => $student->gender,
                'child_number' => $student->child_number,
                'child_of_total' => $student->child_of_total,
                'citizenship' => $student->citizenship,
                'join_date' => $student->join_date?->toDateString(),
                'end_date' => $student->end_date?->toDateString(),
                'postal_code' => $student->postal_code,
                'domicile_address' => $student->domicile_address,
                'status' => $student->status,
                'address_line' => $student->address_line,
                'province_name' => $student->province_name,
                'regency_name' => $student->regency_name,
                'district_name' => $student->district_name,
                'village_name' => $student->village_name,
                'guardian' => $student->guardian ? [
                    'name' => $student->guardian->name,
                    'relationship' => $student->guardian->relationship,
                    'phone' => $student->guardian->phone,
                    'email' => $student->guardian->email,
                    'address_line' => $student->guardian->address_line,
                    'province_name' => $student->guardian->province_name,
                    'regency_name' => $student->guardian->regency_name,
                    'district_name' => $student->guardian->district_name,
                    'village_name' => $student->guardian->village_name,
                ] : null,
                'school_class' => $student->schoolClass ? [
                    'name' => $student->schoolClass->name,
                    'grade_level' => $student->schoolClass->grade_level,
                    'academic_year' => $student->schoolClass->academic_year,
                    'room_name' => $student->schoolClass->room_name,
                ] : null,
                'ppdb' => $student->applicant ? [
                    'status' => $student->applicant->status,
                    'decision_notes' => $student->applicant->decision_notes,
                ] : null,
            ],
        ]);
    }

    public function updatePhoto(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $disk = config('zen.upload_disk', 'public');
        $oldAvatar = $student->avatar;
        $avatarPath = $validated['avatar']->store('students/avatars', $disk);

        $student->update([
            'avatar' => $avatarPath,
        ]);

        if ($oldAvatar) {
            Storage::disk($disk)->delete($oldAvatar);
        }

        return to_route('students.show', $student)->with('success', 'Student profile picture updated.');
    }
}
