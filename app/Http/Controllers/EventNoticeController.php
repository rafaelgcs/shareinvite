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

        $notice->delete();

        return back()->with('success', 'Aviso removido com sucesso!');
    }
}
