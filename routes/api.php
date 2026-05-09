<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\RsvpController;
use App\Http\Controllers\Api\CheckInController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/events/{event}/rsvp', [RsvpController::class, 'store']);

Route::post('/events/{event}/rsvp', [RsvpController::class, 'store']);
