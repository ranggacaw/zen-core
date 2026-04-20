# Data Peserta Module - Schema & Scaffold

## Navigation & Grouping
Based on the UI requirements, the module is grouped in the sidebar navigation as follows:
- **Data Peserta** (Module / Menu Group)
  - Peserta Didik (Submodule)
  - Wali Murid (Submodule)
  - PPDB (Submodule)

This document outlines the database schema design and provides the scaffolded code (Migrations, Models, Controllers) for the **Data Peserta** module, built for a modular Laravel application (e.g., using `nwidart/laravel-modules`).

## 1. Database Schema Design

### A. `pesertas` (Students / Peserta Didik)
Stores active students currently enrolled in the institution.

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID/BigInt | PK, AI | Primary Key |
| `nis` | String | Unique | Nomor Induk Siswa |
| `nisn` | String | Unique, Nullable | National Student Number |
| `name` | String | | Full Name |
| `gender` | Enum | 'L', 'P' | Gender (Laki-laki, Perempuan) |
| `birth_place` | String | | Place of Birth |
| `birth_date` | Date | | Date of birth |
| `religion` | String | | Religion |
| `address` | Text | | Home Address |
| `status` | Enum | 'active', 'graduated', 'dropped' | Current student status |
| `user_id` | UUID/BigInt | FK, Nullable | Link to system User account (if any) |
| `created_at` | Timestamp | | |
| `updated_at` | Timestamp | | |
| `deleted_at` | Timestamp | Nullable | Soft Deletes |

### B. `walis` (Guardians / Wali Murid)
Stores parents or guardians.

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID/BigInt | PK, AI | Primary Key |
| `nik` | String | Unique, Nullable | National ID (KTP) |
| `name` | String | | Full Name |
| `relation_type` | Enum | 'father', 'mother', 'guardian' | Relationship to student |
| `phone` | String | Nullable | Contact number |
| `email` | String | Unique, Nullable | Guardian's email |
| `address` | Text | Nullable | Home Address |
| `profession` | String | Nullable | Guardian's job |
| `user_id` | UUID/BigInt | FK, Nullable | Link to system User account (if any) |
| `created_at` | Timestamp | | |
| `updated_at` | Timestamp | | |
| `deleted_at` | Timestamp | Nullable | Soft Deletes |

### C. `peserta_wali` (Pivot Table for Students and Guardians)
Handles the Many-to-Many relationship since one student can have multiple guardians (e.g., Mother & Father), and one guardian can have multiple students (siblings).

| Column | Type | Attributes | Description |
|---|---|---|---|
| `peserta_id` | UUID/BigInt | FK | References `pesertas.id` |
| `wali_id` | UUID/BigInt | FK | References `walis.id` |
| `is_primary` | Boolean | Default: false | Identifies the main contact |

### D. `ppdbs` (Penerimaan Peserta Didik Baru / Admissions)
Stores applicant data before they become active students.

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID/BigInt | PK, AI | Primary Key |
| `registration_number`| String | Unique | Generated Reg. No. |
| `name` | String | | Application Name |
| `previous_school` | String | Nullable | Asal Sekolah |
| `applied_path` | String | | Jalur pendaftaran (Zonasi, Prestasi, dll) |
| `status` | Enum | 'draft', 'pending', 'accepted', 'rejected' | Application Status |
| `document_url` | String | Nullable | Optional link to uploaded documents |
| `peserta_id` | UUID/BigInt | FK, Nullable | Maps to Peserta if accepted |
| `wali_id` | UUID/BigInt | FK, Nullable | Mapped guardian if accepted/provided |
| `created_at` | Timestamp | | |
| `updated_at` | Timestamp | | |
| `deleted_at` | Timestamp | Nullable | Soft Deletes |

---

## 2. Scaffold (Migrations, Models, Controllers)

To build this in your new project, you can generate the following structure inside your Laravel Module (e.g., `Modules/DataPeserta`).

### Migrations
Create these files using `php artisan module:make-migration create_pesertas_table DataPeserta`, etc.

**`..._create_pesertas_table.php`**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('pesertas', function (Blueprint $table) {
            $table->id();
            $table->string('nis')->unique();
            $table->string('nisn')->unique()->nullable();
            $table->string('name');
            $table->enum('gender', ['L', 'P']);
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('religion')->nullable();
            $table->text('address')->nullable();
            $table->enum('status', ['active', 'graduated', 'dropped'])->default('active');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down() {
        Schema::dropIfExists('pesertas');
    }
};
```

**`..._create_walis_table.php`**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('walis', function (Blueprint $table) {
            $table->id();
            $table->string('nik')->unique()->nullable();
            $table->string('name');
            $table->enum('relation_type', ['father', 'mother', 'guardian']);
            $table->string('phone')->nullable();
            $table->string('email')->unique()->nullable();
            $table->text('address')->nullable();
            $table->string('profession')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('peserta_wali', function (Blueprint $table) {
            $table->foreignId('peserta_id')->constrained('pesertas')->cascadeOnDelete();
            $table->foreignId('wali_id')->constrained('walis')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->primary(['peserta_id', 'wali_id']);
        });
    }

    public function down() {
        Schema::dropIfExists('peserta_wali');
        Schema::dropIfExists('walis');
    }
};
```

**`..._create_ppdbs_table.php`**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('ppdbs', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->string('name');
            $table->string('previous_school')->nullable();
            $table->string('applied_path');
            $table->enum('status', ['draft', 'pending', 'accepted', 'rejected'])->default('draft');
            $table->string('document_url')->nullable();
            $table->foreignId('peserta_id')->nullable()->constrained('pesertas')->nullOnDelete();
            $table->foreignId('wali_id')->nullable()->constrained('walis')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down() {
        Schema::dropIfExists('ppdbs');
    }
};
```

---

### Models

**`Modules/DataPeserta/App/Models/Peserta.php`**
```php
<?php
namespace Modules\DataPeserta\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Peserta extends Model {
    use SoftDeletes;
    protected $guarded = ['id'];

    public function walis() {
        return $this->belongsToMany(Wali::class, 'peserta_wali')
                    ->withPivot('is_primary');
    }

    public function user() {
        return $this->belongsTo(\App\Models\User::class);
    }
}
```

**`Modules/DataPeserta/App/Models/Wali.php`**
```php
<?php
namespace Modules\DataPeserta\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wali extends Model {
    use SoftDeletes;
    protected $guarded = ['id'];

    public function pesertas() {
        return $this->belongsToMany(Peserta::class, 'peserta_wali')
                    ->withPivot('is_primary');
    }

    public function user() {
        return $this->belongsTo(\App\Models\User::class);
    }
}
```

**`Modules/DataPeserta/App/Models/Ppdb.php`**
```php
<?php
namespace Modules\DataPeserta\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ppdb extends Model {
    use SoftDeletes;
    protected $guarded = ['id'];

    public function getStatusColorAttribute() {
        return match($this->status) {
            'accepted' => 'success',
            'rejected' => 'danger',
            'pending' => 'warning',
            default => 'secondary',
        };
    }
}
```

---

### Controllers

**`Modules/DataPeserta/App/Http/Controllers/PesertaController.php`**
```php
<?php
namespace Modules\DataPeserta\App\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\DataPeserta\App\Models\Peserta;
use Illuminate\Http\Request;

class PesertaController extends Controller {
    public function index() {
        $pesertas = Peserta::with('walis')->paginate(15);
        return view('datapeserta::peserta.index', compact('pesertas'));
    }

    public function create() {
        return view('datapeserta::peserta.create');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'nis' => 'required|unique:pesertas',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_date' => 'required|date'
        ]);
        
        Peserta::create($validated);
        return redirect()->route('peserta-murid.index')->with('success', 'Data saved.');
    }

    // show, edit, update, destroy methods omitted for brevity
}
```

**`Modules/DataPeserta/App/Http/Controllers/WaliController.php`**
```php
<?php
namespace Modules\DataPeserta\App\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\DataPeserta\App\Models\Wali;
use Illuminate\Http\Request;

class WaliController extends Controller {
    public function index() {
        $walis = Wali::with('pesertas')->paginate(15);
        return view('datapeserta::wali.index', compact('walis'));
    }
    // create, store, edit, update, destroy methods
}
```

**`Modules/DataPeserta/App/Http/Controllers/PpdbController.php`**
```php
<?php
namespace Modules\DataPeserta\App\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\DataPeserta\App\Models\Ppdb;
use Illuminate\Http\Request;

class PpdbController extends Controller {
    public function index() {
        $ppdbs = Ppdb::latest()->paginate(15);
        return view('datapeserta::ppdb.index', compact('ppdbs'));
    }

    public function accept(Ppdb $ppdb) {
        $ppdb->update(['status' => 'accepted']);
        // Here you would implement the logic to move the PPDB candidate to the Peserta module automatically.
        return redirect()->back()->with('success', 'Applicant accepted.');
    }
}
```