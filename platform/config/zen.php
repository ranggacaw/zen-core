<?php

return [
    'upload_disk' => env('ZEN_UPLOAD_DISK', env('FILESYSTEM_DISK', 'local')),

    'address_reference' => [
        'provinces' => [
            ['code' => '31', 'name' => 'DKI Jakarta'],
            ['code' => '35', 'name' => 'Jawa Timur'],
        ],
        'regencies' => [
            '31' => [
                ['code' => '3171', 'name' => 'Jakarta Selatan'],
                ['code' => '3173', 'name' => 'Jakarta Barat'],
            ],
            '35' => [
                ['code' => '3578', 'name' => 'Kota Surabaya'],
                ['code' => '3573', 'name' => 'Kota Malang'],
            ],
        ],
        'districts' => [
            '3171' => [
                ['code' => '3171020', 'name' => 'Kebayoran Baru'],
                ['code' => '3171040', 'name' => 'Mampang Prapatan'],
            ],
            '3578' => [
                ['code' => '3578090', 'name' => 'Wonokromo'],
                ['code' => '3578150', 'name' => 'Rungkut'],
            ],
        ],
        'villages' => [
            '3171020' => [
                ['code' => '3171020001', 'name' => 'Senayan'],
                ['code' => '3171020002', 'name' => 'Gunung'],
            ],
            '3578090' => [
                ['code' => '3578090001', 'name' => 'Darmo'],
                ['code' => '3578090002', 'name' => 'Sawunggaling'],
            ],
        ],
    ],
];
