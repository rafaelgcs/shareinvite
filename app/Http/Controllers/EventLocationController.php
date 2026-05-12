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

        if (!$event->canBeEdited()) {
            return back()->with('error', 'Este evento não pode mais ser editado (limite de 2 dias após o evento).');
        }

        if (!$event->canAccessFeature('multi_location') && $event->locations()->count() >= 1) {
            return back()->with('error', 'Seu plano permite apenas 1 local. Faça o upgrade para adicionar múltiplos locais.');
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

        if (!$event->canBeEdited()) {
            return back()->with('error', 'Este evento não pode mais ser editado (limite de 2 dias após o evento).');
        }

        $location->delete();

        return back()->with('success', 'Local removido com sucesso!');
    }
}
