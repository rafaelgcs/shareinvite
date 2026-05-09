<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventLocation;
use Illuminate\Http\Request;

class EventLocationController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'notes' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $event->locations()->create($validated);

        return back()->with('success', 'Local adicionado com sucesso!');
    }

    public function destroy(Event $event, EventLocation $location)
    {
        if ($event->user_id !== auth()->id() || $location->event_id !== $event->id) {
            abort(403);
        }

        $location->delete();

        return back()->with('success', 'Local removido com sucesso!');
    }
}
