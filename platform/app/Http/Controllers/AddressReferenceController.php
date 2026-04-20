<?php

namespace App\Http\Controllers;

use App\Services\AddressReferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressReferenceController extends Controller
{
    public function __construct(protected AddressReferenceService $addressReference)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'provinces' => $this->addressReference->provinces(),
            'regencies' => $this->addressReference->regencies($request->string('province')->value()),
            'districts' => $this->addressReference->districts($request->string('regency')->value()),
            'villages' => $this->addressReference->villages($request->string('district')->value()),
        ]);
    }
}
