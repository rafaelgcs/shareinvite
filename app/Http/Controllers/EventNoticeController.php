<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventNotice;
use Illuminate\Http\Request;

class EventNoticeController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        if (!$event->canBeEdited()) {
            return back()->with('error', 'Este evento não pode mais ser editado (limite de 2 dias após o evento).');
        }

        $validated = $request->validate([
            'message' => 'required|string|max:500',
            'priority' => 'required|in:low,normal,high',
        ]);

        $event->notices()->create($validated);

        return back()->with('success', 'Aviso adicionado com sucesso!');
    }

    public function destroy(Event $event, EventNotice $notice)
    {
        if ($event->user_id !== auth()->id() || $notice->event_id !== $event->id) {
            abort(403);
        }

        if (!$event->canBeEdited()) {
            return back()->with('error', 'Este evento não pode mais ser editado (limite de 2 dias após o evento).');
        }

        $notice->delete();

        return back()->with('success', 'Aviso removido com sucesso!');
    }
}
