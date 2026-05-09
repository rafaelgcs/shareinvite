<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Demo Route for the Invitation MVP
Route::get('/demo/invitation', function () {
    return Inertia::render('Public/InvitationView', [
        'event' => [
            'id' => 1,
            'title' => 'Casamento Maria & João',
            'cover_image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop',
            'logo' => null,
            'event_date' => '2026-10-15T16:00:00Z',
        ],
        'locations' => [
            [
                'id' => 1,
                'name' => 'Cerimônia Religiosa',
                'address' => 'Igreja da Sé, Praça da Sé - São Paulo, SP',
                'notes' => 'Chegue com 30 minutos de antecedência.',
                'latitude' => -23.55038,
                'longitude' => -46.63396,
            ],
            [
                'id' => 2,
                'name' => 'Festa & Recepção',
                'address' => 'Espaço Jardim América - São Paulo, SP',
                'notes' => 'Estacionamento com manobrista no local gratuito para convidados.',
                'latitude' => -23.5678,
                'longitude' => -46.6667,
            ]
        ],
        'notices' => [
            [
                'id' => 1,
                'message' => 'O uso de Traje Passeio Completo / Social é obrigatório para o evento.',
                'priority' => 'high'
            ],
            [
                'id' => 2,
                'message' => 'A confirmação de presença se encerra no dia 01/10/2026. Garanta sua vaga!',
                'priority' => 'low'
            ]
        ]
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
