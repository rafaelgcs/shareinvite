<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuide;
use Illuminate\Http\Request;

class EventGuideController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:dress_code,best_man,bridesmaid,other',
        ]);

        $event->guides()->create($validated);

        return back()->with('success', 'Guia adicionado com sucesso!');
    }

    public function destroy(Event $event, EventGuide $guide)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $guide->delete();

        return back()->with('success', 'Guia removido com sucesso!');
    }
}
