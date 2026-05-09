<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventLocationController;
use App\Http\Controllers\EventNoticeController;
use App\Http\Controllers\EventGuideController;
use App\Http\Controllers\PublicInvitationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\StripeController;
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
    Route::get('/events/{event}/check-in', [EventController::class, 'checkIn'])->name('events.checkIn');
    Route::get('/events/{event}/checkout', [EventController::class, 'checkout'])->name('events.checkout');
    Route::post('/events/{event}/pay', [StripeController::class, 'createSession'])->name('events.pay');
    Route::get('/stripe/success/{event}', [StripeController::class, 'success'])->name('stripe.success');
    Route::resource('events', EventController::class);
    
    // Event Locations CRUD
    Route::post('/events/{event}/locations', [EventLocationController::class, 'store'])->name('events.locations.store');
    Route::delete('/events/{event}/locations/{location}', [EventLocationController::class, 'destroy'])->name('events.locations.destroy');
    
    // Event Notices CRUD
    Route::post('/events/{event}/notices', [EventNoticeController::class, 'store'])->name('events.notices.store');
    Route::delete('/events/{event}/notices/{notice}', [EventNoticeController::class, 'destroy'])->name('events.notices.destroy');

    // Event Guides CRUD
    Route::post('/events/{event}/guides', [EventGuideController::class, 'store'])->name('events.guides.store');
    Route::delete('/events/{event}/guides/{guide}', [EventGuideController::class, 'destroy'])->name('events.guides.destroy');
    
    // Guest Check-in
    Route::post('/guests/{uuid}/check-in', [\App\Http\Controllers\Api\CheckInController::class, 'store'])->name('guests.checkIn.store');
    Route::delete('/guests/{guest}', [\App\Http\Controllers\GuestController::class, 'destroy'])->name('guests.destroy');
    Route::get('/events/{event}/guests/export', [EventController::class, 'exportGuests'])->name('events.guests.export');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Public Invitation & Guest Routes
Route::get('/g/{uuid}', [PublicInvitationController::class, 'guestLogin'])->name('guest.login');
Route::get('/{slug}', [PublicInvitationController::class, 'show'])->name('invitation.show');
Route::get('/{slug}/feed', [PublicInvitationController::class, 'feed'])->name('invitation.feed');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
