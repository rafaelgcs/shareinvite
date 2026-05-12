<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class RsvpController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $maxExtra = $event->allow_extra_guests ? $event->max_extra_guests : 0;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'extra_guests' => 'nullable|integer|min:0|max:' . $maxExtra,
        ]);

        $extraGuests = $event->allow_extra_guests ? ($validated['extra_guests'] ?? 0) : 0;
        $totalNewGuests = 1 + $extraGuests; // The guest themselves + their extra guests

        // Calculate current total confirmed guests
        $currentGuestsCount = $event->guests()->count();
        $currentExtraGuestsCount = (int) $event->guests()->sum('extra_guests');
        $totalCurrentGuests = $currentGuestsCount + $currentExtraGuestsCount;

        // Check plan limits
        $plan = $event->plan;
        
        if ($plan && $plan->guest_limit > 0) {
            if (($totalCurrentGuests + $totalNewGuests) > $plan->guest_limit) {
                return response()->json([
                    'message' => 'Desculpe, o limite de convidados para este evento foi atingido.',
                    'limit_exceeded' => true,
                ], 422);
            }
        }

        // Save RSVP
        $guest = $event->guests()->create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'extra_guests' => $extraGuests,
            'confirmed_at' => now(),
        ]);

        // Store guest info in session
        session(['guest_id' => $guest->id, 'guest_name' => $guest->name]);

        return response()->json([
            'message' => 'Presença confirmada com sucesso!',
            'guest' => $guest,
        ], 201);
    }
}
