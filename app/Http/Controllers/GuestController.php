<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    /**
     * Remove the specified guest from storage.
     */
    public function destroy(Guest $guest)
    {
        // Ensure user owns the event associated with the guest
        if ($guest->event->user_id !== auth()->id()) {
            abort(403);
        }

        $guest->delete();

        return back()->with('success', 'Convidado removido da lista.');
    }
}
