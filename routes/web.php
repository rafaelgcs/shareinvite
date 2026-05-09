<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventLocationController;
use App\Http\Controllers\EventNoticeController;
use App\Http\Controllers\PublicInvitationController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [EventController::class, 'index'])->name('dashboard');
    
    // Event Design
    Route::put('/events/{event}/design', [EventController::class, 'updateDesign'])->name('events.updateDesign');
    
    // Event CRUD
    Route::resource('events', EventController::class);
    
    // Event Locations CRUD
    Route::post('/events/{event}/locations', [EventLocationController::class, 'store'])->name('events.locations.store');
    Route::delete('/events/{event}/locations/{location}', [EventLocationController::class, 'destroy'])->name('events.locations.destroy');
    
    // Event Notices CRUD
    Route::post('/events/{event}/notices', [EventNoticeController::class, 'store'])->name('events.notices.store');
    Route::delete('/events/{event}/notices/{notice}', [EventNoticeController::class, 'destroy'])->name('events.notices.destroy');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Public Invitation Route
Route::get('/{slug}', [PublicInvitationController::class, 'show'])->name('invitation.show');
