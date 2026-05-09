<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\RsvpController;
use App\Http\Controllers\Api\CheckInController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/events/{event}/rsvp', [RsvpController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/guests/{uuid}', [CheckInController::class, 'show']);
    Route::post('/guests/{uuid}/check-in', [CheckInController::class, 'store']);
});
