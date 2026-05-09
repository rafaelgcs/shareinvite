<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;

class CheckInController extends Controller
{
    public function store(Request $request, $uuid)
    {
        $guest = Guest::where('uuid', $uuid)->with('event')->first();

        if (!$guest) {
            return response()->json([
                'message' => 'Convite não encontrado.',
            ], 404);
        }

        // Verify ownership
        if ($guest->event->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Não autorizado.',
            ], 403);
        }

        if ($guest->checked_in_at) {
            return response()->json([
                'message' => 'Este convite já foi utilizado.',
                'guest' => $guest,
                'already_checked_in' => true,
            ], 422);
        }

        $guest->update([
            'checked_in_at' => now(),
        ]);

        return response()->json([
            'message' => 'Presença confirmada! Seja bem-vindo(a).',
            'guest' => $guest,
        ]);
    }

    public function show($uuid)
    {
        $guest = Guest::where('uuid', $uuid)->with('event')->first();

        if (!$guest) {
            return response()->json([
                'message' => 'Convite não encontrado.',
            ], 404);
        }

        // Verify ownership
        if ($guest->event->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Não autorizado.',
            ], 403);
        }

        return response()->json([
            'guest' => $guest,
        ]);
    }
}
